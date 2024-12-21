#!/bin/bash

# Deploy script for Simeon's Blog

zola serve --port 1234 &
sleep 5
bun --watch run index.ts

# stop the server
kill $(lsof -t -i:1234)

# commit changes
git add . && git commit -m "update content on $(date)" && git push