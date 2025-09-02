+++
title = "Wie man mit drei Ingredienzien ein magisches Smart Home Dashboard braut"
date = 2025-08-26 12:00:00+01:00
description = "Yarr! In diesem Artikel zeige ich, wie ich mit HTML, CSS und JavaScript - quasi den drei Zutaten eines mächtigen Voodoo-Zaubers - ein interaktives Smart Home Dashboard erschaffen habe. Eine Geschichte über Point-and-Click Magie und moderne Technologie."
[taxonomies]
tags = ["programming", "javascript", "html", "css", "smarthome", "dashboard", "tutorial", "point-and-click"] 
[extra]
comment =  true
+++

# Wie man mit drei Ingredienzien ein magisches Smart Home Dashboard braut
*oder: "Mein Name ist Simeon Stanek und ich will Pirat ähhhh. Programmierer werden!"*
Als technikbegeisterter Mensch mit einem Smart Home System stand ich vor einem Rätsel, das selbst der mächtige Voodoo-Priester von Mêlée Island™ nicht hätte lösen können: Wie steuert man ein modernes Zuhause, ohne sich in einem Labyrinth aus Apps zu verlieren? Die Antwort war so einfach wie das Mischen eines Grog: Ich würde mein eigenes Dashboard entwickeln - mit den drei magischen Zutaten des Webs: HTML, CSS und JavaScript.

## Das Konzept: Ein Interface, das selbst LeChuck beeindrucken würde
Das Dashboard sollte vor allem eines sein: funktional. Ich brauchte eine Übersicht über verschiedene Räume und die Möglichkeit, Lichter und andere Geräte zu steuern. Die Benutzeroberfläche sollte intuitiv sein und sich an meine Gewohnheiten anpassen.

### Die technische Umsetzung
Das Projekt basiert auf drei Hauptkomponenten:

1. **HTML** für die Struktur
2. **CSS** für das Design
3. **JavaScript** für die Interaktivität

Die Daten werden in einer JSON-Datei gespeichert, die als eine Art einfache Datenbank fungiert. Dies ermöglicht es mir, Änderungen an der Konfiguration vorzunehmen, ohne den Code anzufassen.

### Die Räume - Meine persönliche SCUMM-Bar
Das Dashboard zeigt verschiedene Räume meines Zuhauses - quasi wie eine moderne Version der SCUMM-Bar, nur dass hier statt Grog verschiedene Smart-Home-Getränke ausgeschenkt werden:

