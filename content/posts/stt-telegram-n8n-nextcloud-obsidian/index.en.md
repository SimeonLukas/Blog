+++
title = "I Speak, Obsidian Writes – Voice Memos via Telegram, Whisper & n8n"
date = 2026-03-29T12:00:00+01:00
description = "How I use a Telegram bot, a local Whisper server, n8n and Nextcloud to automatically beam my spoken thoughts into my Obsidian vault as Markdown memos."
[taxonomies]
tags = ["n8n", "whisper", "telegram", "obsidian", "nextcloud", "docker", "automation", "self-hosted", "voice", "productivity"]
[extra]
comment = true
+++

I'm standing at the playground. Two kids are climbing on the jungle gym, a mum and a dad from kindergarten and I are talking about Kings of Convenience. About *The Weight of my Words*. About the album *Versus*. About the time when music still hurt, because you were young and a little unfinished.

And then the moment is gone. The kids call out. You go home. And that small, precious memory gets lost somewhere between the playground and the fridge.

Not anymore. Because now I just pull out my phone, open Telegram, hit record – and everything takes care of itself.

## The Problem: Thoughts Evaporate

I've been using Obsidian as a second brain for a long time. The problem: a second brain is useless if you're too lazy to feed it. Typing at the playground? No thanks. Opening a notes app, typing things out, formatting Markdown? Also no. I'm someone who *talks*. So the solution had to work with speech too.

The idea was simple: I send a voice message to a Telegram bot. The rest happens automatically. The result lands as a finished `.md` file in my Obsidian vault – thanks to Nextcloud sync. Magic.

## The Ingredients

Before I get into the details, here's a quick overview of what I actually built:

- **Telegram Bot** – my mobile microphone
- **n8n** – the glue that holds everything together (self-hosted, of course)
- **faster-whisper-server** – a local AI transcription service that handles German and needs no cloud
- **Nextcloud** – my self-hosted cloud storage that syncs with Obsidian
- **Obsidian** – the final resting place for all my thoughts

No subscription. No cloud. No privacy concerns. Everything runs at home.

## Step 1: Running Whisper Locally

The first building block is a local Whisper server. I'm using the Docker image `fedirz/faster-whisper-server` – a fast, OpenAI API-compatible implementation that runs on a regular CPU.

My `docker-compose.yml`:

```
┌─────────────────────────────────────────────────────────────────┐
│                     docker-compose.yml                          │
├─────────────────────────────────────────────────────────────────┤
│  services:                                                      │
│    whisper-api:                                                 │
│      image: fedirz/faster-whisper-server:latest-cpu            │
│      container_name: whisper-api                               │
│      environment:                                               │
│        - WHISPER__MODEL=Systran/faster-whisper-small           │
│      volumes:                                                   │
│        - whisper_cache:/root/.cache/huggingface                │
│      ports:                                                     │
│        - "5092:8000"                                           │
│      networks:                                                  │
│        - home_default                                           │
│      restart: unless-stopped                                    │
│                                                                 │
│  volumes:                                                       │
│    whisper_cache:                                               │
│                                                                 │
│  networks:                                                      │
│    home_default:                                                │
│      external: true                                             │
└─────────────────────────────────────────────────────────────────┘
```

The `faster-whisper-small` model is the sweet spot: small enough for older hardware, good enough for speech in German. On first start, Docker downloads the Hugging Face model and caches it in the volume – after that, everything runs offline.

```bash
$ docker compose up -d
[+] Running 2/2
 ✔ Volume "whisper_cache" created
 ✔ Container whisper-api started

$ curl http://localhost:5092/v1/models
{
  "data": [
    { "id": "Systran/faster-whisper-small", "object": "model" }
  ]
}
```

The server is now accessible at `http://192.168.178.118:5092` and understands the OpenAI-compatible API. Meaning: anything that can talk to `whisper-1` can also talk to my local server.

## Step 2: The n8n Workflow

Now n8n enters the picture – my self-hosted automation brain. The workflow has exactly six steps and looks like this:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         n8n Workflow: Telegram → Memo                       │
├──────────────────┐                                                          │
│  Telegram        │  Voice message arrives                                  │
│  Trigger  ───────┼──────────────────────────────────────────────────────►  │
│  (Bot: Memo)     │                                                          │
└──────────────────┘                                                          │
         │                                                                    │
         ▼                                                                    │
┌──────────────────┐                                                          │
│  Get a file      │  Telegram API: download audio file (.ogg)               │
│  (Telegram)      │  → fileId from message.voice.file_id                   │
└──────────────────┘                                                          │
         │                                                                    │
         ▼                                                                    │
┌──────────────────┐                                                          │
│  HTTP Request    │  POST → http://192.168.178.118:5092/v1/audio/           │
│  (Whisper API)   │         transcriptions                                  │
│                  │  Body: multipart/form-data                              │
│                  │    model=whisper-1                                       │
│                  │    file=<audio binary>                                   │
└──────────────────┘                                                          │
         │                                                                    │
         ▼                                                                    │
