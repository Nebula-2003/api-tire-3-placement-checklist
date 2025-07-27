#!/bin/bash

# This script requires a running dev server on port 8787

curl -X POST http://localhost:8787/api/auth/register -H "Content-Type: application/json" -d '{
  "name": "Intern User",
  "email": "intern@example.com",
  "password": "password123",
  "role": "intern"
}'
