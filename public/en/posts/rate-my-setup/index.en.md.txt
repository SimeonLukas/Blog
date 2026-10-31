+++
title = "Rate my Setup - Proxmox"
date = 2026-09-30 12:00:00+01:00
description = "I've had some really bad experiences with my server in general, so it's maybe not surprising that I put off the upgrade to PVE 9.0. But now the time has come, and I've taken the time to document my setup and show how I've built my server."
[taxonomies]
tags = ["homelab", "lxc", "pve", "selfmade", "shell", "vm"]
[extra]
comment = true
+++


## In the Beginning Was the Bit
I constantly write about the things I do on my computer, my server and my consoles, but I never actually documented how I set up my server. From the hardware all the way down to the individual LXCs and Docker containers. I've now taken the time to document all of it and show how my server is built, including a ranking of the most valuable containers I have running. [J.](https://enthusiastic.dev/) and I started talking about programming and PCs quite early on. Back before 2010, when we were about 13–14 years old, I was always impressed by his skills. He had already written his own website in PHP. Amazing! I still remember him recommending the hosting service [bplaced](https://www.bplaced.net/) (or was it Bluehost?), and that's how it started: trying things out, programming, publishing.


### Hardware: The Foundation of My Proxmox Homelab
All 25 LXC containers run on a compact Proxmox host with an AMD Ryzen 7 7735HS, around 32 GiB of RAM and three separate storage tiers: SSDs for the system and containers, HDDs for data, and a dedicated SSD for backups.


#### System Overview


| Component | Details |
|---|---|
| CPU | AMD Ryzen 7 7735HS with Radeon Graphics, 16 threads (8 cores), 1 socket |
| RAM | 29.12 GiB |
| Swap | Not active |
| Boot mode | EFI |
| Proxmox VE | pve-manager 9.2.21 |
| Kernel | Linux 7.0.14-19-pve |


#### CPU: Ryzen 7 7735HS
This mobile processor offers plenty of performance at low power consumption, which makes it a good fit for a 24/7 homelab. The integrated Radeon graphics can be used for hardware transcoding (e.g. for Plex or Immich).


#### Storage Overview


| Drives | Purpose | Configuration | Usable |
|---|---|---|---|
| 2x 512 GB SSD | Proxmox OS and LXCs | Previously a ZFS mirror, now I need the space | approx. 1 TB |
| 3x 4 TB HDD | Data (photos, movies, games, documents) and also LXC backups | ZFS RAIDZ1 (1 parity disk) | approx. 8 TB |
| 1x 256 GB SATA SSD | Backups of the most important LXCs | Single disk | approx. 256 GB |


#### 2x 512 GB SSD: System and Containers
The two SSDs hold the Proxmox operating system and all containers. The fast drives provide short boot times and snappy databases (Nextcloud, Immich, PocketBase).


#### 3x 4 TB HDD: ZFS RAIDZ1 for Data
Three disks form a RAIDZ1 pool with one parity disk. Of 12 TB raw capacity, around 8 TB remain usable, and one disk is allowed to fail. This is where large amounts of data live, such as the Plex library, Immich photos, ROMs for RomM and Nextcloud files.


#### 1x 256 GB SATA SSD: Backups
A dedicated SSD stores the Proxmox backups (vzdump). It is physically separate from the container SSDs, so a failure of the main system doesn't take the backups down with it.


