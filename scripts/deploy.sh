#!/bin/bash

# Deploy script for Simeon's Blog

zola serve --base-port 1234
sleep 5
bun run index.ts
# wait for the server to start

# stop the server
kill $(lsof -t -i:1234)

# commit changes
git add . && git commit -m "update content on $(date)" && git push