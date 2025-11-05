import Fastify from 'fastify';
import amqp from 'amqplib';

const fastify = Fastify({
  logger: true,
});

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://insightcore_user:insightcore_password@rabbitmq';
const COLLECT_QUEUE = 'collect_events';

let channel: amqp.Channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(COLLECT_QUEUE, { durable: true });
    fastify.log.info('Connected to RabbitMQ');
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

// Declare a route
fastify.post('/collect', async (request, reply) => {
  try {
    const message = JSON.stringify(request.body);
    channel.sendToQueue(COLLECT_QUEUE, Buffer.from(message), { persistent: true });
    return { status: 'ok', message: 'Event queued' };
  } catch (error) {
    fastify.log.error(error);
    reply.status(500).send({ status: 'error', message: 'Failed to queue event' });
  }
});

// Run the server!
const start = async () => {
  try {
    await connectRabbitMQ();
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
