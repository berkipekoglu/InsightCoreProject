# Important Information

## Project Goal

Build a full-stack, multi-tenant SaaS application for session replay, heatmaps, and web analytics, inspired by Highlight.io and PostHog.

## Core Technologies

*   **Frontend:** Next.js (or Vite + React), TypeScript, Tailwind CSS, `rrweb-player`.
*   **Collector API:** Node.js, Fastify, TypeScript.
*   **Queue:** RabbitMQ.
*   **Processor Worker:** Node.js, TypeScript.
*   **Analytics Database:** ClickHouse.
*   **Primary Database:** PostgreSQL.
*   **File Storage:** MinIO.
*   **Orchestration:** Docker Compose.

## Database Credentials (from `docker-compose.yml`)

*   **PostgreSQL:**
    *   DB: `insightcore_db`
    *   User: `insightcore_user`
    *   Password: `insightcore_password`
*   **ClickHouse:**
    *   DB: `insightcore_analytics`
    *   User: `insightcore_user`
    *   Password: `insightcore_password`
*   **RabbitMQ:**
    *   User: `insightcore_user`
    *   Password: `insightcore_password`
*   **MinIO:**
    *   User: `insightcore_minio_user`
    *   Password: `insightcore_minio_password`

## Service Ports (Host)

*   `postgres`: 5432
*   `clickhouse` (HTTP): 8123
*   `clickhouse` (Client): 9000
*   `rabbitmq` (AMQP): 5672
*   `rabbitmq` (Management): 15672
*   `minio` (API): 9002
*   `minio` (Console): 9001
*   `collector-api`: 3000
