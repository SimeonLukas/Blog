+++
title = "20 Euro Multiroom – Squeezebox, Raspberry Pi und ein Server, den Logitech längst aufgegeben hat"
date = 2026-04-30T12:00:00+01:00
description = "Wie man sich mit gebrauchten Squeezeboxen, einem Raspberry Pi und dem selbst gehosteten Lyrion Music Server auf Proxmox eine erstklassige Multiroom-Anlage für kleines Geld baut – und warum ein Raspberry Pi in einer Porzellanschüssel manchmal die beste Lösung ist."
[taxonomies]
tags = ["squeezebox", "multiroom", "lyrion", "logitech", "raspberry-pi", "proxmox", "docker", "self-hosted", "music", "home-network", "picoreplayer", "mystrom"]
[extra]
comment = true
+++

Es gibt Geräte, die einfach nicht sterben wollen. Nicht weil jemand sie am Leben hält – sondern weil sie so gut waren, dass eine ganze Community beschlossen hat: Nein. Das lassen wir nicht sterben.

Die Rede ist von der **Logitech Squeezebox**. Und die Geschichte dahinter ist fast schon rührend.

## Logitech hat aufgehört. Die Boxen nicht.

Logitech hatte die Squeezebox-Linie ursprünglich von der Firma **Slim Devices** übernommen – einem kleinen, feinen Audiohardware-Hersteller, der schon früh verstanden hatte, was Netzwerkmusik bedeutet. Die Geräte waren ihrer Zeit weit voraus: WLAN-Lautsprecher mit eigenem Display, Fernbedienung, Multiroom-Synchronisation auf die Millisekunde genau.

Logitech stellte die Hardwareproduktion 2012 ein. Den Server – `mysqueezebox.com` – betrieb man noch weiter, bis man ihn im **März 2024 endgültig abschaltete**. Die offizielle Begründung: Wartungsaufwand. Die inoffizielle: Logitech verdient sein Geld mit Mäusen und Tastaturen, nicht mit Audioenthusiasten.

Was danach passierte, war schön. Die Community übernahm den kompletten Open-Source-Code des Servers, pflegte ihn weiter, benannte ihn um – und heute läuft alles unter dem Namen **Lyrion Music Server (LMS)**. Gleiche Software, kein Logitech mehr, dafür mit echter Liebe zum Detail.

## Warum das gerade jetzt interessant ist

Weil die Abschaltung des offiziellen Servers bedeutet: Wer nicht weiß, was er tut, stellt seine Squeezebox in den Keller. Und das wiederum bedeutet: Kleinanzeigen ist gerade voll davon.

Eine **Squeezebox Radio** bekommt man dort für 20–35 Euro. Eine **Squeezebox Boom** – Stereolautsprecher, satter Klang – für 30–75 Euro. Geräte, die neu mal 179 bzw. 289 Euro gekostet haben. Für jemanden, der weiß, wie man einen eigenen Server aufsetzt, ist das ein Geschenk. Ich habe meine beiden Squeezebox Radios für jeweils **25 Euro** gekauft. Keine Verhandlung nötig – die Verkäufer waren einfach froh, dass jemand das Ding überhaupt noch will.

```
┌──────────────────────────────────────────────────────────────┐
│        Squeezebox Gebrauchtmarkt – Stand April 2026          │
├─────────────────────────┬────────────────────────────────────┤
│  Gerät                  │  Kleinanzeigen-Preis (ca.)         │
├─────────────────────────┼────────────────────────────────────┤
│  Squeezebox Radio       │  20 – 35 €                         │
│  Squeezebox Boom        │  30 – 75 €                         │
│  Squeezebox Touch       │  40 – 80 €                         │
│  Squeezebox Classic     │  30 – 60 €                         │
└─────────────────────────┴────────────────────────────────────┘
```

## Mein Setup – oder: Wie man Lautsprecher unsichtbar macht

Bevor ich in die technische Umsetzung gehe, kurz ein ehrliches Geständnis: Meine Frau mag keine sichtbaren Lautsprecher. Kein „das sieht technisch aus", kein „warum stehen da Kabel raus", kein gar nichts. Was in meinen Augen ein eleganter Mini-PC ist, ist in ihren Augen ein Fremdkörper im Wohnraum. Ich kenne das. Ich akzeptiere das. Und ich habe Lösungen gefunden.

### Wohnzimmer: Raspberry Pi in einer Porzellanschüssel

