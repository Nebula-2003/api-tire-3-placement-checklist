#!/bin/bash

# This script requires a running dev server on port 8787
# Replace USER_ID with the ID of the user you want to fetch
# Replace YOUR_AUTH_TOKEN with a valid JWT token

curl -X GET http://localhost:8787/api/users/USER_ID -H "Authorization: Bearer YOUR_AUTH_TOKEN"
