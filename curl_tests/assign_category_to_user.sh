#!/bin/bash

# This script requires a running dev server on port 8787
# Replace USER_ID with the ID of the user you want to assign the category to
# Replace CATEGORY_ID with the ID of the category you want to assign
# Replace YOUR_AUTH_TOKEN with a valid JWT token

curl -X POST http://localhost:8787/api/users/USER_ID/assign -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_AUTH_TOKEN" -d '{
  "categoryId": "CATEGORY_ID"
}'
