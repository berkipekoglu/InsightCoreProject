Phase 3: Ingestion Pipeline (API & Queue).

Based on the `GEMINI.md` rules (performance, Fastify) and the data structure sent by the Phase 2 SDK, code the `/collect` API endpoint using Node.js/Fastify.

This API's architecture must be:

1.  **Technology:** Node.js, Fastify (for high performance), and TypeScript.
2.  **Mission:** This API has _one_ job: take the incoming request (payload) and instantly throw it into the RabbitMQ queue. It should never process data, write to a DB, or perform complex validation.
3.  **Body Handling:** It should _not_ parse the incoming request body as JSON. It must receive it as a raw `Buffer` to maximize performance.
4.  **RabbitMQ Integration:**
    - It must connect to the RabbitMQ instance from Phase 1.
    - It must send the incoming raw `Buffer` to the `events_queue` (or our chosen name) with `persistent: true`.
5.  **Response:** It must immediately return a `204 No Content` response to the client (browser). It must _never_ make the browser wait.
