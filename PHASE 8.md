Phase 8: Core Feature UI (Replay & Heatmaps).

We will code the heart of the product (as React components). Based on the `GEMINI.md` rules and the Phase 6 Data API:

1.  **Heatmap Viewer Component:**
    - Create the `/dashboard/projects/:id/heatmap` page.
    - This component must fetch data from the Phase 6 API in `heatmap.js` format.
    - It must use the `heatmap.js` library to visualize this data over an `iframe` (or page snapshot).
    - Must include toggles to switch between Device (Desktop/Mobile) and Map Type (Click/Move/Scroll).
2.  **Session List Page:**
    - Create the `/dashboard/projects/:id/sessions` page.
    - It must fetch the session list from the Phase 6 API and display it as a filterable table (as we discussed).
3.  **Session Replay Player Component:**
    - Create the `/dashboard/sessions/:session_id` page.
    - This component must include the `rrweb-player`.
    - It must fetch the `rrweb` JSON data from the Phase 6 API (`.../replay`) and feed it to the player.
    - It must design that "event-based" timeline (as we discussed) that highlights moments of Error and Rage Click.
