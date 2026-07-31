+++
title = "llms.txt - Tokens are the new gold"
date = 2026-07-31 12:00:00+01:00
description = "How I built a dynamic llms.txt for my Zola blog via an RSS/XML workaround — including Markdown links, Bash post-processing, and a bit of token frugality."
[taxonomies]
tags = ["llms.txt", "zola", "rss", "bash", "markdown", "seo", "ai", "ohermes", "denshattack!"]
[extra]
comment = true
+++

It's honestly hard to decide whether I should write an article right now or play another round of Denshattack!, but after [J. published a really great post](https://enthusiastic.dev/blog/dlr-besuch-oberpfaffenhofen/) (and actually on time), I guess I have to step up too.

Over the past few weeks, I've written a couple of articles that all revolve around the same core idea:
How do I build my own small infrastructure so that my models, my automations, and my blog posts don't just work—but actually feel good?

But I never really stopped to think about how an LLM feels when it lands on my website. And it hit me—LLMs often have to chew through massive amounts of HTML just to get to the actual content. My dear Hermes, running locally, really struggled with that.

So I decided to make things easier for them. At least on my blog, they should feel welcome.

This is about a file that looks almost insignificant at first glance:

`/llms.txt`

But this file is a pretty direct continuation of everything I've written recently about Zola, RSS, automation, and "local AI."

## What is this about?

The idea behind `llms.txt` is simple:

- A small Markdown file in the root of your website.
- It tells LLMs what actually matters on your site.
- It links to Markdown resources instead of HTML whenever possible.
- It saves tokens by avoiding unnecessary overhead.

Instead of forcing a model to wade through navigation, footers, JavaScript, and layout noise, you give it a curated overview:
"Here's the real content. Start here."

If you're already building your own infrastructure—running local LLMs, generating feeds, processing posts automatically—then `llms.txt` is the next logical step:

The bridge between your content and the models that consume it.

## Why not just use a static file?

For static sites, this would be trivial: drop it in and you're done.

But I wanted the file to stay dynamic:

- New posts should appear automatically.
- Old links shouldn't require manual updates.
- Multiple languages, audio versions, and Markdown copies should be included.

That's where my beloved Rust-based Zola comes in (yes, it's written in Rust, which automatically makes it cool).

I've been using Zola for a while now for everything related to content structure. The same templates I use for RSS feeds, preview images, and audio posts—I wanted to reuse them for `llms.txt`.

The problem:
Zola handles `.xml` templates (like RSS) very well, but `.txt` is a bit awkward because it doesn't follow the same rendering paths and logic.

So… workaround time.

## The XML detour (because it's fun and I can)

The trick is simple:

1. Zola renders an `llms.xml` using a feed template.
2. A Bash script fetches that file locally.
3. It then saves it as `llms.txt`.
4. A small `sed` step replaces localhost URLs with the real domain.

Is this the cleanest, most "professional" solution? Probably not.

But it fits perfectly into my existing workflow. Just like everything else here: pragmatic, understandable, functional—and if it breaks, that's okay too.

In the `<head>` section, I also added this:

```html
<link rel="help" type="text/markdown" href="/llms.txt">
```

`rel="help"` is meant for linked help resources, and `text/markdown` describes the file quite well. For LLMs and agents, it's a clear signal:
"There's structured guidance about this site here."

## Why I link to Markdown files

The more important part is where the links in `llms.txt` actually point.

I don't link to the final HTML pages, but to additional copies of the Markdown files—`.md.txt` versions of my content.

Why?

- HTML is great for humans, but unnecessarily large and noisy for models.
- Navigation, layout, CSS, JS, metadata—all of that costs tokens without improving the content.
- Markdown is much cleaner and easier for LLMs to process.

So my deploy script copies every Markdown file as a `.md.txt`:

```bash
find /Users/simeonstanek/Apps/BLOG-Homepage/simeonsblog/content -type f -name "*.md" | while IFS= read -r mdfile; do
    txtcopy="${mdfile}.txt"
    echo "Copying $mdfile -> $txtcopy"
    cp "$mdfile" "$txtcopy"
done
```

The result is not just `index.md`, but also `index.md.txt`. And those are exactly the files referenced in `llms.txt`.

