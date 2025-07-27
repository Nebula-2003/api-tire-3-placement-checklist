#!/bin/bash

# This script requires a running dev server on port 8787
# Replace CATEGORY_ID with the ID of the category you want to fetch

curl -X GET http://localhost:8787/api/categories/CATEGORY_ID
