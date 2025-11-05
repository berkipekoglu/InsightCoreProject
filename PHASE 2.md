We're moving to Phase 2: Client-Side Collector (SDK).

Adhering to the rules in `GEMINI.md` (performance, `rrweb` usage) and the Phase 1 architecture (especially `project_id`), create the magic `<script>` (JavaScript/TypeScript) code that the customer will add to their site.

This SDK's tasks must include:

1.  **Initialization:** The SDK must be configurable with a `project_id` and the `collector_url` (our API endpoint) it will send data to.
2.  **`rrweb` Integration:** It must initialize `rrweb.record`. However, to avoid killing performance, it must aggressively throttle/sample `mousemove` events.
3.  **Dual-Channel Collection (Important):**
    - **Heatmap Data:** Collect clicks (`click`) and throttled `mousemove` events in a separate `heatmapBuffer`.
    - **Replay Data:** Collect `rrweb`'s generated events (DOM changes, etc.) in a separate `replayBuffer`.
4.  **Additional Metrics:**
    - **Web Vitals:** Must use the `web-vitals` library to capture LCP, FID, CLS, etc.
    - **JS Errors:** Must use `window.onerror` to capture uncaught Javascript errors.
5.  **Batching and Sending:**
    - It must batch this data (replay, heatmap, vitals, errors) and send it to the `collector_url` (`/collect` API) every 10-15 seconds.
    - It _must_ use the `navigator.sendBeacon` API to prevent data loss when the user navigates away.
