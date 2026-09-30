+++
title = "Rate my Setup - Proxmox"
date = 2026-09-30 12:00:00+01:00
description = "Ok ich hatte schon richtig blöde Erfahrungen mit meinem Server...so allgemein, da ist es vielleicht auch nicht verwunderlich, dass ich das Upgrade zu PVE 9.0 nicht gemacht habe. Aber jetzt ist es soweit und ich habe mir mal die Zeit genommen, um mein Setup zu dokumentieren und zu zeigen, wie ich meinen Server aufgestellt habe."
[taxonomies]
tags = ["vm", "shell", "homelab", "lxc", "pve" ,"selfmade"]
[extra]
comment =  true
+++

## Im Anfang war das Bit
Die ganze Zeit schreibe ich über die Dinge, die ich am Computer, am Server, an meinen Konsolen mache, aber im Grunde habe ich nicht dokumentiert, wie ich meinen Server aufgestellt habe. Von der Hardware bis hin zu den einzelnen LXC's und Docker Containern. Ich habe mir mal die Zeit genommen, um das alles zu dokumentieren und zu zeigen, wie ich meinen Server aufgestellt habe. Mit einem Ranking, der wertvollsten Container, die ich am Laufen habe. [J.](https://enthusiastic.dev/) und ich, wir haben uns schon ziemlich früh über Programmierung und PCs unterhalten. Von seinem Können, damals noch vor 2010, als wir so 13 - 14 Jahre alt waren, war ich stets begeistert. Er hatte schon seine eigene Webseite mit PHP geschrieben. Wahnsinn! Ich erinnere mich noch, wie er mir den Hostingdienst [bplaced](https://www.bplaced.net/) (oder war es bluehost?) empfohlen hatte und damit fing es an, dass Probieren, das Programmieren, das Publizieren.

### Hardware: Das Fundament meines Proxmox-Homelabs
Alle 25 LXC-Container laufen auf einem kompakten Proxmox-Host mit AMD Ryzen 7 7735HS, rund 32 GiB RAM und drei getrennten Speicherebenen: SSDs für System und Container, HDDs für Daten und eine eigene SSD für Backups.

#### Systemübersicht

| Komponente | Details |
|---|---|
| CPU | AMD Ryzen 7 7735HS mit Radeon Graphics, 16 Threads (8 Kerne), 1 Sockel |
| RAM | 29,12 GiB |
| Swap | Nicht aktiv |
| Boot-Modus | EFI |
| Proxmox VE | pve-manager 9.2.21 |
| Kernel | Linux 7.0.14-19-pve |

#### CPU: Ryzen 7 7735HS
Der Mobilprozessor bietet viel Leistung bei geringem Stromverbrauch und passt damit gut zu einem 24/7-Homelab. Die integrierte Radeon-Grafik lässt sich für Hardware-Transcoding (z. B. Plex oder Immich) nutzen.

#### Speicher-Übersicht

| Laufwerke | Zweck | Konfiguration | Nutzbar |
|---|---|---|---|
| 2x 512 GB SSD | Proxmox-OS und LXC's | Zuvor ZFS-Mirror, jetzt brauche ich den Speicher | ca. 1 TB |
| 3x 4 TB HDD | Daten (Fotos, Filme, Spiele, Dokumente) und auch LXC-Backups | ZFS RAIDZ1 (1 Paritätsplatte) | ca. 8 TB |
| 1x 256 GB SATA-SSD | Backups der wichtigsten LXC's| Einzelplatte | ca. 256 GB |

#### 2x 512 GB SSD: System und Container
Auf den beiden SSDs liegen das Proxmox-Betriebssystem und alle Container. Die schnellen Laufwerke sorgen für kurze Startzeiten und flotte Datenbanken (Nextcloud, Immich, PocketBase).

#### 3x 4 TB HDD: ZFS RAIDZ1 für die Daten
Drei Platten bilden einen RAIDZ1-Pool mit einer Paritätsplatte. Von 12 TB Brutto bleiben rund 8 TB nutzbar, und eine Platte darf ausfallen. Hier liegen große Datenmengen wie die Plex-Mediathek, Immich-Fotos, ROMs für RomM und Nextcloud-Dateien.

#### 1x 256 GB SATA-SSD: Backups
Eine eigene SSD nimmt die Proxmox-Backups (vzdump) auf. Sie liegt physisch getrennt von den Container-SSDs, sodass ein Ausfall des Hauptsystems die Sicherungen nicht mitreißt.

