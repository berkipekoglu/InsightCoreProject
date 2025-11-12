-- ClickHouse Schemas for InsightCore

-- Table: heatmap_events
CREATE TABLE IF NOT EXISTS heatmap_events (
    project_id String,
    session_id String,
    url String,
    x UInt16,
    y UInt16,
    event_type Enum8('mousemove' = 1, 'click' = 2),
    timestamp DateTime
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (project_id, session_id, timestamp);

-- Table: session_events
CREATE TABLE IF NOT EXISTS session_events (
    project_id String,
    session_id String,
    start_time DateTime,
    duration UInt32,
    device_type LowCardinality(String),
    browser LowCardinality(String),
    os LowCardinality(String),
    country_code LowCardinality(String),
    has_errors UInt8,
    has_rage_clicks UInt8
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(start_time)
ORDER BY (project_id, session_id, start_time);
