#!/bin/bash

# Deploy script for Simeon's Blog and Prieview Image Generator

cd /Users/simeonstanek/Apps/BLOG-Homepage/simeonsblog/scripts

zola serve --port 1234 &

sleep 5
bun run index.ts
cd /Users/simeonstanek/Apps/BLOG-Homepage/simeonsblog/scripts/reel/src

# read files in directory text and make for each .,txt file a .json file in the metadata directory
for file in text/*.txt; do
    filename=$(basename "$file" .txt)
    bun run converter.js "$file" "metadata.json"
    bun run render
    echo "Processed $file"
    # rename output/video.mp4 to output/$filename.mp4
    mv ../output/video.mp4 ../output/"$filename".mp4
    sleep 1
done


# stop the server
kill $(lsof -t -i:1234)

# commit all changes
cd /Users/simeonstanek/Apps/BLOG-Homepage/simeonsblog

git pull
git add *
git commit -m "update content on $(date)"
git push