#### Folgendes ist vielleicht auch noch interessant
- RAIDZ1 ersetzt kein Backup. Wichtige Daten gehören zusätzlich extern gesichert. [Hier ein Beispiel von mir.](https://simeon.staneks.de/posts/backup-cheap-and-easy/)
- 256 GB reichen nur für die Container-Backups. Die 8 TB Daten passen dort nicht hinein, dafür gibt es ein externes Backup (s.o.).

### Die Software
#### 100 – Nextcloud: Meine eigene Cloud statt Dropbox und Google Drive
Dateien, Kalender und Kontakte liegen bei mir zu Hause. Der Artikel zeigt, wie ich Nextcloud in einem LXC betreibe.

#### 101 – AdGuard Home: Werbung und Tracker im ganzen Netzwerk blockieren
AdGuard filtert DNS-Anfragen für alle Geräte im Heimnetz. Das spart Bandbreite und schützt die Privatsphäre.

#### 102 – Fleet: Geräteverwaltung im Homelab (aktuell gestoppt)
Fleet verwaltet und überwacht Endgeräte. War bisher nur eine Testinstallation, die ich nicht weitergeführt habe.

#### 103 – Webserver: Mein zentraler Host für Websites und Projekte
Im LXC 103 laufen 23 Docker-Container. Sie bilden Automatisierung, Dokumentenverwaltung, Formulare, Messaging und mehrere eigene Webseiten ab und "nativ" läuft da auch der Caddy, der als reverse Proxy für alle Dienste fungiert.

##### Automatisierung und Kommunikation
- **n8n**: Workflow-Automatisierung für Medien, KI und Dienste.
- **Listmonk**: Newsletter-Versand, mit eigener PostgreSQL-13-Datenbank (Port 9499).
- **wwebjs-api**: WhatsApp-Web-API zum Senden und Empfangen von Nachrichten per Script.
- **Signal CLI REST API**: Signal-Nachrichten per REST-Schnittstelle.

##### Dokumente und Daten
- **Paperless-ngx**: Digitales Dokumentenarchiv mit OCR und Tags.
- **Tika**: Textextraktion für Paperless, nur intern erreichbar.
- **Gotenberg**: Konvertiert Office-Dokumente und E-Mails in PDF, nur intern.
- **Redis 7**: Broker für Paperless, nur intern.
- **NocoDB**: Airtable-Alternative auf Basis einer PostgreSQL-15-Datenbank.
- **HeyForm**: Formular-Builder.

##### Produktivität und Verwaltung
- **Kimai**: Zeiterfassung, mit MySQL 8.3 als Datenbank (intern).
- **Homepage**: Dashboard mit Links zu allen Diensten.
- **FTP-Server**: Dateiübertragung per FTP.

##### Eigene Webseiten und Tools
- **page-private**: Private Webseite auf Apache/PHP. (Lokale Webseite für lokale Endgeräte)
- **page-mt183**: [Webseite mt183.de.](https://mt183.de/)
- **page-veit**: [Projektseite Veit.](https://www.veit.app/)
- **page-feiafanga**: [Webseite Feiafanga.](https://feiafanga.de/)
- **md2epub**: [Eigenes Tool, das Markdown in EPUB umwandelt.](https://github.com/SimeonLukas/Obsidian2Kindle)

#### 104 – Workplace: Die Entwicklungsumgebung im Container
Ein eigener Container als Arbeitsplatz mit Tools, Terminal und Projekten. Er lässt sich jederzeit sichern und klonen und sorgt für die Backups zu Hetzner.

#### 105 – Plex: Der eigene Streamingdienst für Filme und Serien
Plex verwaltet die Mediathek und streamt sie auf alle Geräte.

#### 106 – BookStack: Dokumentation und Wiki, die wirklich genutzt wird
BookStack ordnet Notizen und Anleitungen in Büchern und Kapiteln. Nutze ich für meine Arbeitskollegen.

#### 107 – Homebox: Inventarverwaltung für Haushalt und Technik (gestoppt)
Homebox erfasst Geräte, Garantien und Belege. Nutze ich zu selten.

#### 108 – Ubuntu: Der Allzweck-Container für Experimente
Ein sauberes Ubuntu zum Testen neuer Software. Für das automatisierte Erstellen von Videos. Vielleicht kommt da noch ein Artikel.

#### 109 – PocketBase: Ein Backend in einer einzigen Datei
PocketBase liefert Datenbank, Auth und API in einem Binary. [Das Backend für feiafanga.](https://001.feiafanga.de/)

#### 110 – Vaultwarden: Passwörter selbst hosten, aber sicher
Die schlanke Bitwarden-Alternative für alle meine Zugangsdaten.

#### 111 – Immich: Google Fotos ersetzen mit eigener Foto-Cloud
Immich sichert Handyfotos automatisch und bietet Gesichtserkennung und Suche. Alles bleibt auf meinem Server.

#### 112 – Reitti: Standortverlauf privat auswerten (gestoppt)
Reitti visualisiert Bewegungsdaten, ohne sie an Dritte zu geben. Nutze ich gerade zu selten.

#### 113 – Open WebUI: Die Oberfläche für meine lokalen KI-Modelle
Open WebUI verbindet sich mit lokalen LLMs und bietet eine ChatGPT-ähnliche Bedienung.

#### 114 – SearXNG: Meine private Metasuchmaschine (gestoppt)
SearXNG bündelt viele Suchmaschinen ohne Tracking. Im Moment brauche ich es nicht.

#### 115 – Alpine Docker: Minimalistischer Docker-Host im LXC
Alpine braucht kaum Ressourcen und eignet sich gut für Docker-Stacks. Ich habe den Container extra für Whisper installiert. [Hier mehr dazu.](https://simeon.staneks.de/posts/stt-telegram-n8n-nextcloud-obsidian/)

#### 116 – Layers: Ein eigener Design-Editor im Browser
Templates, Poster und Grafiken erstelle ich mit eine Canva Alternative im Browser. Das ist nicht öffentlich, aber meine private Alternative zu Canva. Vielleicht mache ich noch einen Artikel dazu.

#### 117 – PocketBase (zweite Instanz): Projekte sauber trennen
Eine zweite PocketBase-Instanz hält Projekte voneinander getrennt. Das erleichtert Updates und Backups. [Das Backend für feiafanga.](https://002.feiafanga.de/)

#### 118 – Syncthing: Dateien ohne Cloud zwischen Geräten synchronisieren
Syncthing gleicht Ordner direkt zwischen meinen Geräten ab. Es braucht keinen Drittanbieter.

#### 119 – Ignis: Was steckt hinter diesem Container? (gestoppt)
Ein Projekt, das aktuell ruht. Obsidian im Browser. Dachte ich brauche es ... Naja.

#### 120 – Linkwarden: Lesezeichen sammeln und dauerhaft archivieren
Linkwarden speichert Links samt Archivkopie und Tags. So verschwinden Quellen nicht mehr. Sehr nützlich!

#### 121 – RomM: Die Retro-Spielebibliothek im Browser
RomM verwaltet ROMs mit Covern und Metadaten. Passend für Emulation auf Handhelds.

#### 122 – LanguageTool: Rechtschreibprüfung lokal und ohne Cloud
Der eigene LanguageTool-Server prüft Grammatik und Stil, ohne dass Texte das Haus verlassen.

#### 123 – Lyrion Music Server: Multiroom-Audio im Heimnetz
Lyrion (früher Logitech Media Server) versorgt Player im ganzen Haus mit Musik. Der Artikel zeigt die Einrichtung.

#### 124 – Alpine: Der kleinste Container im Homelab
Ein minimaler Alpine-LXC für Mini-Dienste und Tests. Er startet in Sekunden und braucht kaum RAM. Für folgendes Projekt: [Internationaler Service auf der Zugspitze](https://service.tourismuspastoral.de/)


### Ranking: Die wertvollsten Container
1. **Nextcloud**: Ohne Nextcloud wäre mein Homelab nur ein Server. Kalender, ToDos, etc... alles an einem Ort für meine Frau und mich.
2. **Plex**: Wichtig, damit die Kinder auch ohne Werbung schauen können
3. **Immich**: Läuft die ganze Zeit, weil alle Fotos direkt mit der Smartphone App dort landen.
4. **AdGuard Home**: Spart Daten und Werbung
5. **Webserver**: Ohne den Webserver würde ich keine eigenen Webseiten und Projekte hosten können.
6. **Paperless**: Ohne Paperless wäre ich aufgeschmissen
7. **n8n**: Ohne n8n würde ich viele Dinge manuell machen müssen, die automatisiert laufen.
8. **Lyrion Music Server**: Ohne den Musikserver wäre das White Noise für die schlafenden Babys nicht überall.

Es sind alle Container gleich viel Wert. Doch ohne die genannten 8 wäre ich persönlich einfach aufgeschmissen.

Folgende Webseite ist wirklich herausragend, wenn es um das eigene Homelab mit Proxmox geht: [https://community-scripts.org/](https://community-scripts.org/)



