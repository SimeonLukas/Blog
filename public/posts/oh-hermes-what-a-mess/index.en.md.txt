+++
title = "Oh Hermes, what a mess! - My LOCAL AI Assistant"
date = 2026-06-30 12:00:00+01:00
description = "This rabbit hole runs deep, deeper than I thought. I dove into the world of local AI assistants and made some interesting discoveries along the way. In this article I share my experiences, the challenges, and the possibilities that did - and didn't - open up for me."

[taxonomies]
tags = ["ai", "local-ai", "hermes", "qwen3.6", "gemma4", "ai-generated", "locale-ai"]

[extra]
comment =  true
+++

## Genesis: Oh my [Hermes](https://hermes-agent.org/de/)!
As you know from my earlier posts, I bought myself a small mini PC with a 780m iGPU. I've already had AI models running locally on it to generate my own AI voice. gemma4 and qwen3.6 had been running on the device for a while too, but I started wondering whether there might be even more possibilities out there. [J.](https://enthusiastic.dev/) had mentioned Huggingface before, and I'd stumbled across it myself a few times, but I had no idea there was such a huge treasure trove of models sitting there. So I sat down and did a bit of research into what's actually out there. And I have to say, I was overwhelmed and completely lost at the same time, because I had no clue what any of it meant or what all the jargon stood for - but I really wanted my own personal AI assistant, [Hermes](https://hermes-agent.org/de/), running locally. And so the journey began, over a week ago now, on June 17, 2026.

### Day One - From Order to Chaos
I installed Hermes with ollama and had a look at what the thing could do. I simply hooked it up to gemma4 12B it qat and Telegram, and then I tried chatting with Hermes. But nothing came back. All I got was

```
Connection error.
APIConnectionError: http://127.0.0.1:11434/v1/chat/completions
```

"And the earth was without form, and void." It couldn't have been more fitting. No model, no output, just a chat window staring back at me. Welcome to the chaos.

### Day 2 - The Separation of the Waters: ollama out, llama.cpp in
After the initial frustration, it was clear: ollama and my 780m (gfx1103) were never going to be friends. I'd already tried getting GPU acceleration going via ROCm/HIP before - the result was crashes, because the TensileLibrary for gfx1103 simply doesn't exist. So, the separation of the waters: ollama was banished, llama.cpp moved in, and it actually runs stably on the iGPU. I set up a systemd service with `LimitMEMLOCK=infinity` and the correct `HOME`, and hooked Hermes up to `llama-server` via the OpenAI-compatible API. Finally, solid ground under my feet.

