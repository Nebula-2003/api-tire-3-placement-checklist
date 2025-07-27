#!/bin/bash

# This script requires a running dev server on port 8787
# Replace CATEGORY_ID with the ID of the category you want to add the checklist item to
# Replace YOUR_AUTH_TOKEN with a valid JWT token

curl -X POST http://localhost:8787/api/categories/CATEGORY_ID/checklist -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_AUTH_TOKEN" -d '{
  "title": "Async/Await",
  "resources": [
    {
      "title": "Async/Await MDN",
      "link": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function"
    }
  ]
}'