- Wohnzimmer (hier gibt's definitiv besseres Licht als in der Taverne)
- Schlafzimmer (perfekt für einen Powernap zwischen den Abenteuern)
- Diele (der erste Eindruck zählt, auch ohne sprechenden Totenkopf)
- Esszimmer (hier schmeckt sogar das Root Beer™)
- Küche (für die unvergleichliche Hintergrundmusik beim Kochen)
- 1. Stock (wo die geheimen Schätze lagern)
- Fernseherzimmer (für die epischen Filmabende)

Jeder Raum wird durch ein eigenes Bild repräsentiert und zeigt den aktuellen Status der Geräte an - ganz ohne Voodoo-Zauber oder sprechende Schädel. Die Bilder habe ich so gewählt, dass sie den jeweiligen Raum gut repräsentieren und gleichzeitig eine atmosphärische Stimmung schaffen.

### Die Steuerung: Ein Mini-Point-and-Click-Adventure
Als großer Fan von Point-and-Click-Adventurespielen wollte ich etwas von diesem spielerischen Charme in mein Dashboard bringen. Statt gewöhnlicher Buttons habe ich mich für eine HTML Image Map entschieden - eine Technik, die viele vielleicht noch aus den klassischen Adventure-Spielen kennen. Man klickt einfach direkt auf die Objekte im Raum, die man steuern möchte, ganz wie bei einem Adventure-Spiel.

Für jedes Gerät gibt es klickbare Bereiche im Raumbild:

- Hauptbeleuchtung - ein Klick auf die Deckenlampe
- Ambientebeleuchtung (wie die Stehlampe im Wohnzimmer) - direkt auf die Lampe klicken
- Andere Geräte (wie Musik in der Küche) - einfach das entsprechende Gerät anklicken

Die Statusänderungen werden sofort visuell dargestellt, sodass man auf einen Blick sehen kann, welche Geräte eingeschaltet sind - fast wie wenn man in einem Adventure-Spiel ein Rätsel gelöst hat und sich die Umgebung verändert. Diese spielerische Interaktion macht die Steuerung nicht nur funktional, sondern auch unterhaltsam.

## Besonderheiten der Implementierung

### Performante Datenhaltung
Die Daten werden in einer JSON-Datei gespeichert:
- `data.json`

```json
[
{
        "name": "wohnzimmer",
        "items": [
            {
                "name": "Licht Wohnzimmer",
                "coords": "972,194,120",
                "shape": "circle",
                "ip": "192.168.178.***",
                "device": "shelly",
                "onclick": "shelly('192.168.178.***', 'light', 'toggle')"
            },
            {
                "name": "Stehlampe Wohnzimmer",
                "coords": "1395,797,1467,489",
                "shape": "rect",
                "ip": "192.168.178.***",
                "device": "shelly",
                "onclick": "shelly('192.168.178.***', 'relay', 'toggle')"
            }
        ]
    },
    ...
]
```
### Bildoptimierung
Die Bilder wurden sorgfältig ausgewählt und optimiert, um schnelle Ladezeiten zu gewährleisten. Für Status-Änderungen werden kleine, effiziente PNG-Dateien oder für Animationen GIF-Dateien verwendet.

By the way: Die Bilder wurden alle mit ChatGPT generiert. Ich habe einfach Fotos von meinen Räumen gemacht und diese dann als Anhang zum Prompt "Verwandle das in ein Pixelart-Image wie bei einem Point-and-Click-Adventure" hinzugefügt. Die Ergebnisse sind überraschend gut geworden!

## Struktur und Beispiele

### Struktur

Das Projekt folgt einer klaren Ordnerstruktur:

```
/
├── css/
│   ├── style.css
│   └── style.min.css
├── js/
│   ├── script.js
│   └── script.min.js
├── images/
│   └── [verschiedene Bilder für Räume und Status]
├── data.json
└── index.html
```

### Beispiele    

<video controls style="max-width: 100%; height: auto;">
  <source src="images/clip.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## Fazit und Ausblick - Das Ende dieser Entwickler-Geschichte
Das Dashboard erfüllt seinen Zweck perfekter als ein Gummihühnchen mit Rolle: Es bietet eine einfache, schnelle und zuverlässige Möglichkeit, mein Smart Home zu steuern. Die Verwendung von Webtechnologien macht es so flexibel.

Für die Zukunft plane ich einige Erweiterungen (oder wie Murray sagen würde: "Mächtige Pläne!"):
- Integration weiterer Smart Home Geräte (vielleicht sogar ein Root Beer™ Dispenser?)
- Automatisierungsregeln direkt im Dashboard (komplizierter als das Rezept für Monkey Island™ Grog)
- Statistiken zur Nutzung
- Energieverbrauchsüberwachung

Das Projekt zeigt, dass man auch mit einfachen Mitteln eine effektive Lösung schaffen kann - ganz ohne einen sprechenden Totenkopf. Manchmal braucht man eben nur drei Zutaten und den Mut eines Möchtegern-Piraten, um etwas Großartiges zu erschaffen. 

*Wie würde Guybrush Threepwood sagen? "Das ist das zweitbeste Dashboard, das ich je gesehen habe!" - "Das zweitbeste? Was ist denn das beste?" - "Oh, das habe ich noch nicht gefunden, aber bei einem so großen Ozean muss es da draußen noch ein besseres geben!"*
