#!/bin/sh
# wait-for-it.sh: Wait for a host and port to become available.

set -e

HOST="$1"
shift
PORT="$1"
shift
CMD="$@"

# Wait for the service to be up
until nc -z "$HOST" "$PORT"; do
  >&2 echo "Waiting for $HOST:$PORT to be available..."
  sleep 1
done

>&2 echo "$HOST:$PORT is available, executing command: $CMD"
exec $CMD
