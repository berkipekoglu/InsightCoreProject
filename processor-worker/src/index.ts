import amqp, { ConsumeMessage } from 'amqplib';
import { createClient, ClickHouseClient } from '@clickhouse/client';
import * as Minio from 'minio';
import { gzip } from 'zlib';
import { promisify } from 'util';

// --- Constants and Configuration ---
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://insightcore_user:insightcore_password@rabbitmq';
const EVENTS_QUEUE = 'events_queue';

const CLICKHOUSE_HOST = process.env.CLICKHOUSE_HOST || 'clickhouse';
const CLICKHOUSE_PORT = parseInt(process.env.CLICKHOUSE_PORT || '8123', 10);
const CLICKHOUSE_USER = process.env.CLICKHOUSE_USER || 'insightcore_user';
const CLICKHOUSE_PASSWORD = process.env.CLICKHOUSE_PASSWORD || 'insightcore_password';
const CLICKHOUSE_DATABASE = process.env.CLICKHOUSE_DATABASE || 'insightcore_analytics';

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || 'minio';
const MINIO_PORT = parseInt(process.env.MINIO_PORT || '9000', 10);
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || 'insightcore_minio_user';
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || 'insightcore_minio_password';
const MINIO_BUCKET = 'rrweb-sessions';

const BATCH_SIZE = 100;
const BATCH_TIMEOUT = 5000;

const gzipAsync = promisify(gzip);

// --- Helper Functions ---
function toClickHouseDateTime(date: Date): string {
    const YYYY = date.getUTCFullYear();
    const MM = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const DD = date.getUTCDate().toString().padStart(2, '0');
    const hh = date.getUTCHours().toString().padStart(2, '0');
    const mm = date.getUTCMinutes().toString().padStart(2, '0');
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`;
}

const CLICKHOUSE_TABLE_QUERIES = [
    `CREATE TABLE IF NOT EXISTS heatmap_events (
        project_id String,
        session_id String,
        url String,
        x UInt16,
        y UInt16,
        event_type Enum8('mousemove' = 1, 'click' = 2),
        timestamp DateTime
    )
    ENGINE = MergeTree()
    PARTITION BY toYYYYMM(timestamp)
    ORDER BY (project_id, session_id, timestamp);`,
    `CREATE TABLE IF NOT EXISTS session_events (
        project_id String,
        session_id String,
        start_time DateTime,
        duration UInt32,
        device_type LowCardinality(String),
        browser LowCardinality(String),
        os LowCardinality(String),
        country_code LowCardinality(String),
        has_errors UInt8,
        has_rage_clicks UInt8
    )
    ENGINE = ReplacingMergeTree()
    PARTITION BY toYYYYMM(start_time)
    ORDER BY (project_id, session_id);`
];

async function ensureClickHouseTables() {
    for (const query of CLICKHOUSE_TABLE_QUERIES) {
        await clickhouse.command({ query });
    }
    console.log('ClickHouse tables ensured.');
}

// --- Client Initialization ---
let clickhouse: ClickHouseClient;
let minioClient: Minio.Client;

function initializeClients() {
    clickhouse = createClient({
        url: `http://${CLICKHOUSE_HOST}:${CLICKHOUSE_PORT}`,
        username: CLICKHOUSE_USER,
        password: CLICKHOUSE_PASSWORD,
        database: CLICKHOUSE_DATABASE,
    });

    minioClient = new Minio.Client({
        endPoint: MINIO_ENDPOINT,
        port: MINIO_PORT,
        useSSL: false,
        accessKey: MINIO_ACCESS_KEY,
        secretKey: MINIO_SECRET_KEY,
    });
}

// --- Types ---
type SdkEvent = {
    type: 'replay' | 'heatmap' | 'meta' | 'error' | 'metric';
    payload: any;
};

type SdkPayload = {
    projectId: string;
    sessionId: string;
    events: SdkEvent[];
};

