import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

// --- Server and DB Initialization ---
const server = Fastify({ logger: true });
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

// --- Fastify Decorators and Hooks ---

declare module 'fastify' {
    interface FastifyRequest {
        user?: { userId: number; organizationId: number };
    }
}

const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const token = request.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            throw new Error('Authentication token not found.');
        }
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; organizationId: number };
        request.user = decoded;
    } catch (err) {
        reply.code(401).send({ error: 'Authentication failed', message: (err as Error).message });
    }
};

// --- API Endpoints ---

// 1. User Registration
server.post('/register', async (request, reply) => {
    const { email, password } = request.body as any;
    if (!email || !password) {
        return reply.code(400).send({ error: 'Email and password are required' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Create an organization for the user
        const orgResult = await client.query(
            'INSERT INTO organizations (name) VALUES ($1) RETURNING id',
            [`${email.split('@')[0]}'s Organization`]
        );
        const organizationId = orgResult.rows[0].id;

        // Hash password and create user
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        const userResult = await client.query(
            'INSERT INTO users (email, password_hash, organization_id) VALUES ($1, $2, $3) RETURNING id',
            [email, passwordHash, organizationId]
        );
        const userId = userResult.rows[0].id;

        await client.query('COMMIT');
        reply.code(201).send({ userId, organizationId });

    } catch (err) {
        await client.query('ROLLBACK');
        server.log.error(err);
        reply.code(500).send({ error: 'Registration failed' });
    } finally {
        client.release();
    }
});

// 2. User Login
server.post('/login', async (request, reply) => {
    const { email, password } = request.body as any;
    if (!email || !password) {
        return reply.code(400).send({ error: 'Email and password are required' });
    }

    try {
        const res = await pool.query('SELECT id, password_hash, organization_id FROM users WHERE email = $1', [email]);
        if (res.rows.length === 0) {
            return reply.code(401).send({ error: 'Invalid credentials' });
        }

        const user = res.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return reply.code(401).send({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, organizationId: user.organization_id },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        reply.send({ token });

    } catch (err) {
        server.log.error(err);
        reply.code(500).send({ error: 'Login failed' });
    }
});

// 3. Project Creation
server.post('/projects', { preHandler: [authenticate] }, async (request, reply) => {
    const { name } = request.body as any;
    if (!name) {
        return reply.code(400).send({ error: 'Project name is required' });
    }

    const organizationId = request.user?.organizationId;
    if (!organizationId) {
        return reply.code(401).send({ error: 'User organization not found' });
    }

    try {
        const projectId = `prj_${nanoid(12)}`;
        const res = await pool.query(
            'INSERT INTO projects (id, name, organization_id) VALUES ($1, $2, $3) RETURNING *',
            [projectId, name, organizationId]
        );

        reply.code(201).send(res.rows[0]);

    } catch (err) {
        server.log.error(err);
        reply.code(500).send({ error: 'Failed to create project' });
    }
});

// --- Server Start ---
const start = async () => {
    try {
        await server.listen({ port: 8080, host: '0.0.0.0' });
        server.log.info(`Dashboard API server listening on 8080`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();