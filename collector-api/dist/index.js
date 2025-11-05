"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const amqplib_1 = __importDefault(require("amqplib"));
const fastify = (0, fastify_1.default)({
    logger: true,
});
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://insightcore_user:insightcore_password@rabbitmq';
const COLLECT_QUEUE = 'collect_events';
let channel;
async function connectRabbitMQ() {
    try {
        const connection = await amqplib_1.default.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue(COLLECT_QUEUE, { durable: true });
        fastify.log.info('Connected to RabbitMQ');
        // Basic consumer for demonstration purposes
        channel.consume(COLLECT_QUEUE, (msg) => {
            if (msg) {
                fastify.log.info(`Received message: ${msg.content.toString()}`);
                channel.ack(msg);
            }
        }, { noAck: false });
    }
    catch (error) {
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
    }
    catch (error) {
        fastify.log.error(error);
        reply.status(500).send({ status: 'error', message: 'Failed to queue event' });
    }
});
// Run the server!
const start = async () => {
    try {
        await connectRabbitMQ();
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=index.js.map