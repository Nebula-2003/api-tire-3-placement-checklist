#!/bin/bash

# This script requires a running dev server on port 8787

curl -X POST http://localhost:8787/api/auth/login -H "Content-Type: application/json" -d '{
  "email": "intern@example.com",
  "password": "password123"
}'
