+++
title = "€20 Multiroom – Squeezebox, Raspberry Pi, and a Server Logitech Abandoned Long Ago"
date = 2026-04-30T12:00:00+01:00
description = "How to build a first-class multiroom audio system on a budget using second-hand Squeezeboxes, a Raspberry Pi, and a self-hosted Lyrion Music Server on Proxmox – and why a Raspberry Pi inside a porcelain bowl is sometimes the best solution."
[taxonomies]
tags = ["squeezebox", "multiroom", "lyrion", "logitech", "raspberry-pi", "proxmox", "docker", "self-hosted", "music", "home-network", "picoreplayer", "mystrom"]
[extra]
comment = true
+++


There are devices that simply refuse to die. Not because someone is keeping them alive – but because they were so good that an entire community decided: No. We're not letting this one go.

The subject is the **Logitech Squeezebox**. And the story behind it is almost touching.


## Logitech Quit. The Boxes Didn't.


Logitech originally acquired the Squeezebox line from a company called **Slim Devices** – a small, refined audio hardware manufacturer that had understood the meaning of networked music early on. The devices were far ahead of their time: Wi-Fi speakers with their own display, remote control, and multiroom synchronisation accurate to the millisecond.

Logitech discontinued hardware production in 2012. They continued running the server – `mysqueezebox.com` – until they shut it down for good in **March 2024**. The official reason: maintenance overhead. The unofficial reason: Logitech makes its money from mice and keyboards, not audio enthusiasts.

What happened next was beautiful. The community took over the complete open-source server code, continued maintaining it, renamed it – and today everything runs under the name **Lyrion Music Server (LMS)**. Same software, no more Logitech, but with genuine love for the details.


## Why This Is Interesting Right Now


Because the shutdown of the official server means: anyone who doesn't know what they're doing shelves their Squeezebox. And that, in turn, means: classified ad sites are currently full of them.

A **Squeezebox Radio** can be found there for €20–35. A **Squeezebox Boom** – stereo speaker, rich sound – for €30–75. Devices that originally cost €179 and €289 respectively when new. For someone who knows how to set up their own server, this is a gift. I bought my two Squeezebox Radios for **€25 each**. No negotiation needed – the sellers were simply glad someone still wanted the thing.


```
┌──────────────────────────────────────────────────────────────┐
│      Squeezebox Second-Hand Market – As of April 2026        │
├─────────────────────────┬────────────────────────────────────┤
│  Device                 │  Classified Ad Price (approx.)     │
├─────────────────────────┼────────────────────────────────────┤
│  Squeezebox Radio       │  €20 – 35                          │
│  Squeezebox Boom        │  €30 – 75                          │
│  Squeezebox Touch       │  €40 – 80                          │
│  Squeezebox Classic     │  €30 – 60                          │
└─────────────────────────┴────────────────────────────────────┘
```


## My Setup – or: How to Make Speakers Invisible


Before I get into the technical implementation, a quick honest confession: my wife doesn't like visible speakers. No "that looks technical", no "why are there cables sticking out", nothing at all. What looks like an elegant mini-PC to me is, in her eyes, a foreign object in the living space. I know this. I accept it. And I've found solutions.


### Living Room: Raspberry Pi in a Porcelain Bowl


The living room is my favourite piece. A Raspberry Pi, matching speakers – and the whole thing sits inside a **porcelain bowl**. No plastic enclosure, no technical look, but something that resembles a decorative object. The bowl sits on the TV cabinet, nobody asks what it is. The sound simply comes from the room. My wife is happy. I'm happy. The Raspberry Pi probably doesn't mind either.


### Kitchen: Raspberry Pi in a Chest


The kitchen was a bigger challenge. There, **surface transducers** are at work – cool devices that radiate sound via surfaces rather than through conventional membranes. The accompanying Raspberry Pi is bolted to the **inside wall of a wooden chest**. The chest sits in the corner and simply functions as a seat. It goes unnoticed, and cooking with music in the kitchen just becomes a pleasure. And whoever enjoys cooking, cooks better. That's my official justification.


### Children's Room & Bedroom: Squeezebox Radio


For the children's room and bedroom, the effort of setting up a Pi felt excessive – here I wanted something that simply works, has a display, and can be operated manually. The solution: **Squeezebox Radio**, €25 each from classified ads. The devices look good, have decent built-in tone controls, and – once you run your own LMS – are completely independent of Logitech.


```
┌──────────────────────────────────────────────────────────────┐
│  My Multiroom Setup – Room Overview                          │
├──────────────────┬───────────────────────────────────────────┤
│  Room            │  Device                                   │
├──────────────────┼───────────────────────────────────────────┤
│  Living Room     │  Raspberry Pi in porcelain bowl           │
│  Kitchen         │  Raspberry Pi + surface transducers,chest │
│  Children's Room │  Squeezebox Radio (€25, classified ads)   │
│  Bedroom         │  Squeezebox Radio (€25, classified ads)   │
└──────────────────┴───────────────────────────────────────────┘
```


## The Ingredients


