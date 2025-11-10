"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const pg_1 = require("pg");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nanoid_1 = require("nanoid");
const client_1 = require("@clickhouse/client");
const Minio = __importStar(require("minio"));
const zlib_1 = require("zlib");
const util_1 = require("util");
// --- Server and DB Initialization ---
const server = (0, fastify_1.default)({ logger: true });
// Register CORS
server.register(cors_1.default, {
    origin: 'http://localhost:3001', // Allow requests from our frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow common methods
});
// PostgreSQL
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
// ClickHouse
const clickhouse = (0, client_1.createClient)({
    url: `http://${process.env.CLICKHOUSE_HOST || "clickhouse"}:${process.env.CLICKHOUSE_PORT || 8123}`,
    username: process.env.CLICKHOUSE_USER || "insightcore_user",
    password: process.env.CLICKHOUSE_PASSWORD || "insightcore_password",
    database: process.env.CLICKHOUSE_DATABASE || "insightcore_analytics",
});
// MinIO
const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT || "minio",
    port: parseInt(process.env.MINIO_PORT || "9002", 10),
    useSSL: false,
    accessKey: process.env.MINIO_ACCESS_KEY || "insightcore_minio_user",
    secretKey: process.env.MINIO_SECRET_KEY || "insightcore_minio_password",
});
const MINIO_BUCKET = "rrweb-sessions";
const JWT_SECRET = process.env.JWT_SECRET || "default-secret";
const gunzipAsync = (0, util_1.promisify)(zlib_1.gunzip);
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
    server.log.info('ClickHouse tables ensured.');
}
const authenticate = async (request, reply) => {
    try {
        const token = request.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            throw new Error("Authentication token not found.");
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        request.user = decoded;
    }
    catch (err) {
        reply.code(401).send({
            error: "Authentication failed",
            message: err.message,
        });
    }
};
const authorizeProject = async (request, reply) => {
    if (!request.user) {
        return reply.code(401).send({ error: "Authentication required" });
    }
    const { projectId } = request.params;
    const { organizationId } = request.user;
    try {
        const res = await pool.query('SELECT organization_id FROM projects WHERE id = $1', [projectId]);
        if (res.rows.length === 0) {
            return reply.code(404).send({ error: 'Not Found', message: 'Project not found.' });
        }
        const projectOrgId = res.rows[0].organization_id;
        if (projectOrgId !== organizationId) {
            return reply.code(403).send({ error: 'Forbidden', message: 'You do not have access to this project.' });
        }
        // If we are here, user is authorized
    }
    catch (err) {
        server.log.error(err, "Project authorization failed");
        reply.code(500).send({ error: "Internal Server Error" });
    }
};
// --- API Endpoints ---
// Phase 5: User Management
// 1. User Registration
server.post("/register", async (request, reply) => {
    const { email, password } = request.body;
    if (!email || !password) {
        return reply.code(400).send({ error: "Email and password are required" });
    }
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        // Create an organization for the user
        const orgResult = await client.query("INSERT INTO organizations (name) VALUES ($1) RETURNING id", [`${email.split("@")[0]}'s Organization`]);
        const organizationId = orgResult.rows[0].id;
        // Hash password and create user
        const saltRounds = 10;
        const passwordHash = await bcrypt_1.default.hash(password, saltRounds);
        const userResult = await client.query("INSERT INTO users (email, password_hash, organization_id) VALUES ($1, $2, $3) RETURNING id", [email, passwordHash, organizationId]);
        const userId = userResult.rows[0].id;
        await client.query("COMMIT");
        reply.code(201).send({ userId, organizationId });
    }
    catch (err) {
        await client.query("ROLLBACK");
        server.log.error(err);
        reply.code(500).send({ error: "Registration failed" });
    }
    finally {
        client.release();
    }
});
// 2. User Login
server.post("/login", async (request, reply) => {
    const { email, password } = request.body;
    if (!email || !password) {
        return reply.code(400).send({ error: "Email and password are required" });
    }
    try {
        const res = await pool.query("SELECT id, password_hash, organization_id FROM users WHERE email = $1", [email]);
        if (res.rows.length === 0) {
            return reply.code(401).send({ error: "Invalid credentials" });
        }
        const user = res.rows[0];
        const passwordMatch = await bcrypt_1.default.compare(password, user.password_hash);
        if (!passwordMatch) {
            return reply.code(401).send({ error: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, organizationId: user.organization_id }, JWT_SECRET, { expiresIn: "7d" });
        reply.send({ token });
    }
    catch (err) {
        server.log.error(err);
        reply.code(500).send({ error: "Login failed" });
    }
});
// 3. Project Creation
server.post("/projects", { preHandler: [authenticate] }, async (request, reply) => {
    const { name } = request.body;
    if (!name) {
        return reply.code(400).send({ error: "Project name is required" });
    }
    const organizationId = request.user?.organizationId;
    if (!organizationId) {
        return reply.code(401).send({ error: "User organization not found" });
    }
    try {
        const projectId = `prj_${(0, nanoid_1.nanoid)(12)}`;
        const res = await pool.query('INSERT INTO projects (id, name, organization_id) VALUES ($1, $2, $3) RETURNING *', [projectId, name, organizationId]);
        reply.code(201).send(res.rows[0]);
    }
    catch (err) {
        server.log.error(err, 'Failed to create project');
        reply.code(500).send({ error: 'Failed to create project' });
    }
});
server.get('/projects', { preHandler: [authenticate] }, async (request, reply) => {
    const organizationId = request.user?.organizationId;
    if (!organizationId) {
        return reply.code(401).send({ error: 'User organization not found' });
    }
    try {
        const res = await pool.query('SELECT * FROM projects WHERE organization_id = $1 ORDER BY created_at DESC', [organizationId]);
        reply.send(res.rows);
    }
    catch (err) {
        server.log.error(err, 'Failed to get projects');
        reply.code(500).send({ error: 'Failed to get projects' });
    }
});
// Phase 6: Data Endpoints
// Get Session List
server.get("/projects/:projectId/sessions", { preHandler: [authenticate, authorizeProject] }, async (request, reply) => {
    const { projectId } = request.params;
    try {
        const resultSet = await clickhouse.query({
            query: `SELECT session_id, start_time, duration, device_type, browser, os, has_errors, has_rage_clicks FROM session_events WHERE project_id = {projectId:String} ORDER BY start_time DESC`,
            query_params: {
                projectId,
            },
        });
        const sessions = await resultSet.json();
        reply.send(sessions);
    }
    catch (err) {
        server.log.error(err, "Failed to fetch sessions from ClickHouse");
        reply.code(500).send({ error: "Failed to fetch sessions" });
    }
});
// Get Session Replay Data
server.get("/projects/:projectId/sessions/:sessionId/replay", { preHandler: [authenticate, authorizeProject] }, async (request, reply) => {
    const { projectId, sessionId } = request.params;
    try {
        const objectStream = minioClient.listObjects(MINIO_BUCKET, `${projectId}/${sessionId}/`, true);
        let allEvents = [];
        for await (const obj of objectStream) {
            const dataStream = await minioClient.getObject(MINIO_BUCKET, obj.name);
            const chunks = [];
            for await (const chunk of dataStream) {
                chunks.push(chunk);
            }
            const compressedBuffer = Buffer.concat(chunks);
            const buffer = await gunzipAsync(compressedBuffer);
            const events = JSON.parse(buffer.toString("utf-8"));
            allEvents = allEvents.concat(events);
        }
        if (allEvents.length === 0) {
            return reply
                .code(404)
                .send({ error: "Replay data not found for this session." });
        }
        // Sort events by timestamp just in case
        allEvents.sort((a, b) => a.timestamp - b.timestamp);
        reply.send(allEvents);
    }
    catch (err) {
        server.log.error(err, "Failed to fetch replay data from MinIO");
        reply.code(500).send({ error: "Failed to fetch replay data" });
    }
});
// Get Heatmap Data
server.get("/projects/:projectId/heatmap", { preHandler: [authenticate, authorizeProject] }, async (request, reply) => {
    const { projectId } = request.params;
    const { url } = request.query;
    if (!url) {
        return reply
            .code(400)
            .send({ error: "URL query parameter is required." });
    }
    try {
        const resultSet = await clickhouse.query({
            query: `
                SELECT 
                    x, 
                    y, 
                    count() as value 
                FROM heatmap_events 
                WHERE project_id = {projectId:String} AND url = {url:String}
                GROUP BY x, y
            `,
            query_params: {
                projectId,
                url,
            },
        });
        const heatmapData = await resultSet.json();
        reply.send(heatmapData);
    }
    catch (err) {
        server.log.error(err, "Failed to fetch heatmap data from ClickHouse");
        reply.code(500).send({ error: "Failed to fetch heatmap data" });
    }
});
// --- Server Start ---
const start = async () => {
    try {
        await ensureClickHouseTables();
        await server.listen({ port: 8080, host: "0.0.0.0" });
        server.log.info(`Dashboard API server listening on 8080`);
    }
    catch (err) {
        server.log.error(err, "Failed to start server");
        process.exit(1);
    }
};
start();
