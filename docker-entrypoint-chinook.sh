#!/bin/bash
set -e

# Force output to stderr so it shows up in logs even if stdout is buffered
exec 1>&2

echo "=== Custom Chinook entrypoint: Starting ===" >&2
echo "Checking for existing database at /var/lib/postgresql/data..." >&2

# Remove data directory if PostgreSQL has been initialized
# PostgreSQL checks for PG_VERSION file to determine if database is initialized
if [ -f "/var/lib/postgresql/data/PG_VERSION" ]; then
    echo "WARNING: Found existing PostgreSQL data (PG_VERSION exists)" >&2
    echo "Removing existing PostgreSQL data directory to force reinitialization..." >&2
    echo "This ensures initialization scripts in /docker-entrypoint-initdb.d/ will run." >&2
    
    # Remove all files and directories
    find /var/lib/postgresql/data -mindepth 1 -delete 2>/dev/null || {
        # Fallback: try rm -rf if find fails
        echo "Using fallback removal method..." >&2
        rm -rf /var/lib/postgresql/data/* /var/lib/postgresql/data/.[!.]* 2>/dev/null || true
    }
    
    echo "Data directory cleared. PostgreSQL will reinitialize on startup." >&2
elif [ -d "/var/lib/postgresql/data" ] && [ "$(ls -A /var/lib/postgresql/data 2>/dev/null)" ]; then
    echo "WARNING: Data directory exists but PG_VERSION not found. Clearing anyway to be safe." >&2
    find /var/lib/postgresql/data -mindepth 1 -delete 2>/dev/null || {
        rm -rf /var/lib/postgresql/data/* /var/lib/postgresql/data/.[!.]* 2>/dev/null || true
    }
    echo "Data directory cleared." >&2
else
    echo "Data directory is empty or doesn't exist. PostgreSQL will initialize fresh." >&2
fi

echo "=== Calling original PostgreSQL entrypoint ===" >&2

# Call the original postgres entrypoint
exec /usr/local/bin/docker-entrypoint.sh "$@"