Das Wohnzimmer ist mein Lieblingsstück. Ein Raspberry Pi, passende Lautsprecher – und das ganze sitzt in einer **Porzellanschüssel**. Kein Plastikgehäuse, kein technischer Look, sondern etwas, das aussieht wie ein Dekorationsobjekt. Die Schüssel steht auf dem Fernsehschrank, niemand fragt, was das ist. Der Klang kommt einfach aus dem Zimmer. Meine Frau ist zufrieden. Ich bin zufrieden. Der Raspberry Pi hat wahrscheinlich auch nichts dagegen.

### Küche: Raspberry Pi in einer Truhe

In der Küche war die Herausforderung größer. Dort laufen **Raumklangerzeuger** – coole Teile, die Schall über Oberflächen abstrahlen, statt über klassische Membranen. Der Raspberry Pi dazu sitzt in der **Holztruhe** festgeschraubt an einer Seitenwand. Die Truhe steht in der Ecke und ist einfach eine Sitzgelegenhgeit. Fällt nicht auf und man kocht einfach gerne mit Musik in der Küche. Und wer gerne kocht, kocht besser. Das ist meine offizielle Begründung.

### Kinderzimmer & Schlafzimmer: Squeezebox Radio

Für Kinderzimmer und Schlafzimmer war mir der Aufwand mit dem Pi zu groß – hier wollte ich etwas, das einfach funktioniert, ein Display hat und man auch mal manuell bedienen kann. Die Lösung: **Squeezebox Radio**, je 25 Euro auf Kleinanzeigen. Die Geräte sehen gut aus, haben eine ordentliche Klangregelung eingebaut und sind – sobald man einen eigenen LMS betreibt – vollständig unabhängig von Logitech.

```
┌──────────────────────────────────────────────────────────────┐
│  Meine Multiroom-Anlage – Raumübersicht                      │
├──────────────────┬───────────────────────────────────────────┤
│  Raum            │  Gerät                                    │
├──────────────────┼───────────────────────────────────────────┤
│  Wohnzimmer      │  Raspberry Pi in Porzellanschüssel        │
│  Küche           │  Raspberry Pi + Raumklangerzeuger, Truhe  │
│  Kinderzimmer    │  Squeezebox Radio (25 €, Kleinanzeigen)   │
│  Schlafzimmer    │  Squeezebox Radio (25 €, Kleinanzeigen)   │
└──────────────────┴───────────────────────────────────────────┘
```

## Die Zutaten für das Setup

- **Squeezebox Radio / Boom** – gebraucht von Kleinanzeigen
- **Raspberry Pi (3B oder 4)** – mit piCorePlayer als Software
- **Lyrion Music Server (LMS)** – der Open-Source-Nachfolger des Logitech Servers
- **Proxmox** – als Backend (LXC-Container oder Docker)
- **Squeeze Ctrl** – App für die Fernsteuerung am Handy
- **MyStrom Buttons** – für die physische Steuerung per HTTP-Request

Kein Abo. Keine Cloud. Keine Datenschutzbedenken. Alles läuft zuhause. (Aber Spotify, Tidal und Co. funktionieren natürlich trotzdem – LMS unterstützt alle gängigen Streaming-Dienste als Quellen.)

## Schritt 1: Lyrion Music Server auf Proxmox

Der einfachste Weg ist ein **LXC-Container** auf Proxmox. Die Community stellt ein fertiges Helper-Script bereit, das den Container in wenigen Minuten aufbaut.

### Option A: Proxmox Helper Script (empfohlen)

Im Proxmox-Terminal (auf dem Host, nicht im Container):

```bash
bash -c "$(wget -qLO - https://github.com/community-scripts/ProxmoxVE/raw/main/ct/lyrionmusicserver.sh)"
```

Das Script erstellt automatisch einen LXC-Container, installiert LMS und richtet alles ein. Danach ist der Server erreichbar unter:

```
http://<proxmox-ip>:9000
```

### Option B: Docker Compose im LXC

Wer lieber selbst Hand anlegt, kann einen Debian-LXC-Container auf Proxmox erstellen und LMS per Docker Compose betreiben:

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
│        - /mnt/musik:/music:ro                                   │
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

**Wichtig:** Die `--advertiseaddr` muss die tatsächliche IP des Proxmox-Hosts sein – nicht `127.0.0.1`. Sonst finden die Squeezebox-Geräte den Server nicht. Das ist das Gotcha, das einen beim ersten Mal garantiert erwischt.

```bash
$ docker compose up -d
[+] Running 1/1
 ✔ Container lms  Started

$ curl http://localhost:9000/status.html
# → LMS Webinterface erreichbar ✓
```

Port **3483** (TCP + UDP) ist der Squeezebox-Protokoll-Port – der muss zwingend durchgereicht werden, sonst ist der Server für die Hardware unsichtbar.