#### This Might Also Be Interesting
- RAIDZ1 is not a backup. Important data should also be backed up externally. [Here's an example from me.](https://simeon.staneks.de/posts/backup-cheap-and-easy/)
- 256 GB is only enough for the container backups. The 8 TB of data won't fit there, which is why there is an external backup (see above).


### The Software
#### 100 – Nextcloud: My Own Cloud Instead of Dropbox and Google Drive
Files, calendars and contacts are stored at my home. The article shows how I run Nextcloud in an LXC.


#### 101 – AdGuard Home: Blocking Ads and Trackers Across the Whole Network
AdGuard filters DNS requests for all devices on the home network. This saves bandwidth and protects privacy.


#### 102 – Fleet: Device Management in the Homelab (currently stopped)
Fleet manages and monitors endpoint devices. It was only ever a test installation that I didn't pursue further.


#### 103 – Webserver: My Central Host for Websites and Projects
LXC 103 runs 23 Docker containers. They cover automation, document management, forms, messaging and several of my own websites. Caddy also runs "natively" here and acts as the reverse proxy for all services.


##### Automation and Communication
- **n8n**: Workflow automation for media, AI and services.
- **Listmonk**: Newsletter delivery, with its own PostgreSQL 13 database (port 9499).
- **wwebjs-api**: WhatsApp Web API for sending and receiving messages via script.
- **Signal CLI REST API**: Signal messages via a REST interface.


##### Documents and Data
- **Paperless-ngx**: Digital document archive with OCR and tags.
- **Tika**: Text extraction for Paperless, reachable internally only.
- **Gotenberg**: Converts office documents and emails to PDF, internal only.
- **Redis 7**: Broker for Paperless, internal only.
- **NocoDB**: Airtable alternative based on a PostgreSQL 15 database.
- **HeyForm**: Form builder.


##### Productivity and Administration
- **Kimai**: Time tracking, with MySQL 8.3 as the database (internal).
- **Homepage**: Dashboard with links to all services.
- **FTP server**: File transfer via FTP.


##### My Own Websites and Tools
- **page-private**: Private website on Apache/PHP. (Local website for local devices)
- **page-mt183**: [Website mt183.de.](https://mt183.de/)
- **page-veit**: [Veit project page.](https://www.veit.app/)
- **page-feiafanga**: [Feiafanga website.](https://feiafanga.de/)
- **md2epub**: [My own tool that converts Markdown to EPUB.](https://github.com/SimeonLukas/Obsidian2Kindle)


#### 104 – Workplace: The Development Environment in a Container
A dedicated container as a workspace with tools, terminal and projects. It can be backed up and cloned at any time, and it handles the backups to Hetzner.


#### 105 – Plex: My Own Streaming Service for Movies and Series
Plex manages the media library and streams it to all devices.


#### 106 – BookStack: Documentation and Wiki That Actually Gets Used
BookStack organizes notes and guides into books and chapters. I use it for my work colleagues.


#### 107 – Homebox: Inventory Management for Household and Tech (stopped)
Homebox tracks devices, warranties and receipts. I use it too rarely.


#### 108 – Ubuntu: The All-Purpose Container for Experiments
A clean Ubuntu for testing new software, used for automated video creation. An article might follow.


#### 109 – PocketBase: A Backend in a Single File
PocketBase provides a database, auth and API in a single binary. [The backend for feiafanga.](https://001.feiafanga.de/)


#### 110 – Vaultwarden: Self-Hosting Passwords, Securely
The lightweight Bitwarden alternative for all my credentials.


#### 111 – Immich: Replacing Google Photos with My Own Photo Cloud
Immich automatically backs up phone photos and offers face recognition and search. Everything stays on my server.


#### 112 – Reitti: Analyzing Location History Privately (stopped)
Reitti visualizes movement data without sharing it with third parties. I currently use it too rarely.


#### 113 – Open WebUI: The Interface for My Local AI Models
Open WebUI connects to local LLMs and offers a ChatGPT-like experience.


#### 114 – SearXNG: My Private Metasearch Engine (stopped)
SearXNG aggregates many search engines without tracking. I don't need it at the moment.


#### 115 – Alpine Docker: A Minimal Docker Host in an LXC
Alpine needs hardly any resources and is well suited for Docker stacks. I set this container up specifically for Whisper. [More on that here.](https://simeon.staneks.de/posts/stt-telegram-n8n-nextcloud-obsidian/)


#### 116 – Layers: My Own Design Editor in the Browser
I create templates, posters and graphics with a Canva alternative in the browser. It isn't public, but it's my private alternative to Canva. I may write an article about it.


#### 117 – PocketBase (Second Instance): Keeping Projects Cleanly Separated
A second PocketBase instance keeps projects separate from each other. This makes updates and backups easier. [The backend for feiafanga.](https://002.feiafanga.de/)


#### 118 – Syncthing: Syncing Files Between Devices Without the Cloud
Syncthing syncs folders directly between my devices. It needs no third-party provider.


#### 119 – Ignis: What's Behind This Container? (stopped)
A project that is currently dormant: Obsidian in the browser. I thought I needed it... well.


#### 120 – Linkwarden: Collecting Bookmarks and Archiving Them Permanently
Linkwarden saves links along with an archived copy and tags, so sources no longer disappear. Very useful!


#### 121 – RomM: The Retro Game Library in the Browser
RomM manages ROMs with covers and metadata. Perfect for emulation on handhelds.


#### 122 – LanguageTool: Spell Checking Locally, Without the Cloud
My own LanguageTool server checks grammar and style without my texts ever leaving the house.


#### 123 – Lyrion Music Server: Multi-Room Audio on the Home Network
Lyrion (formerly Logitech Media Server) supplies players throughout the house with music. [The article shows the setup.](https://simeon.staneks.de/en/posts/squeezebox-picore-lyrion/)


#### 124 – Alpine: The Smallest Container in the Homelab
A minimal Alpine LXC for small services and tests. It starts in seconds and needs hardly any RAM. Used for the following project: [International service on the Zugspitze](https://service.tourismuspastoral.de/)



### Ranking: The Most Valuable Containers
1. **Nextcloud**: Without Nextcloud, my homelab would just be a server. Calendar, to-dos and more, all in one place for my wife and me.
2. **Plex**: Important so the kids can watch without ads.
3. **Immich**: Runs all the time, because all photos from the smartphone app land there directly.
4. **AdGuard Home**: Saves data and blocks ads.
5. **Webserver**: Without the web server, I couldn't host my own websites and projects.
6. **Paperless**: I'd be lost without Paperless.
7. **n8n**: Without n8n, I'd have to do many things manually that now run automatically.
8. **Lyrion Music Server**: Without the music server, the white noise for the sleeping babies wouldn't be available everywhere.


All containers are worth the same. But without these 8, I personally would simply be lost.

This Website is really great in Connection with your own Proxmox Homelab: [https://community-scripts.org/](https://community-scripts.org/)