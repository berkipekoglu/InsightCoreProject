Phase 4: The Processor (Worker).

Using the infrastructure from Phase 1 (ClickHouse/MinIO/PostgreSQL) and Phase 3 (RabbitMQ), code the Node.js worker (TypeScript) that will consume the `events_queue`.

This worker's architecture must follow `GEMINI.md` rules (performance, batching, multi-tenancy):

1.  **Consumer:** It must use `amqplib` to consume the `events_queue` in `noAck: false` (manual acknowledgment) mode.
2.  **Batching:** It must process messages in batches (e.g., 1000 messages or a 5-second timeout), not one by one.
3.  **Parsing:** It must parse the raw `Buffer` (from Phase 3), extracting the `project_id` and other data (replayEvents, heatmapEvents, errors, vitals).
4.  **Data Distribution (Multi-Tenant):**
    - **MinIO (Replays):** Write the `replayEvents` (`rrweb` JSON) to MinIO using a path like `[project_id]/[session_id]/chunk-1.json.gz` (with gzip compression).
    - **ClickHouse (Analytics):** Bulk insert `heatmapEvents`, `vitals`, and `errors` data into the ClickHouse tables from Phase 1 (`heatmap_data`, etc.), tagged with the `project_id`.
    - **PostgreSQL (Metadata):** Write the session's high-level metadata (duration, browser, `has_errors` flag, MinIO file path, etc.) to the `sessions` table in PostgreSQL. (NOTE: We could also do this in a `session_events` table in ClickHouse. Analyze the `GEMINI.md` repos and decide which is more performant.)
5.  **Acknowledgment (Ack/Nack):** If all operations (MinIO, ClickHouse, PG) succeed, it must `channel.ack(msg)`. If an error occurs, it must `channel.nack(msg, false, true)` to requeue the message.
