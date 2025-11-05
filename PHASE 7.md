Phase 7: Dashboard UI (Core & Onboarding).

Following the UI/UX principles in `GEMINI.md` (modern, Vercel/Linear aesthetic) and connecting to the Phase 5 APIs, code the foundation of the dashboard UI using Next.js (App Router) and Tailwind CSS.

Pages to create:

1.  `/login`: The login form.
2.  `/register`: The registration form.
3.  `/onboarding` (or `/new-project`): The screen where a user creates their first project and copies the `<script>` tag with their `project_id` (that "30-second setup" screen we discussed).
4.  `/dashboard` (Main Panel): The main protected homepage. It should display basic widget cards (Rage Clicks, JS Errors, etc.) using data from the Phase 6 API.
