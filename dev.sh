#!/bin/bash

echo "Initiating dev setup with local PostgreSQL instance..."

# Auto-detect compose command
if command -v podman-compose &> /dev/null; then
    COMPOSE_CMD="podman-compose"
elif command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
else
    echo "Error: Neither podman-compose nor docker-compose found!"
    exit 1
fi

echo "Using: $COMPOSE_CMD"

# Start PostgreSQL
echo "Starting PostgreSQL..."
$COMPOSE_CMD up -d

# Start the development server
echo "Starting development server..."
pnpm dev

# Cleanup function
cleanup() {
    echo "Shutting down..."
    $COMPOSE_CMD down
    exit 0
}

# Trap cleanup function on script exit
trap cleanup SIGINT SIGTERM EXIT