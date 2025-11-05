import amqp, { ConsumeMessage } from 'amqplib';
import { createClient } from '@clickhouse/client';
import * as Minio from 'minio';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://insightcore_user:insightcore_password@rabbitmq';
const COLLECT_QUEUE = 'collect_events';

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

const clickhouse = createClient({
  url: `http://${CLICKHOUSE_HOST}:${CLICKHOUSE_PORT}`,
  username: CLICKHOUSE_USER,
  password: CLICKHOUSE_PASSWORD,
  database: CLICKHOUSE_DATABASE,
});

const minioClient = new Minio.Client({
  endPoint: MINIO_ENDPOINT,
  port: MINIO_PORT,
  useSSL: false, // Use true for HTTPS
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
});

function formatClickHouseDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

async function processMessage(msgContent: string) {
  const event = JSON.parse(msgContent);
  console.log('Processing event:', event);

  // Example: Determine event type and process accordingly
  if (event.type === 'heatmap_event') {
    await clickhouse.insert({
      table: 'heatmap_events',
      values: [{
        project_id: event.project_id,
        session_id: event.session_id,
        url: event.url,
        x: event.x,
        y: event.y,
        event_type: event.event_type, // 'mousemove' or 'click'
        timestamp: formatClickHouseDateTime(new Date(event.timestamp)),
      }],
      format: 'JSONEachRow',
    });
    console.log('Heatmap event inserted into ClickHouse');
  } else if (event.type === 'session_metadata') {
    await clickhouse.insert({
      table: 'session_events',
      values: [{
        project_id: event.project_id,
        session_id: event.session_id,
        start_time: formatClickHouseDateTime(new Date(event.start_time)),
        duration: event.duration,
        device_type: event.device_type,
        browser: event.browser,
        os: event.os,
        country_code: event.country_code,
        has_errors: event.has_errors ? 1 : 0,
        has_rage_clicks: event.has_rage_clicks ? 1 : 0,
      }],
      format: 'JSONEachRow',
    });
    console.log('Session metadata inserted into ClickHouse');
  } else if (event.type === 'rrweb_event_blob') {
    const objectName = `${event.project_id}/${event.session_id}/${Date.now()}.json`;
    const buffer = Buffer.from(JSON.stringify(event.data));
    await minioClient.putObject(MINIO_BUCKET, objectName, buffer, buffer.length, {
      'Content-Type': 'application/json',
    });
    console.log(`RRWeb event blob stored in MinIO: ${objectName}`);
  } else {
    console.warn('Unknown event type:', event.type);
  }
}

async function startWorker() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(COLLECT_QUEUE, { durable: true });

    console.log(`Worker connected to RabbitMQ and waiting for messages in ${COLLECT_QUEUE}`);

    // Ensure MinIO bucket exists
    const bucketExists = await minioClient.bucketExists(MINIO_BUCKET);
    if (!bucketExists) {
      await minioClient.makeBucket(MINIO_BUCKET, 'us-east-1'); // Region can be anything for local MinIO
      console.log(`MinIO bucket '${MINIO_BUCKET}' created.`);
    }

    channel.consume(COLLECT_QUEUE, async (msg: ConsumeMessage | null) => {
      if (msg) {
        const msgContent = msg.content.toString();
        try {
          await processMessage(msgContent);
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing message, nacking:', error);
          channel.nack(msg, false, false); // Requeue to false, allUpTo to false
        }
      }
    }, { noAck: false });

  } catch (error) {
    console.error('Failed to start worker:', error);
    process.exit(1);
  }
}

startWorker();
