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
const MINIO_PORT = parseInt(process.env.MINIO_PORT || '9002', 10); // Corrected Port for API
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || 'insightcore_minio_user';
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || 'insightcore_minio_password';
const MINIO_BUCKET = 'rrweb-sessions';

const BATCH_SIZE = 100; // Max number of messages per batch
const BATCH_TIMEOUT = 5000; // 5 seconds

const gzipAsync = promisify(gzip);

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
    ENGINE = MergeTree()
    PARTITION BY toYYYYMM(start_time)
    ORDER BY (project_id, start_time);`
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
        clickhouse_settings: {
            async_insert: 1,
            wait_for_async_insert: 0,
        },
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
    type: 'replay' | 'heatmap' | 'metric' | 'error';
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

    // Data accumulators
    const heatmapEvents: any[] = [];
    const sessionMetadata: { [sessionId: string]: any } = {};
    const replayData: { [sessionId: string]: { projectId: string, events: any[] } } = {};

    try {
        // 1. Parse and organize data from all messages in the batch
        for (const msg of batch) {
            const sdkPayload: SdkPayload = JSON.parse(msg.content.toString());
            const { projectId, sessionId, events } = sdkPayload;

            if (!sessionMetadata[sessionId]) {
                sessionMetadata[sessionId] = { project_id: projectId, session_id: sessionId, has_errors: 0, has_rage_clicks: 0, start_time: new Date() };
            }
            if (!replayData[sessionId]) {
                replayData[sessionId] = { projectId, events: [] };
            }

            for (const event of events) {
                switch (event.type) {
                    case 'heatmap':
                        heatmapEvents.push({
                            project_id: projectId,
                            session_id: sessionId,
                            url: event.payload.data.href || '',
                            x: event.payload.data.x,
                            y: event.payload.data.y,
                            event_type: event.payload.data.source === 1 ? 'mousemove' : 'click',
                            timestamp: new Date(event.payload.timestamp),
                        });
                        break;
                    case 'replay':
                        replayData[sessionId].events.push(event.payload);
                        if (event.payload.type === 2) { // Meta event
                            sessionMetadata[sessionId].start_time = new Date(event.payload.timestamp);
                            sessionMetadata[sessionId].device_type = 'desktop'; // Placeholder
                            sessionMetadata[sessionId].browser = event.payload.data.payload.browser;
                            sessionMetadata[sessionId].os = event.payload.data.payload.os;
                        }
                        break;
                    case 'error':
                        sessionMetadata[sessionId].has_errors = 1;
                        break;
                    case 'metric':
                        // You can add logic here to update session metadata with web vitals
                        break;
                }
            }
        }

        // 2. Perform bulk operations
        // Upload replay data to MinIO
        for (const [sessionId, data] of Object.entries(replayData)) {
            if (data.events.length === 0) continue;
            const objectName = `${data.projectId}/${sessionId}/${Date.now()}.json.gz`;
            const buffer = Buffer.from(JSON.stringify(data.events));
            const compressedBuffer = await gzipAsync(buffer);
            await minioClient.putObject(MINIO_BUCKET, objectName, compressedBuffer, compressedBuffer.length, {
                'Content-Type': 'application/json',
                'Content-Encoding': 'gzip',
            });
            console.log(`Stored ${data.events.length} replay events in MinIO: ${objectName}`);
        }

        // Bulk insert heatmap events to ClickHouse
        if (heatmapEvents.length > 0) {
            await clickhouse.insert({
                table: 'heatmap_events',
                values: heatmapEvents,
                format: 'JSONEachRow',
            });
            console.log(`Inserted ${heatmapEvents.length} heatmap events into ClickHouse.`);
        }

        // Bulk insert session metadata to ClickHouse
        const sessionValues = Object.values(sessionMetadata);
        if (sessionValues.length > 0) {
            await clickhouse.insert({
                table: 'session_events',
                values: sessionValues,
                format: 'JSONEachRow',
            });
            console.log(`Inserted/Updated ${sessionValues.length} session metadata records in ClickHouse.`);
        }

        // 3. If all successful, ACK all messages in the batch
        for (const msg of batch) {
            channel.ack(msg);
        }
        console.log(`Successfully processed and ACKed ${batch.length} messages.`);

    } catch (error) {
        console.error('Error processing batch, NACKing all messages:', error);
        // 4. If any operation fails, NACK all messages to requeue them
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
        await channel.prefetch(BATCH_SIZE); // Fair dispatch

        console.log(`Worker connected to RabbitMQ, waiting for messages in ${EVENTS_QUEUE}`);

        // Ensure MinIO bucket exists
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