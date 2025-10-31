#!/bin/bash

# Deploy script for Simeon's Blog and Prieview Image Generator

cd /Users/simeonstanek/Apps/BLOG-Homepage/simeonsblog/scripts/polotno

zola serve --port 1234 &

sleep 5
bun run index.ts
cd /Users/simeonstanek/Apps/BLOG-Homepage/simeonsblog/scripts/reel/src
# stop the server
kill $(lsof -t -i:1234)

# read files in directory text and make for each .,txt file a .json file in the metadata directory
for file in text/posts/*.txt; do
    filename=$(basename "$file" .txt)
    echo "Processing $file"
    
    # Skip if output video already exists
    if [ -f "../output/$filename.mp4" ]; then
        echo "Video for $filename already exists, skipping..."
        continue
    fi
    
    mv "background/posts/$filename.jpg" "images/reel.jpg"
    bun run converter.js "$file" "metadata.json"
    bun run render
    echo "Processed $file"
    mv ../output/video.mp4 ../output/"$filename".mp4
    sleep 1
done

# commit all changes
cd /Users/simeonstanek/Apps/BLOG-Homepage/simeonsblog

git pull
git add *
git commit -m "update content on $(date)"
git push