- **Squeezebox Radio / Boom** – second-hand from classified ads
- **Raspberry Pi (3B or 4)** – running piCorePlayer
- **Lyrion Music Server (LMS)** – the open-source successor to the Logitech server
- **Proxmox** – as the backend (LXC container or Docker)
- **Squeeze Ctrl** – app for remote control from your phone
- **MyStrom Buttons** – for physical control via HTTP request

No subscription. No cloud. No privacy concerns. Everything runs at home. (But Spotify, Tidal, and others still work – LMS supports all major streaming services as sources.)


## Step 1: Lyrion Music Server on Proxmox


The easiest path is an **LXC container** on Proxmox. The community provides a ready-made helper script that sets up the container in just a few minutes.


### Option A: Proxmox Helper Script (recommended)


In the Proxmox terminal (on the host, not inside the container):


```bash
bash -c "$(wget -qLO - https://github.com/community-scripts/ProxmoxVE/raw/main/ct/lyrionmusicserver.sh)"
```


The script automatically creates an LXC container, installs LMS, and configures everything. Afterwards, the server is accessible at:


```
http://<proxmox-ip>:9000
```


### Option B: Docker Compose in an LXC Container


For those who prefer to do things manually, create a Debian LXC container on Proxmox and run LMS via Docker Compose:


```
┌─────────────────────────────────────────────────────────────────┐
│                     docker-compose.yml                          │
├─────────────────────────────────────────────────────────────────┤
│  services:                                                      │
│    lms:                                                         │
│      container_name: lms                                        │
│      image: lmscommunity/lyrionmusicserver                      │
│      volumes:                                                   │
│        - /opt/lms/config:/config:rw                             │
│        - /mnt/music:/music:ro                                   │
│        - /opt/lms/playlists:/playlist:rw                        │
│        - /etc/localtime:/etc/localtime:ro                       │
│        - /etc/timezone:/etc/timezone:ro                         │
│      ports:                                                     │
│        - "9000:9000/tcp"                                        │
│        - "9090:9090/tcp"                                        │
│        - "3483:3483/tcp"                                        │
│        - "3483:3483/udp"                                        │
│      environment:                                               │
│        - HTTP_PORT=9000                                         │
│        - EXTRA_ARGS=--advertiseaddr=192.168.178.50              │
│      restart: always                                            │
└─────────────────────────────────────────────────────────────────┘
```


**Important:** The `--advertiseaddr` must be the actual IP of the Proxmox host – not `127.0.0.1`. Otherwise the Squeezebox devices won't find the server. This is the gotcha that will catch you the first time around.


```bash
$ docker compose up -d
[+] Running 1/1
 ✔ Container lms  Started

$ curl http://localhost:9000/status.html
# → LMS web interface accessible ✓
```


Port **3483** (TCP + UDP) is the Squeezebox protocol port – it must be forwarded, otherwise the server is invisible to the hardware.


## Step 2: Connect Squeezebox and Update Firmware


Simply connect the Squeezebox Radio or Boom to your Wi-Fi and power it on. If LMS is running on the same network, the device will find the server automatically via Bonjour/mDNS.


### Install Community Firmware (strongly recommended)


The original Squeezebox Radio firmware has known Wi-Fi issues that have worsened since the mysqueezebox.com shutdown. The community has fixed this – and LMS offers the update directly:


```
On the Squeezebox Radio:
Home → Settings → Advanced → Software Update
→ Install Community Firmware
```


If the device doesn't connect at all: briefly connect it via **Ethernet cable** directly to the router, apply the update, and Wi-Fi will be significantly more stable afterwards.

