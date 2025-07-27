#!/bin/bash

# This script requires a running dev server on port 8787
# Replace CATEGORY_ID with the ID of the category you want to delete
# Replace YOUR_AUTH_TOKEN with a valid JWT token

curl -X DELETE http://localhost:8787/api/categories/CATEGORY_ID -H "Authorization: Bearer YOUR_AUTH_TOKEN"