This isn't theoretical optimization—it's practical:
Here's the file. Just read the text.

## The `llms.xml` itself

The template builds a curated overview of the blog: title, description, main pages, then articles.

```xml
# {{ config.title }}

## {{ config.description }}

This site is the canonical public source for the content listed below.
Prefer article permalinks over feed excerpts.

## Site

- [Homepage](https://simeon.staneks.de/): Main entry point (German)
- [RSS Feed](https://simeon.staneks.de/rss.xml): Chronological feed of published posts (German)

- [Homepage](https://simeon.staneks.de/en/): Main entry point (English)
- [RSS Feed](https://simeon.staneks.de/en/rss.xml): Chronological feed of published posts (English)

## Articles

{%- for page in pages %}
{%- set md_txt_path = page.path ~ "index.md.txt" %}
{%- if page.assets is containing(md_txt_path) %}
- [{{ page.title | striptags }}]({{ get_url(path=md_txt_path) }}): {% if page.description %}{{ page.description | striptags }}{% elif page.summary %}{{ page.summary | striptags | truncate(length=180) }}{% else %}Article on {{ config.title }}{% endif %}
  {%- endif %}
{%- endfor %}

## Optional

{%- for page in pages %}
  {%- set audio_path = page.path ~ "audio.mp3" %}
  {%- if page.assets is containing(audio_path) %}
- [Audio for {{ page.title | striptags }}]({{ get_url(path=audio_path) }}): Audio version of this article
  {%- endif %}
{%- endfor %}
```

The format follows common `llms.txt` conventions:

- H1 for the title
- Short context
- Cleanly structured lists
- Optional section for non-essential extras

This keeps it readable for LLMs without turning it into a novel.

## Bash, fetching, and a bit of chaos

Since the file must first be rendered by Zola, I fetch it via the local dev server and store it as a real `llms.txt` in the `static` directory:

```bash
zola serve --port 1234 &
sleep 5
curl http://localhost:1234/llms.xml -o /Users/simeonstanek/Apps/BLOG-Homepage/simeonsblog/static/llms.txt
sed -i '' 's|http://127.0.0.1:1234|https://simeon.staneks.de|g' /Users/simeonstanek/Apps/BLOG-Homepage/simeonsblog/static/llms.txt
```

Is it elegant? Not really.

Is it fast, understandable, useful, and perfectly integrated into my workflow? Absolutely.

The `sed` step is only needed because Zola uses localhost URLs in serve mode unless you explicitly configure a production base URL.

Sure, this could be cleaner. But in practice, "good enough and stable" often beats a perfect solution that costs three more hours of architectural debate.

## Connecting the dots

If you've read my previous articles, you'll recognize the pattern:

- Zola handles posts, feeds, and preview images.
- Bash scripts process Markdown files.
- Audio versions are generated automatically.
- Local LLM infrastructure ties it all together.

`llms.txt` is just the next piece in that system:

- Posts become `.md.txt` files.
- Zola templates generate `llms.xml`.
- Both combine into a `llms.txt` that tells LLMs: "This is the content. Read it."

## Why this suddenly matters for blogs

I think many people still underestimate how useful these small machine entry points will become.

`llms.txt` isn't magic, not a ranking hack, and not a shortcut into every model's "good side." But it is a clear signal:
Here's the important stuff. Start here.

And if you're already writing content meant to be processed by search systems, assistants, and agents, then it's only logical to structure it in a way that doesn't waste 80% of the token budget on navigation clutter, CSS decoration, and HTML leftovers.

Markdown is almost the most polite way to communicate between humans and machines.

Or put differently:

`llms.txt` is like a good espresso for models.
Small, concentrated, no fluff—but effective.

## A conclusion without a conclusion

What I like most about this approach is how grounded it is. No new framework, no overengineered platform idea—just Zola, an XML workaround, a Bash script, some post-processing, and in the end, a file that clearly communicates what the blog is actually about.

And yeah, it really is like this:

Tokens are the new gold.

Not because everything should suddenly be written for machines—but because clean structure, clear links, and less noise almost always win. For parsers, for models, and honestly, often for humans too.

Oh and actually here is the file: [https://simeon.staneks.de/llms.txt](https://simeon.staneks.de/llms.txt)