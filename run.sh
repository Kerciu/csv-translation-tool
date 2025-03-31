#!/bin/bash

echo "🚀🚀🚀 Starting backend and frontend..."

(
  echo "Starting Actix backend (port 8000)..." 
  cd src/server/core && cargo run
) &

echo "⏳ Waiting for backend to start..."
while ! curl -s http://localhost:8000/api/text >/dev/null; do
  echo "test"
  sleep 1
done
echo "✅ Backend is ready!"

(
  echo "Starting React frontend (port 3000)..." 
  cd src/client && npm install && npm start
) &

wait