### Day 3 to 5 - Let the Land Bring Forth Models
Now the real search began. Huggingface, as I said, is a treasure trove - but also a swamp of quants, alphabet soup, and MoE jargon (and I thought as a theologian I already had plenty of abbreviations under my belt - don't even get me started on IHS!) that I first had to wade through. My test candidate: **Qwen3.6-35B-A3B** from unsloth, tried in three different builds - `UD-IQ4_NL`, `UD-Q4_K_XL`, and an MTP variant (`UD-IQ4_XS`) for speculative decoding. On top of that came a whole pile of fine-tuning flags: `--n-cpu-moe` to split the MoE experts between CPU and GPU, `-ctk q8_0 -ctv q8_0` for a quantized KV cache, and `--spec-type draft-mtp` for multi-token prediction.

The result was sobering: good HTML, but the German was a disaster - lots of mistakes, frequently sliding into English mid-sentence. During this time I also briefly tried GLM 4.7 Flash and a dense Qwen3.6-27B with MTP, but GLM 4.7 just produced endless, never-ending responses, and the Qwen3.6-27B was simply too slow on the 780m to be practical. Back to the drawing board.

### Day 6 - And God Created Man (or: gemma takes the crown)
Then came the switch to **gemma-4-26B-A4B-it** (`UD-Q4_K_XL`). And lo and behold: genuinely good German, fluent, hardly any slip-ups. On the flip side, it's a dud at programming - lots of mistakes, not something you can really trust. Surprisingly good, though: 3D models with OpenSCAD. gemma4 produces clean, parametric code there that I can actually do something with. Still, I wasn't entirely satisfied, because I'd hoped for more from a 26B model, and llama.cpp on the 780m simply hits its limits - it kept hanging with this model. So, back to Huggingface, this time with a different MoE model.

Here's what my current test run (06/30/2026) looks like, this time with a model from mradermacher:

```bash
exec llama-server \
  -hf mradermacher/Carnice-MoE-35B-A3B-GGUF:Q4_K_S \
  -c 65536 -np 1 -fa on \
  -ngl 99 --n-cpu-moe 20 \
  --spec-type draft-mtp --spec-draft-n-max 2 \
  --host 0.0.0.0 --port 8888 \
  --threads 16 -ctk q8_0 -ctv q8_0 \
  --cache-reuse 256 \
  --temp 0.7 --top-p 0.95 --min-p 0.05 \
  --ctx-checkpoints 5 -dio \
  --mlock --no-mmap --jinja --no-mmproj --chat-template-file template.jinja
```

### Day 7 - Day of Rest, or: the sobering truth
On the seventh day, I rested - and looked back over the past week's logs. I'd been diligently noting it whenever Hermes got stuck, and sure enough: 78 logged incidents, 75 of them with exhausted retries. Over two-thirds of those were plain connection drops, and a good quarter were "Loading model" errors with a 503 status code - my mini PC simply couldn't keep up whenever I switched models. On top of that, a few delightfully odd outliers: one model that flatly refused to accept two assistant messages in a row, and one response that landed in a completely wrong output format instead of the expected one.

The takeaway: my machine simply isn't powerful enough for a "real," large model. The 780m iGPU is a decent sparring partner, but not a heavyweight. Still - and this might be the actual moment of creation in this whole week - it's an absolute blast turning the dials, comparing quants, and watching something usable slowly emerge from the chaos.

## The Skills I Taught Hermes
Beyond the pure model-hopping, I also taught Hermes a handful of solid skills over the week, mostly via the `skill_manage` function, right from within the conversation:

- **todo** - adds tasks directly as a VTODO to my CalDAV calendar, neatly sorted into Personal, Web Development, or Work. I scrapped an early version (`tudu`) pretty quickly and folded it into `todo` instead - chaos, even when building skills.
- **openscad-design** - creates, renders, and exports parametric 3D models (vases, mounts, small figures) as STL, with clear rules about where the source code and the finished prints belong.
- **Zola Workflow & Migration** - converts classic HTML/CSS/JS sites into the Zola structure (`content/`, `templates/`, `static/`) and deploys them for testing. Handy when you maintain a school website on the side.
- **email-triage** - sorts the inbox, spots newsletters and spam, tidies up, without ever actually deleting anything.
- **plakate** - my own templates and scripts for quickly putting together event posters.

A colorful toolbox that grew organically over the week - much like the rest of this experiment. To be continued, once the next generation of models hits the market (or my mini PC finally gets the upgrade it deserves).

## Conclusion: A Rabbit Hole Deeper Than I Thought

One week, 78 logged crashes, three model families, what felt like a hundred quants, and a mini PC that, honestly, gave up more often than I'd like to admit. And yet I'd do it all over again in a heartbeat.

The sober truth first: a 780m iGPU is no substitute for a real GPU workstation. If a model is big enough to actually be good, it's usually also big enough to make my little server break a sweat while loading - the many "Loading model" errors in the logs make that abundantly clear. If you want to work locally on this kind of hardware, you have to make compromises: smaller quants, MoE models where only part of the experts get loaded, speculative decoding to make up for the missing raw power. Glory and misery sit right next to each other here.

But that's exactly what makes it fun for me. Every crash taught me something about quantization, MoE architectures, or the quirks of Vulkan on AMD hardware that I didn't know before. And by the end of the week, I didn't just have a running (if moody) AI assistant - I also had a handful of solid skills that are already saving me work day to day, from calendar entries to 3D printing.

So the rabbit hole from the introduction really was deeper than I thought - but it doesn't lead into nothing. Day by day, it leads to something that looks a little more like a local tool of my own. And as with any good creation story: this one is far from finished. To be continued, once the next generation of models hits the market - or once my mini PC finally gets the upgrade it has more than earned. The future, as far as I'm concerned, belongs to local AI models. Have fun experimenting!

## Images that Hermes sent me over the week:
![From Hermes](images/photo_2026-06-30%2023.31.52.jpeg)
![From Hermes](images/photo_2026-06-30%2023.31.57.jpeg)
![From Hermes](images/photo_2026-06-30%2023.32.05.jpeg)
![From Hermes](images/photo_2026-06-30%2023.32.09.jpeg)
![From Hermes](images/photo_2026-06-30%2023.32.19.jpeg)
![From Hermes](images/photo_2026-06-30%2023.32.26.jpeg)