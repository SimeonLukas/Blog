#!/bin/bash

# Deploy script for Simeon's Blog and Preview Image Generator

cd /Users/simeonstanek/Apps/BLOG-Homepage/simeonsblog/scripts/polotno

zola serve --port 1234  &
sleep 5
curl http://localhost:1234/llms.xml -o /Users/simeonstanek/Apps/BLOG-Homepage/simeonsblog/static/llms.txt
sed -i '' 's|http://127.0.0.1:1234|https://simeon.staneks.de|g' /Users/simeonstanek/Apps/BLOG-Homepage/simeonsblog/static/llms.txt
bun run index.ts

cd /Users/simeonstanek/Apps/BLOG-Homepage/simeonsblog/scripts/reel/src

# stop the server
kill "$(lsof -t -i:1234)"

# copy every markdown file and save an additional .md.txt version
find /Users/simeonstanek/Apps/BLOG-Homepage/simeonsblog/content -type f -name "*.md" | while IFS= read -r mdfile; do
    txtcopy="${mdfile}.txt"
    echo "Copying $mdfile -> $txtcopy"
    cp "$mdfile" "$txtcopy"
done

# read files in directory text and make for each .txt file a .json file in the metadata directory
for file in text/posts/*.txt; do
    filename=$(basename "$file" .txt)
    echo "Processing $file"

    # Extract base article name (remove -de/-en suffix)
    base_name="${filename%-de}"
    base_name="${base_name%-en}"

    # Skip if output video already exists
    if [ -f "/Users/simeonstanek/Apps/BLOG-Homepage/simeonsblog/content/posts/$base_name/video/$filename.mp4" ]; then
        echo "Video for $filename already exists, skipping..."
        continue
    fi

    mv "background/posts/$filename.jpg" "images/reel.jpg"
    bun run converter.js "$file" "metadata.json"
    bun run render
    echo "Processed $file"

    # Create video directory if it doesn't exist
    mkdir -p "/Users/simeonstanek/Apps/BLOG-Homepage/simeonsblog/content/posts/$base_name/video"

    # Move video to posts folder
    mv ../output/video.mp4 "/Users/simeonstanek/Apps/BLOG-Homepage/simeonsblog/content/posts/$base_name/video/$filename.mp4"
    sleep 1
done

# commit all changes
cd /Users/simeonstanek/Apps/BLOG-Homepage/simeonsblog

git pull
git add *
git commit -m "update content on $(date)"
git push