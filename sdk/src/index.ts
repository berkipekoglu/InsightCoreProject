import { record } from 'rrweb';
import { onCLS, onFCP, onFID, onLCP, onTTFB } from 'web-vitals';

const SESSION_ID_KEY = '_insight_core_session_id';
const BATCH_INTERVAL = 10 * 1000; // 10 seconds

type InsightCoreConfig = {
    projectId: string;
    collectorUrl: string;
};

type EventType = 'replay' | 'heatmap' | 'metric' | 'error';

type BatchedPayload = {
    projectId: string;
    sessionId: string;
    events: { type: EventType; payload: any }[];
};

class InsightCoreSDK {
    private config: InsightCoreConfig | null = null;
    private sessionId: string;
    private eventBuffer: BatchedPayload['events'] = [];
    private stopRecording: (() => void) | undefined;

    constructor() {
        this.sessionId = this.getSessionId();
        this.initFromScriptTag();
    }

    private getSessionId(): string {
        let sid = sessionStorage.getItem(SESSION_ID_KEY);
        if (!sid) {
            sid = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            sessionStorage.setItem(SESSION_ID_KEY, sid);
        }
        return sid;
    }

    private initFromScriptTag(): void {
        const script = document.currentScript;
        if (!script) {
            console.error("InsightCore SDK: Could not find the script tag. Please ensure the script is loaded correctly.");
            return;
        }

        const projectId = script.getAttribute('data-project-id');
        const collectorUrl = script.getAttribute('data-collector-url');

        if (!projectId || !collectorUrl) {
            console.error("InsightCore SDK: 'data-project-id' and 'data-collector-url' attributes are required.");
            return;
        }

        this.init({ projectId, collectorUrl });
    }

    public init(config: InsightCoreConfig): void {
        if (this.config) {
            console.warn("InsightCore SDK has already been initialized.");
            return;
        }
        this.config = config;
        console.log("InsightCore SDK Initialized for project:", this.config.projectId);

        this.start();
    }

    private start(): void {
        if (!this.config) return;

        this.startRrwebRecording();
        this.captureWebVitals();
        this.captureErrors();

        setInterval(() => this.sendBatch(), BATCH_INTERVAL);
        window.addEventListener('beforeunload', () => this.sendBatch(true));
    }

    private addToBuffer(type: EventType, payload: any): void {
        this.eventBuffer.push({ type, payload });
    }

    private startRrwebRecording(): void {
        this.stopRecording = record({
            emit: (event, isCheckout) => {
                // Dual-channel collection
                const isHeatmapEvent = (event.type === 3 /* IncrementalSnapshot */ && 
                                       (event.data.source === 1 /* MouseMove */ || 
                                       (event.data.source === 2 /* MouseInteraction */ && event.data.type === 2 /* Click */)));

                if (isHeatmapEvent) {
                    this.addToBuffer('heatmap', event);
                } else {
                    this.addToBuffer('replay', event);
                }
            },
            // Aggressively throttle mousemove events
            sampling: {
                mousemove: 150, // ms
                scroll: 1000, // ms
            },
            // Mask all inputs by default for privacy
            maskAllInputs: true,
        });
    }

    private captureWebVitals(): void {
        const metricHandler = (metric: any) => this.addToBuffer('metric', metric);
        onCLS(metricHandler);
        onFCP(metricHandler);
        onFID(metricHandler);
        onLCP(metricHandler);
        onTTFB(metricHandler);
    }

    private captureErrors(): void {
        window.onerror = (message, source, lineno, colno, error) => {
            this.addToBuffer('error', {
                message,
                source,
                lineno,
                colno,
                error: error ? error.stack : null,
            });
        };
    }

    private sendBatch(useBeacon = false): void {
        if (!this.config || this.eventBuffer.length === 0) {
            return;
        }

        const payload: BatchedPayload = {
            projectId: this.config.projectId,
            sessionId: this.sessionId,
            events: this.eventBuffer,
        };

        // Clear buffer immediately
        this.eventBuffer = [];

        const data = JSON.stringify(payload);

        if (useBeacon) {
            if (navigator.sendBeacon) {
                navigator.sendBeacon(this.config.collectorUrl, data);
            } else {
                // Fallback for browsers that don't support sendBeacon
                fetch(this.config.collectorUrl, {
                    method: 'POST',
                    body: data,
                    headers: { 'Content-Type': 'application/json' },
                    keepalive: true,
                });
            }
        } else {
            fetch(this.config.collectorUrl, {
                method: 'POST',
                body: data,
                headers: { 'Content-Type': 'application/json' },
            }).catch(error => {
                console.error("InsightCore SDK: Error sending data:", error);
                // If sending fails, add events back to the buffer (optional, can lead to large buffers)
                // this.eventBuffer.unshift(...payload.events);
            });
        }
    }
}

// Automatically instantiate and initialize
new InsightCoreSDK();