FROM clickhouse/clickhouse-server:24.3

# Copy the schema initialization script into the entrypoint directory
COPY ./clickhouse_schemas.sql /docker-entrypoint-initdb.d/init.sql
