Phase 6: Dashboard Data API.

Using the JWT authentication from Phase 5, code the secure API endpoints that allow a logged-in user to see _only their own_ (`project_id`) data.

This API must strictly follow the `GEMINI.md` multi-tenancy rules:

1.  **Security:** All endpoints must be JWT-protected. The API must read the `user_id`/`org_id` from the token and verify in PostgreSQL that the requested `project_id` belongs to that user/org.
2.  **Heatmap Endpoint:** `GET /api/projects/:project_id/heatmap?url=/homepage&device=mobile`
    - Must query the `heatmap_data` table in ClickHouse, filtering by `project_id`, `url`, and `device`.
    - Must return coordinates in a format `heatmap.js` understands (`{ x, y, value }`).
3.  **Session List Endpoint:** `GET /api/projects/:project_id/sessions`
    - Must query the PostgreSQL (or ClickHouse) `sessions` table to return a paginated/filterable list of sessions.
4.  **Session Replay Endpoint:** `GET /api/projects/:project_id/sessions/:session_id/replay`
    - This endpoint must read the `rrweb` JSON file we saved in Phase 4 (from `[project_id]/[session_id]/...`) from MinIO and stream it to the client.
