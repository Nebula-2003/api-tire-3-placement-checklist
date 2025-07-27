#!/bin/bash

# This script requires a running dev server on port 8787

curl -X POST http://localhost:8787/api/auth/register -H "Content-Type: application/json" -d '{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"
}'
