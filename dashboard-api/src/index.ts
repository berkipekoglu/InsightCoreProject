import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import {
  createClient as createClickHouseClient,
  ClickHouseClient,
} from "@clickhouse/client";
import * as Minio from "minio";
import { gunzip } from "zlib";
import { promisify } from "util";

// --- Server and DB Initialization ---
const server = Fastify({ logger: true });

// PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ClickHouse
const clickhouse = createClickHouseClient({
  url: `http://${process.env.CLICKHOUSE_HOST || "clickhouse"}:${
    process.env.CLICKHOUSE_PORT || 8123
  }`,
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
const gunzipAsync = promisify(gunzip);

// --- Fastify Decorators and Hooks ---

declare module "fastify" {
  interface FastifyRequest {
    user?: { userId: number; organizationId: number };
  }
}

const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const token = request.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      throw new Error("Authentication token not found.");
    }
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      organizationId: number;
    };
    request.user = decoded;
  } catch (err) {
    reply.code(401).send({
      error: "Authentication failed",
      message: (err as Error).message,
    });
  }
};

const authorizeProject = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (!request.user) {
    return reply.code(401).send({ error: "Authentication required" });
  }
  const { projectId } = request.params as any;
  const { organizationId } = request.user!;

  try {
    const res = await pool.query(
      "SELECT id FROM projects WHERE id = $1 AND organization_id = $2",
      [projectId, organizationId]
    );
    if (res.rows.length === 0) {
      return reply.code(403).send({
        error: "Forbidden",
        message: "You do not have access to this project.",
      });
    }
  } catch (err) {
    server.log.error(err, "Project authorization failed");
    reply.code(500).send({ error: "Internal Server Error" });
  }
};

// --- API Endpoints ---

// Phase 5: User Management
// 1. User Registration
server.post("/register", async (request, reply) => {
  const { email, password } = request.body as any;
  if (!email || !password) {
    return reply.code(400).send({ error: "Email and password are required" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Create an organization for the user
    const orgResult = await client.query(
      "INSERT INTO organizations (name) VALUES ($1) RETURNING id",
      [`${email.split("@")[0]}'s Organization`]
    );
    const organizationId = orgResult.rows[0].id;

    // Hash password and create user
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const userResult = await client.query(
      "INSERT INTO users (email, password_hash, organization_id) VALUES ($1, $2, $3) RETURNING id",
      [email, passwordHash, organizationId]
    );
    const userId = userResult.rows[0].id;

    await client.query("COMMIT");
    reply.code(201).send({ userId, organizationId });
  } catch (err) {
    await client.query("ROLLBACK");
    server.log.error(err);
    reply.code(500).send({ error: "Registration failed" });
  } finally {
    client.release();
  }
});

// 2. User Login
server.post("/login", async (request, reply) => {
  const { email, password } = request.body as any;
  if (!email || !password) {
    return reply.code(400).send({ error: "Email and password are required" });
  }

  try {
    const res = await pool.query(
      "SELECT id, password_hash, organization_id FROM users WHERE email = $1",
      [email]
    );
    if (res.rows.length === 0) {
      return reply.code(401).send({ error: "Invalid credentials" });
    }

    const user = res.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return reply.code(401).send({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, organizationId: user.organization_id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    reply.send({ token });
  } catch (err) {
    server.log.error(err);
    reply.code(500).send({ error: "Login failed" });
  }
});

// 3. Project Creation
server.post(
  "/projects",
  { preHandler: [authenticate] },
  async (request, reply) => {
    const { name } = request.body as any;
    if (!name) {
      return reply.code(400).send({ error: "Project name is required" });
    }

    const organizationId = request.user?.organizationId;
    if (!organizationId) {
      return reply.code(401).send({ error: "User organization not found" });
    }

    try {
      const projectId = `prj_${nanoid(12)}`;
      const res = await pool.query(
        "INSERT INTO projects (id, name, organization_id) VALUES ($1, $2, $3) RETURNING *",
        [projectId, name, organizationId]
      );

      reply.code(201).send(res.rows[0]);
    } catch (err) {
      server.log.error(err);
      reply.code(500).send({ error: "Failed to create project" });
    }
  }
);

// Phase 6: Data Endpoints

// Get Session List
server.get<{ Params: { projectId: string } }>(
  "/projects/:projectId/sessions",
  { preHandler: [authenticate, authorizeProject] },
  async (request, reply) => {
    const { projectId } = request.params as any;
    try {
      const resultSet = await clickhouse.query({
        query: `SELECT session_id, start_time, duration, device_type, browser, os, has_errors, has_rage_clicks FROM session_events WHERE project_id = {projectId:String} ORDER BY start_time DESC`,
        query_params: {
          projectId,
        },
      });
      const sessions = await resultSet.json();
      reply.send(sessions);
    } catch (err) {
      server.log.error(err, "Failed to fetch sessions from ClickHouse");
      reply.code(500).send({ error: "Failed to fetch sessions" });
    }
  }
);

// Get Session Replay Data
server.get(
  "/projects/:projectId/sessions/:sessionId/replay",
  { preHandler: [authenticate, authorizeProject] },
  async (request, reply) => {
    const { projectId, sessionId } = request.params as any;
    try {
      const objectStream = minioClient.listObjects(
        MINIO_BUCKET,
        `${projectId}/${sessionId}/`,
        true
      );
      let allEvents: any[] = [];

      for await (const obj of objectStream) {
        const dataStream = await minioClient.getObject(MINIO_BUCKET, obj.name);
        const chunks: Buffer[] = [];
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
    } catch (err) {
      server.log.error(err, "Failed to fetch replay data from MinIO");
      reply.code(500).send({ error: "Failed to fetch replay data" });
    }
  }
);

// Get Heatmap Data
server.get(
  "/projects/:projectId/heatmap",
  { preHandler: [authenticate, authorizeProject] },
  async (request, reply) => {
    const { projectId } = request.params as any;
    const { url } = request.query as any;

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
    } catch (err) {
      server.log.error(err, "Failed to fetch heatmap data from ClickHouse");
      reply.code(500).send({ error: "Failed to fetch heatmap data" });
    }
  }
);

// --- Server Start ---
const start = async () => {
  try {
    await server.listen({ port: 8080, host: "0.0.0.0" });
    server.log.info(`Dashboard API server listening on 8080`);
  } catch (err) {
    server.log.error(err, "Failed to start server");
    process.exit(1);
  }
};

start();
