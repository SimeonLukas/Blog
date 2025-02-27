+++
title = "Automatic Cover Image Generation for Zola Blogs with Bun, TypeScript and Polotno"
date = 2025-02-27
description = "A script that automatically generates various images for different platforms from blog post metadata - with consistent design but individual elements based on each article's content."
[taxonomies]
tags = ["programmierung", "zola", "typescript", "polotno", "bun", "automatisierung", "bloggen", "rss", "bildgenerierung"] 
[extra]
comment = true
+++

# The Genesis: Why Generate Images Automatically?

I love podcasts and listen to them a lot, which is why I have [Antennapod](https://antennapod.org/) installed on my Android phone. It's my favorite podcatcher, which occasionally doubles as a feed reader. I noticed that simple RSS feeds lack cover images, and I wanted to change that for my feed, plus I needed preview images for social media anyway. Every blog post needs an attractive title image to grab attention on social media, RSS feeds, and the website itself. However, manually creating individual images for each article is time-consuming and requires significant effort.

I decided to automate this process: A script that automatically generates various images for different platforms from my blog post metadata - with consistent design but individual elements based on each article's content.

<div style="
    text-align: center;
    display: flex;
    overflow: scroll;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;">
<img src="/posts/20241120//images/de/feed.jpg" alt="RSS Feed Image">
<img src="/posts/20241120//images/en/feed.jpg" alt="RSS Feed Image">
<img src="/posts/20241120//images/de/instagram1.jpg" alt="Instagram Image 1">
<img src="/posts/20241120//images/de/instagram2.jpg" alt="Instagram Image 2">
<img src="/posts/20241120//images/en/instagram1.jpg" alt="Instagram Image 1">
<img src="/posts/20241120//images/en/instagram2.jpg" alt="Instagram Image 2">
<img src="/posts/20241120//images/de/preview.jpg" alt="OG Image">
<img src="/posts/20241120//images/en/preview.jpg" alt="OG Image">
</div>

# The Technology: Zola, Bun, TypeScript, and Polotno

## Technical Solution Overview

My solution uses the following technologies:
- **Zola** as static site generator for the blog and RSS feed server
- **Bun** as JavaScript runtime (faster than Node.js)
- **TypeScript** for programming logic
- **Polotno** for programmatic image generation
- **RSS feeds** as data source for post information

The system generates four different image formats for each blog post:
1. An OG image for social media previews
2. An Instagram format 1
3. An Instagram format 2
4. A feed image for RSS readers

Additionally, all images are automatically created for different language versions of the blog.

## The Deployment Script

Here's the bash script that starts the entire process:

```bash
#!/bin/bash
# Blog publishing script
cd /Users/simeonstanek/Apps/BLOG-Homepage/simeonsblog/scripts

# start the server
zola serve --port 1234 &
sleep 5
# run the generator
bun run index.ts

# stop the server
kill $(lsof -t -i:1234)

# commit all changes
cd /Users/simeonstanek/Apps/BLOG-Homepage/simeonsblog
git pull
git add *
git commit -m "update content on $(date)"
git push
```

This script performs the following steps:
1. Changes to the scripts directory
2. Starts the Zola server in the background (for RSS feed)
3. Waits 5 seconds for the server to fully start
4. Runs the TypeScript script with Bun
5. Stops the Zola server
6. Commits changes and pushes to Git repository

## The Image Generator: Under the Hood

Now let's look at the core of the solution - the TypeScript script that does the actual work:

```typescript
import { hash } from "bun";
const fs = require("fs");
const { DOMParser } = require("xmldom");
const { createInstance } = require("polotno-node");

// Main function controlling the entire process
async function run(x, lang) {
    let titles = [];
    let dates = [];
    let urls = [];
    let content = [];
    let languages = "de";

    // Fetch and process RSS feed
    const data = fetch(lang)
        .then((response) => response.text())
        .then((str) => {
            let parser = new DOMParser();
            let xml = parser.parseFromString(str, "text/xml");
            let items = xml.getElementsByTagName("item");
            languages = xml.getElementsByTagName("language")[0].childNodes[0].nodeValue;

            // Extract information from RSS feed
            for (let o = 0; o < items.length; o++) {
                titles.push(items[o].getElementsByTagName("title")[0].childNodes[0].nodeValue);

                let date = new Date(items[o].getElementsByTagName("pubDate")[0].childNodes[0].nodeValue);
                let options = { year: "numeric", month: "long", day: "numeric" };
                let formattedDate = date.toLocaleDateString("de-DE", options);
                dates.push(formattedDate);

                let url = items[o].getElementsByTagName("link")[0].childNodes[0].nodeValue;
                url = url.split("/");
                url = url[url.length - 3] + "/" + url[url.length - 2];
                urls.push(url);

                let description = items[o].getElementsByTagName("description")[0].childNodes[0].nodeValue;
                if (description.length > 500) {
                    description = description.substring(0, 500) + "...";
                }
                description = description.replace(/<[^>]*>?/gm, "");
                content.push(description);
            }

            // Adjust templates and generate images
            for (let k = 0; k < titles.length; k++) {
                let template = JSON.parse(fs.readFileSync("data" + "/" + x, "utf8"));
                for (let i = 0; i < template.pages.length; i++) {
                    template.pages[i].background = "linear-gradient(228deg,white 0%," + getRGB(titles[k]) + " 100%)";
                    for (let j = 0; j < template.pages[i].children.length; j++) {
                        if (template.pages[i].children[j].name == "title") {
                            template.pages[i].children[j].text = titles[k];
                        }
                        if (template.pages[i].children[j].name == "date") {
                            template.pages[i].children[j].text = "Simeon Stanek :: " + dates[k];
                        }
                        if (template.pages[i].children[j].name == "hintergrundtext") {
                            template.pages[i].children[j].text = content[k];
                        }
                    }
                }
                exporter(template, k, urls[k], x, languages);
            }
        });

    // Function for image generation and storage
    async function exporter(template, i, url, x, languages) {
        fs.mkdirSync("../content/" + url + "/images/" + languages, { recursive: true });

        if (x == "ogimage.json" && !fs.existsSync("../content/" + url + "/images/" + languages + "/preview.jpg")) {
            let instance = await createInstance({ key: "[your-api-key]" });
            let pdfBase64 = await instance.jsonToImageBase64(template, { mimeType: "image/jpeg" });
            fs.writeFileSync("../content/" + url + "/images/" + languages + "/preview.jpg", pdfBase64, "base64");
            instance.close();
        }
        if (x == "instagram1.json" && !fs.existsSync("../content/" + url + "/images/" + languages + "/instagram1.jpg")) {
            let instance = await createInstance({ key: "[your-api-key]" });
            let pdfBase64 = await instance.jsonToImageBase64(template, { mimeType: "image/jpeg" });
            fs.writeFileSync("../content/" + url + "/images/" + languages + "/instagram1.jpg", pdfBase64, "base64");
            instance.close();
        }
        if (x == "instagram2.json" && !fs.existsSync("../content/" + url + "/images/" + languages + "/instagram2.jpg")) {
            let instance = await createInstance({ key: "[your-api-key]" });
            let pdfBase64 = await instance.jsonToImageBase64(template, { mimeType: "image/jpeg" });
            fs.writeFileSync("../content/" + url + "/images/" + languages + "/instagram2.jpg", pdfBase64, "base64");
            instance.close();
        }
        if (x == "feed.json" && !fs.existsSync("../content/" + url + "/images/" + languages + "/feed.jpg")) {
            let instance = await createInstance({ key: "[your-api-key]" });
            let pdfBase64 = await instance.jsonToImageBase64(template, { mimeType: "image/jpeg" });
            fs.writeFileSync("../content/" + url + "/images/" + languages + "/feed.jpg", pdfBase64, "base64");
            instance.close();
        }
    }
}

// Function to generate RGB color from string
function getRGB(str) {
    let hashed = hash(str);
    let result = hashed.toString(16).substring(0, 6);
    return "#" + result;
}

// Main function for image generation
async function generate() {
    run("ogimage.json", "http://127.0.0.1:1234/rss.xml");

    setTimeout(() => {
        run("instagram1.json", "http://127.0.0.1:1234/rss.xml");
    }, 1000);

    setTimeout(() => {
        run("instagram2.json", "http://127.0.0.1:1234/rss.xml");
    }, 1000);

    setTimeout(() => {
        run("feed.json", "http://127.0.0.1:1234/rss.xml");
    }, 1000);

    setTimeout(() => {
        run("ogimage.json", "http://127.0.0.1:1234/en/rss.xml");
    }, 1000);

    setTimeout(() => {
        run("instagram1.json", "http://127.0.0.1:1234/en/rss.xml");
    }, 1000);

    setTimeout(() => {
        run("instagram2.json", "http://127.0.0.1:1234/en/rss.xml");
    }, 1000);

    setTimeout(() => {
        run("feed.json", "http://127.0.0.1:1234/en/rss.xml");
    }, 1000);
}

generate();
```

## The Process in Detail

### 1. Reading Data from RSS Feed

The script starts by fetching the blog's RSS feed and extracting relevant information:
- Post titles
- Publication dates (formatted)
- Post URLs
- Brief descriptions (truncated to 500 characters)

The feed is parsed as XML and data is stored in arrays.

### 2. Individual Color Scheme per Article

A clever feature of the script is automatic color generation for each article:

```typescript
function getRGB(str) {
  let hashed = hash(str);
  let result = hashed.toString(16).substring(0, 6);
  return "#" + result;
}
```

This function generates a hash value from the article title and converts it to a HEX color code. This gives each article a unique but consistent color scheme that remains the same with each run.

### 3. Template Customization for Each Article

For each image type (OG image, Instagram, Feed), there's a JSON template in the "data" directory. These templates are dynamically adjusted for each article. I created the templates using [Polotno Studio](https://studio.polotno.com/):
- The background gets an individual color gradient
- The title is inserted
- The date with author name is added
- A content excerpt is used as background text
Make sure the layers in your JSON templates match the names referenced in the TypeScript script.

![Polotno Studio](images/polotno00001.png)

### 4. Image Generation with Polotno

The customized templates are converted to JPEG images using Polotno:

```typescript
let instance = await createInstance({
  key: "[your-api-key]",
});
let pdfBase64 = await instance.jsonToImageBase64(template, {
  mimeType: "image/jpeg",
});
```

### 5. Storing Images in Blog Structure

The generated images are stored in a structured directory tree:
```
/content/[article-name]/images/[language]/[image-type].jpg
```

### 6. Multilingual Support

The script automatically generates images for all language versions of the blog (in this example, German and English).

## Zola Configuration for Image Usage

For Zola to properly use the generated images, here's an example of the corresponding template configuration:

```html
    {% if page.path %}
    <meta property="og:image" content="{{config.base_url | safe}}{{ page.path | safe }}/images/{{lang}}/preview.jpg" />
    <meta property="og:logo" content="{{config.base_url | safe}}{{ page.path | safe }}/images{{lang}}/preview.jpg" />
    <!-- twitter card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="{{config.base_url | safe}}{{ page.path | safe }}images/{{lang}}/preview.jpg">
    {% elif config.extra.favicon %}
    <meta property="og:image" content="{{ config.extra.favicon }}" />
    {% endif %}
```

## The Benefits of Automation

This solution offers several advantages:

1. **Consistent Design**: All images follow the same design scheme, strengthening brand identity (if I had one).
2. **Individual Touch**: Each article still gets its own color scheme and content as visual elements.
3. **Time Savings**: Image generation happens before article publication by simply running the deployment script.
4. **Multilingual Support**: All language versions are supported without additional effort.
5. **Complete Integration**: Through Git integration, all changes are published immediately.

## Conclusion

With this combination of Zola, Bun, TypeScript, and Polotno, I've found an elegant solution to improve my blog workflow. The automatic image generation ensures that each article is visually appealing without requiring additional effort.

The solution is flexible and can be easily adapted to other requirements - whether by changing templates, adding more image formats, or adjusting visual elements.

If you want to use this approach for your own blog, make sure to get your own Polotno API key and adjust the templates to your own design.