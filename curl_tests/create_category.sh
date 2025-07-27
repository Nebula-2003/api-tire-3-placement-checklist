#!/bin/bash

# This script requires a running dev server on port 8787
# Replace YOUR_AUTH_TOKEN with a valid JWT token

curl -X POST http://localhost:8787/api/categories -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_AUTH_TOKEN" -d '{
  "title": "JavaScript"
}'