┌──────────────────┐                                                          │
│  Code in JS      │  Clean up hashtags from transcribed text                │
│                  │  text.replaceAll("Hashtag ", "#")                        │
└──────────────────┘                                                          │
         │                                                                    │
         ▼                                                                    │
┌──────────────────┐  ┌──────────────────────────────────────────────────┐  │
│  Upload .md      │  │  Upload .ogg                                      │  │
│  (Nextcloud)     │  │  (Nextcloud)                                      │  │
│  Notes/Memos/    │  │  Notes/Memos/                                     │  │
│  YYYY-MM-DD      │  │  YYYY-MM-DD_<updateId>.ogg                        │  │
│  HH-mm-ss.md     │  └──────────────────────────────────────────────────┘  │
└──────────────────┘                                                          │
         │                                                                    │
         ▼                                                                    │
┌──────────────────┐                                                          │
│  Send a text     │  Send transcription back to Telegram                    │
│  message         │  → Confirmation that everything worked                 │
└──────────────────┘                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```



### Node 1: Telegram Trigger

A simple webhook trigger that listens for incoming messages from the "Memo" bot. As soon as a voice message arrives, the workflow fires.

### Node 2: Get a file

Telegram only gives us the `file_id` of the voice message. This node fetches the actual `.ogg` file via the Telegram API. The expression `$json.message.voice.file_id` delivers the right value.

### Node 3: HTTP Request → Whisper

This is the heart of the whole thing. We send a `POST` request to our local Whisper server:

```
POST http://192.168.178.118:5092/v1/audio/transcriptions
Content-Type: multipart/form-data

model=whisper-1
file=<binary audio data>
```

Back comes JSON with the transcribed text. In German, offline, on my own server.

### Node 4: Code in JavaScript

Whisper sometimes transcribes the word "Hashtag" literally when I rattle off a list of tags. A quick one-liner cleans that up:

```javascript
for (const item of $input.all()) {
  let text = item.json.text;
  text = text.replaceAll("Hashtag ", "#");
  item.json.text = text;
}
return $input.all();
```

This is great because I can then search by inline tags in Obsidian without any manual cleanup.

### Node 5 & 6: Upload to Nextcloud

Two parallel uploads go out:

1. The **Markdown file** – path: `Notes/Memos/YYYY-MM-DD HH-mm-ss.md`
2. The **original audio file** – path: `Notes/Memos/YYYY-MM-DD_<updateId>.ogg`

The content of the `.md` file looks like this:

```markdown
Memo from 29.03.2026

The other day I was at the playground talking to a mum and a dad
from kindergarten. We talked about old music, the music we used
to listen to when we were young...

---
![[2026-03-29 617268880.ogg]]
```



The timestamp comes straight from `now.toUTC().format('dd.MM.yyyy')` inside n8n – no more typing the date manually.

### Node 7: Confirmation back to Telegram

As a final step, the workflow sends the transcribed text back to my Telegram chat. That way I can see immediately: did Whisper actually understand me? Or did it turn "Kings of Convenience" into something like "Kings of Conveyance"? (It didn't. I'm impressed.)

## Step 3: Nextcloud ↔ Obsidian

The great thing about this setup: Nextcloud and Obsidian already know each other. I've set up the `Notes/Memos/` folder in Nextcloud as a synced path. As soon as n8n uploads the `.md` file, it lands in my Obsidian vault within seconds – on both desktop and phone.

```
Nextcloud (Server)
└── Notes/
    └── Memos/
        ├── 2026-03-29 12-27-03.md   ← transcript as Markdown
        └── 2026-03-29 617268880.ogg ← original audio for playback
```

In Obsidian it shows up ready to go – date in the title, full text, and a link to the audio file at the bottom. I don't have to touch anything. Format anything. Rename anything.

## The Result

I'm back at the playground. The conversation ends. I hold up my phone for a second, hit record in the Telegram bot, speak for 30 seconds – and then just go home.

Somewhere on my home network, the following is happening right now:

```
[Telegram]  → Voice message received (617268880)
[n8n]       → .ogg downloaded (128 KB)
[Whisper]   → Transcription started...
[Whisper]   → Done in 2.3s: "The other day I was at the playground..."
[Nextcloud] → 2026-03-29 12-27-03.md uploaded ✓
[Nextcloud] → 2026-03-29 617268880.ogg uploaded ✓
[Telegram]  → Confirmation sent ✓
```

And all of that without a single third-party cloud service. No OpenAI API key. No subscription fees. No "Your voice data helps us improve our services."

Kings of Convenience – *The Weight of my Words*. Now the weight of my words has finally found a home.

## [Thanks, J.!](https://enthusiastic.dev/)

Anyone who's been reading my blog for a while knows J. – my friend who pushes me into epic rabbit holes and then plays innocent. This time he suggested **Parakeet** by NVIDIA, a very fast speech-to-text model that I seriously looked into.

The problem: Telegram sends voice messages in **Ogg Vorbis format** (`.ogg`) – and Parakeet doesn't like Vorbis. You could convert the audio beforehand, but honestly I didn't want another conversion step in the workflow. Whisper, on the other hand, swallows Ogg without batting an eye.

So: J., thanks for the tip. You had a good idea again. I just bent it slightly – as always.