// --- Batch Processing Logic ---
let messageBuffer: ConsumeMessage[] = [];
let batchTimeout: NodeJS.Timeout | null = null;

async function processBatch(channel: amqp.Channel) {
    if (batchTimeout) {
        clearTimeout(batchTimeout);
        batchTimeout = null;
    }
    if (messageBuffer.length === 0) {
        return;
    }

    const batch = [...messageBuffer];
    messageBuffer = [];

    console.log(`Processing batch of ${batch.length} messages.`);

    try {
        for (const msg of batch) {
            const sdkPayload: SdkPayload = JSON.parse(msg.content.toString());
            const { projectId, sessionId, events } = sdkPayload;

            let meta = {
                browser: '',
                os: '',
                device: 'desktop',
                start_time: new Date(),
                has_errors: 0,
            };

            const replayEvents: any[] = [];

            for (const event of events) {
                if (event.type === 'meta') {
                    meta.browser = event.payload.browser || '';
                    meta.os = event.payload.os || '';
                    meta.device = event.payload.device || 'desktop';
                    meta.start_time = new Date(event.payload.startTime);
                } else if (event.type === 'error') {
                    meta.has_errors = 1;
                } else if (event.type === 'replay') {
                    replayEvents.push(event.payload);
                }
            }

            await clickhouse.insert({
                table: 'session_events',
                values: [{
                    project_id: projectId,
                    session_id: sessionId,
                    start_time: toClickHouseDateTime(meta.start_time),
                    duration: 0,
                    device_type: meta.device,
                    browser: meta.browser,
                    os: meta.os,
                    country_code: '',
                    has_errors: meta.has_errors,
                    has_rage_clicks: 0,
                }],
                format: 'JSONEachRow',
            });
            console.log(`Inserted session metadata for ${sessionId}`);

            if (replayEvents.length > 0) {
                const objectName = `${projectId}/${sessionId}/${Date.now()}.json.gz`;
                const buffer = Buffer.from(JSON.stringify(replayEvents));
                const compressedBuffer = await gzipAsync(buffer);
                await minioClient.putObject(MINIO_BUCKET, objectName, compressedBuffer, compressedBuffer.length, {
                    'Content-Type': 'application/json',
                    'Content-Encoding': 'gzip',
                });
                console.log(`Stored ${replayEvents.length} replay events in MinIO: ${objectName}`);
            }
        }

        for (const msg of batch) {
            channel.ack(msg);
        }
        console.log(`Successfully processed and ACKed ${batch.length} messages.`);

    } catch (error) {
        console.error('Error processing batch, NACKing all messages:', error);
        for (const msg of batch) {
            channel.nack(msg, false, true);
        }
    }
}

// --- Worker Main Logic ---
async function startWorker() {
    console.log('Starting processor-worker...');
    initializeClients();
    await ensureClickHouseTables();

    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(EVENTS_QUEUE, { durable: true });
        await channel.prefetch(BATCH_SIZE);

        console.log(`Worker connected to RabbitMQ, waiting for messages in ${EVENTS_QUEUE}`);

        const bucketExists = await minioClient.bucketExists(MINIO_BUCKET);
        if (!bucketExists) {
            await minioClient.makeBucket(MINIO_BUCKET);
            console.log(`MinIO bucket '${MINIO_BUCKET}' created.`);
        }

        channel.consume(EVENTS_QUEUE, (msg: ConsumeMessage | null) => {
            if (msg) {
                messageBuffer.push(msg);
                if (!batchTimeout) {
                    batchTimeout = setTimeout(() => processBatch(channel), BATCH_TIMEOUT);
                }
                if (messageBuffer.length >= BATCH_SIZE) {
                    processBatch(channel);
                }
            }
        }, { noAck: false });

    } catch (error) {
        console.error('Failed to start worker, retrying in 5s:', error);
        setTimeout(startWorker, 5000);
    }
}

startWorker();