More information if Wi-Fi drops out regularly: [This trick helped me significantly improve stability](https://telebear.de/appTippsTricks/appSqueezebox/appSbRadioWlan/index.html)

My one-liner:
```bash
ssh -oKexAlgorithms=+diffie-hellman-group1-sha1 \
    -oHostKeyAlgorithms=+ssh-rsa \
    -oCiphers=+aes128-cbc \
    root@192.168.178.125 \
    "sed -i '/wmiconfig.*maxperf/s/^/#/' /etc/init.d/wlan && reboot"
```
Password: `1234`


## Step 3: Raspberry Pi with piCorePlayer


For the living room and kitchen, each Pi runs **piCorePlayer** – a tiny, Squeezelite-specialised Linux that boots from the SD card and runs entirely in RAM. No wear, no overhead, no frills.


### Installing piCorePlayer


```bash
# 1. Download piCorePlayer image
#    → https://docs.picoreplayer.org/getting-started/

# 2. Flash image to SD card (Raspberry Pi Imager)

# 3. Boot the Pi, open web interface:
#    http://<raspberry-pi-ip>:80
```


In the web interface:


```
┌──────────────────────────────────────────────────────────────┐
│                  piCorePlayer Configuration                  │
├──────────────────────────────────────────────────────────────┤
│  Tab: Squeezelite Settings                                   │
│  → Audio Output: Analog / USB DAC                            │
│  → Player Name: "Living Room" / "Kitchen"                    │
│  → Submit → Restart Squeezelite                              │
│                                                              │
│  Tab: LMS                                                    │
│  → Server IP: 192.168.178.50 (Proxmox host)                  │
│  → Submit                                                    │
└──────────────────────────────────────────────────────────────┘
```


After rebooting, both Pis appear as fully-fledged players in LMS – on equal footing alongside the Squeezeboxes in the children's room and bedroom.


## Step 4: Remote Control – Three Ways


This is the part that makes the difference between "sort of works" and "want to use every day". I use three different methods, depending on the situation.


### Squeeze Ctrl on the Phone


My first choice on the sofa and on the go is **Squeeze Ctrl** – a lean app that communicates directly with LMS. Select a player, start music, adjust volume, create sync groups. No cloud detour, no latency, no annoying connection drops. Simply fast.


### HTTP Requests for Automations


LMS has a complete HTTP API. That means: every action available in the interface can also be triggered via a simple HTTP request. I use this extensively – for automations in n8n, for shortcuts on my phone, and especially for the MyStrom Buttons.


```bash
# Example: Toggle play/pause on the living room player
curl "http://192.168.178.50:9000/jsonrpc.js"   -d '{"id":1,"method":"slim.request","params":
       ["<player-mac>",["pause"]]}'

# Set volume to 40
curl "http://192.168.178.50:9000/jsonrpc.js"   -d '{"id":1,"method":"slim.request","params":
       ["<player-mac>",["mixer","volume","40"]]}'

# Sync all players
curl "http://192.168.178.50:9000/jsonrpc.js"   -d '{"id":1,"method":"slim.request","params":
       ["<player-mac>",["sync","<player-mac-2>"]]}'
```


The player MAC address can be found directly in the LMS web interface under *Settings → Players*.


### MyStrom Buttons – Physical Control


This is my personal highlight. **MyStrom Buttons** are small Wi-Fi switches that fire a configurable HTTP request when pressed. No opening an app, no searching for your phone – just press.


```
┌──────────────────────────────────────────────────────────────┐
│  MyStrom Button Configuration (example: Kitchen)             │
├──────────────────────────────────────────────────────────────┤
│  Single Press  → Play/pause music                            │
│  Double Press  → Next track                                  │
│  Long Press    → Sync all rooms                              │
└──────────────────────────────────────────────────────────────┘
```


The button simply sits on the counter next to the wooden chest. My wife presses it without knowing what's behind it. And that's exactly how it should be.


### Multiroom Synchronisation


This is the moment you build all of this for:


```
┌──────────────────────────────────────────────────────────────┐
│  LMS Sync Group                                              │
│                                                              │
│  [Living Room  - Raspberry Pi (bowl)     ] ●──┐             │
│  [Kitchen      - Raspberry Pi (chest)    ] ●──┤── Sync       │
│  [Children's   - Squeezebox Radio        ] ●──┤             │
│  [Bedroom      - Squeezebox Radio        ] ●──┘             │
│                                                              │
│  → All playing in bit-perfect sync. No echo. No drift.      │
└──────────────────────────────────────────────────────────────┘
```


LMS doesn't just synchronise "roughly at the same time" – the system works to millisecond precision. You can walk through the entire house and hear the same music everywhere, without noticing a single rhythmic offset. This is what Sonos charges a fortune for.


## What It All Costs


```
┌──────────────────────────────────────────────────────────────┐
│  My Setup – Total Cost                                       │
├────────────────────────────────┬─────────────────────────────┤
│  Squeezebox Radio × 2          │  ~€50   (classified ads)   │
│  Raspberry Pi 3B × 2           │  ~€30   (second-hand)      │
│  USB DAC / speakers            │  ~€30                      │
│  MyStrom Buttons               │  ~€20   (per unit)         │
│  Porcelain bowl + wooden chest │  already owned / flea mkt  │
│  Lyrion Music Server           │   €0   (open source)       │
│  Proxmox                       │   €0   (already running)   │
├────────────────────────────────┼─────────────────────────────┤
│  Total                         │  ~€130                      │
└────────────────────────────────┴─────────────────────────────┘
```


For comparison: a single entry-level Sonos speaker costs more today than the entire setup above.


## The Result


Somewhere in my home network, an LXC container on Proxmox is streaming music to four rooms. The porcelain bowl in the living room plays the same thing as the wooden chest in the kitchen – synchronised to the millisecond. In the children's rooms and bedroom, the displays of the Squeezeboxes glow softly. On the counter sits a small white button that you can simply press.


```
[LMS / Proxmox]      → stream ready
[Living Room]        → Pi in porcelain bowl   ♪ Kings of Convenience
[Kitchen]            → Pi in wooden chest     ♪ Kings of Convenience
[Children's Room]    → Squeezebox Radio 1     ♪ Kings of Convenience
[Bedroom]            → Squeezebox Radio 2     ♪ Kings of Convenience
[MyStrom Button]     → pressed ✓
```


And all of this without a single third-party cloud service. No subscription. No privacy concerns. No visible speakers.

Logitech quit. The community kept going. And somewhere, a porcelain bowl is playing Kings of Convenience – and nobody asks why.
