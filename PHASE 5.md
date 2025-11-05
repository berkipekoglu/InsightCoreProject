Phase 5: User Management API.

Using the PostgreSQL schemas from Phase 1 (`users`, `organizations`, `projects`), code the API endpoints (Node.js/Fastify) that allow users to `register`, `login`, and `create new projects` (`/projects`).

Requirements:

1.  **Security:** Passwords must be hashed with `bcrypt`.
2.  **Authentication:** A successful `login` must return a **JWT (JSON Web Token)**. This token must contain the user's `user_id` and `organization_id`.
3.  **Project Creation:** When a user sends a `POST` request to the `/projects` endpoint (with a project name), the API must create a new project, generate a unique `project_id` (e.g., `prj_...`), and return it. This `project_id` is the key the Phase 2 SDK will use.
