#!/bin/bash

# Deploy script for Simeon's Blog and Prieview Image Generator

cd /Users/simeonstanek/Apps/BLOG-Homepage/simeonsblog/scripts

zola serve --drafts --port 1234 &

sleep 5
bun run index.ts 



# stop the server
kill $(lsof -t -i:1234)

# commit all changes
cd /Users/simeonstanek/Apps/BLOG-Homepage/simeonsblog

git pull
git add *
git commit -m "update content on $(date)"
git push