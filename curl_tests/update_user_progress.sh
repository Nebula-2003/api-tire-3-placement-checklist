#!/bin/bash

# This script requires a running dev server on port 8787
# Replace USER_ID with the ID of the user you want to update the progress for
# Replace CHECKLIST_ID with the ID of the checklist item
# Replace YOUR_AUTH_TOKEN with a valid JWT token

curl -X PATCH http://localhost:8787/api/users/USER_ID/progress -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_AUTH_TOKEN" -d '{
  "checklistId": "CHECKLIST_ID",
  "completed": true
}'
