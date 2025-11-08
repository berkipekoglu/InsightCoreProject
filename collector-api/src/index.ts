import Fastify, { FastifyRequest } from 'fastify';
import amqp from 'amqplib';
import path from 'path';
import fastifyStatic from '@fastify/static';

const fastify = Fastify({
  logger: true,
});

// --- Static File Serving for SDK ---
fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../../sdk/dist'),
  prefix: '/', 
});

fastify.get('/sdk.js', (req, reply) => {
  reply.sendFile('index.js');
});


const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://insightcore_user:insightcore_password@rabbitmq';
const EVENTS_QUEUE = 'events_queue'; // As per Phase 3 spec

let channel: amqp.Channel;

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(EVENTS_QUEUE, { durable: true }); // durable:true makes the queue survive broker restarts
    fastify.log.info(`Connected to RabbitMQ and asserted queue: ${EVENTS_QUEUE}`)
  } catch (error) {
    fastify.log.error(error, 'Failed to connect to RabbitMQ');
    // Keep retrying connection
    setTimeout(connectRabbitMQ, 5000);
  }
}

/**
 * Configure Fastify to not parse application/json, but instead pass the raw buffer.
 * This is a performance optimization to avoid the overhead of JSON parsing.
 */
fastify.addContentTypeParser('application/json', { parseAs: 'buffer' }, (req, body, done) => {
  done(null, body);
});

/**
 * The /collect endpoint.
 * Its only job is to receive the raw request body and publish it to RabbitMQ.
 * It returns a 204 No Content response immediately.
 */
fastify.post('/collect', async (request: FastifyRequest<{ Body: Buffer }>, reply) => {
  try {
    // The body is already a Buffer thanks to the content type parser
    channel.sendToQueue(EVENTS_QUEUE, request.body, { persistent: true });
    
    // Immediately reply with 204 No Content and end the request.
    reply.code(204).send();

  } catch (error) {
    fastify.log.error(error, 'Failed to queue event');
    // If we can't queue, the service is effectively down. Return 500.
    reply.code(500).send({ status: 'error', message: 'Failed to queue event' });
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