## Schritt 2: Squeezebox anschließen und Firmware updaten

Squeezebox Radio oder Boom einfach ins WLAN einbuchen und einschalten. Wenn LMS im selben Netzwerk läuft, findet das Gerät den Server automatisch per Bonjour/mDNS.

### Community Firmware einspielen (dringend empfohlen)

Die Original-Firmware der Squeezebox Radio hat bekannte WLAN-Probleme, die sich seit der mysqueezebox.com-Abschaltung verschlimmert haben. Die Community hat das gefixt – und LMS bietet das Update direkt an:

```
Auf der Squeezebox Radio:
Home → Einstellungen → Erweitert → Software-Update
→ Update auf Community Firmware durchführen
```

Falls das Gerät sich gar nicht erst verbindet: kurz per **Ethernet-Kabel** direkt an den Router anschließen, Update einspielen, danach funktioniert WLAN deutlich stabiler.

Hier gibt es weitere Infos falls das WLAN regelmäßig ausfällt: [Der Trick hat bei mir geholfen, die Stabilität deutlich zu verbessern](https://telebear.de/appTippsTricks/appSqueezebox/appSbRadioWlan/index.html)

Mein Oneliner-Beispiel:
```bash
ssh -oKexAlgorithms=+diffie-hellman-group1-sha1 \
    -oHostKeyAlgorithms=+ssh-rsa \
    -oCiphers=+aes128-cbc \
    root@192.168.178.125 \
    "sed -i '/wmiconfig.*maxperf/s/^/#/' /etc/init.d/wlan && reboot"
```
Passwort: `1234`


## Schritt 3: Raspberry Pi mit piCorePlayer

Für Wohnzimmer und Küche läuft auf jedem Pi **piCorePlayer** – ein winziges, auf Squeezelite spezialisiertes Linux, das von der SD-Karte bootet und im RAM läuft. Kein Verschleiß, kein Overhead, kein Schnickschnack.

### piCorePlayer installieren

```bash
# 1. piCorePlayer-Image herunterladen
#    → https://docs.picoreplayer.org/getting-started/

# 2. Image auf SD-Karte flashen (Raspberry Pi Imager)

# 3. Pi starten, Webinterface aufrufen:
#    http://<raspberry-pi-ip>:80
```

Im Webinterface dann:

```
┌──────────────────────────────────────────────────────────────┐
│                  piCorePlayer Konfiguration                  │
├──────────────────────────────────────────────────────────────┤
│  Tab: Squeezelite Settings                                   │
│  → Audio Output: Analog / USB DAC                           │
│  → Player Name: "Wohnzimmer" / "Küche"                      │
│  → Submit → Restart Squeezelite                              │
│                                                              │
│  Tab: LMS                                                    │
│  → Server IP: 192.168.178.50 (Proxmox-Host)                  │
│  → Submit                                                    │
└──────────────────────────────────────────────────────────────┘
```

Nach dem Neustart erscheinen beide Pis als vollwertige Player im LMS – gleichberechtigt neben den Squeezeboxen im Kinder- und Schlafzimmer.

## Schritt 4: Fernsteuerung – drei Wege

Das ist der Teil, der den Unterschied macht zwischen „funktioniert irgendwie" und „will ich jeden Tag nutzen". Ich nutze drei verschiedene Wege, je nach Situation.

### Squeeze Ctrl am Handy

Meine erste Wahl unterwegs und auf dem Sofa ist **Squeeze Ctrl** – eine schlanke App, die direkt mit LMS spricht. Player auswählen, Musik starten, Lautstärke regeln, Sync-Gruppen bilden. Kein Umweg über eine Cloud, keine Latenz, keine nervigen Verbindungsabbrüche. Einfach schnell.

### HTTP-Requests für Automatisierungen

LMS hat eine vollständige HTTP-API. Das bedeutet: Jede Aktion, die man im Interface machen kann, kann man auch als einfachen HTTP-Request abfeuern. Das nutze ich intensiv – für Automationen in n8n, für Shortcuts auf dem Handy und vor allem für die MyStrom Buttons.

```bash
# Beispiel: Wohnzimmer-Player play/pause toggeln
curl "http://192.168.178.50:9000/jsonrpc.js" \
  -d '{"id":1,"method":"slim.request","params":
       ["<player-mac>",["pause"]]}'

# Lautstärke auf 40 setzen
curl "http://192.168.178.50:9000/jsonrpc.js" \
  -d '{"id":1,"method":"slim.request","params":
       ["<player-mac>",["mixer","volume","40"]]}'

# Alle Player synchronisieren
curl "http://192.168.178.50:9000/jsonrpc.js" \
  -d '{"id":1,"method":"slim.request","params":
       ["<player-mac>",["sync","<player-mac-2>"]]}'
```

Die Player-MAC-Adresse bekommt man direkt aus dem LMS-Webinterface unter *Einstellungen → Player*.

### MyStrom Buttons – physische Steuerung

Das ist mein persönliches Highlight. **MyStrom Buttons** sind kleine WLAN-Taster, die bei Druck einen konfigurierbaren HTTP-Request abfeuern. Kein App öffnen, kein Handy suchen – einfach drücken.

```
┌──────────────────────────────────────────────────────────────┐
│  MyStrom Button Konfiguration (Beispiel: Küche)              │
├──────────────────────────────────────────────────────────────┤
│  Single Press  → Musik play/pause                           │
│  Double Press  → Nächster Titel                             │
│  Long Press    → Alle Räume synchronisieren                 │
└──────────────────────────────────────────────────────────────┘
```

Der Button liegt einfach auf der Anrichte neben der Holztruhe. Meine Frau drückt drauf, ohne zu wissen, was dahinter steckt. Und das ist genau richtig so.

### Multiroom-Synchronisation

Das ist der Moment, für den man das alles macht:

```
┌──────────────────────────────────────────────────────────────┐
│  LMS Sync-Gruppe                                             │
│                                                              │
│  [Wohnzimmer  - Raspberry Pi (Schüssel)  ] ●──┐             │
│  [Küche       - Raspberry Pi (Truhe)     ] ●──┤── Sync       │
│  [Kinderzimmer - Squeezebox Radio        ] ●──┤             │
│  [Schlafzimmer - Squeezebox Radio        ] ●──┘             │
│                                                              │
│  → Alle spielen bit-synchron. Kein Echo. Kein Versatz.      │
└──────────────────────────────────────────────────────────────┘
```

LMS synchronisiert nicht einfach „ungefähr gleichzeitig" – das System arbeitet auf Millisekunden genau. Man kann durch das ganze Haus laufen und überall dieselbe Musik hören, ohne einen einzigen Rhythmus-Versatz zu bemerken. Das ist das, wofür Sonos Unsummen verlangt.

## Was das Ganze kostet

```
┌──────────────────────────────────────────────────────────────┐
│  Mein Setup – Gesamtkosten                                   │
├────────────────────────────────┬─────────────────────────────┤
│  Squeezebox Radio × 2          │  ~50 €  (Kleinanzeigen)    │
│  Raspberry Pi 3B × 2           │  ~30 €  (gebraucht)        │
│  USB-DAC / Lautsprecher        │  ~30 €                     │
│  MyStrom Buttons               │  ~20 €  (pro Stück)        │
│  Porzellanschüssel + Truhe     │  schon da / Flohmarkt      │
│  Lyrion Music Server           │   0 €  (Open Source)       │
│  Proxmox                       │   0 €  (läuft sowieso)     │
├────────────────────────────────┼─────────────────────────────┤
│  Gesamt                        │  ~130 €                     │
└──────────────────────────────────────────────────────────────┘
```

Zum Vergleich: Ein einzelner Sonos-Lautsprecher der Einstiegsklasse kostet heute mehr als das gesamte Setup oben.

## Das Ergebnis

Irgendwo in meinem Heimnetzwerk läuft gerade ein LXC-Container auf Proxmox, der Musik in vier Zimmer streamt. Die Porzellanschüssel im Wohnzimmer spielt dasselbe wie die Holztruhe in der Küche – auf die Millisekunde synchron. In den Kinderzimmern und im Schlafzimmer leuchten die Displays der Squeezeboxen. Auf der Anrichte liegt ein kleiner weißer Knopf, den man einfach drücken kann.

```
[LMS / Proxmox]     → Stream bereit
[Wohnzimmer]        → Pi in Porzellanschüssel  ♪ Kings of Convenience
[Küche]             → Pi in der Truhe          ♪ Kings of Convenience
[Kinderzimmer]      → Squeezebox Radio 1       ♪ Kings of Convenience
[Schlafzimmer]      → Squeezebox Radio 2       ♪ Kings of Convenience
[MyStrom Button]    → gedrückt ✓
```

Und das alles ohne einen einzigen Cloud-Dienst von Drittanbietern. Kein Abo. Kein Datenschutzproblem. Keine sichtbaren Lautsprecher.

Logitech hat aufgehört. Die Community hat weitergemacht. Und irgendwo steht eine Porzellanschüssel, aus der Kings of Convenience klingt – und niemand fragt, warum.