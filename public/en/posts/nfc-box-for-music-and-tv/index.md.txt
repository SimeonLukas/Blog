+++
title = "Eine NFC-Holzbox für Kindermusik – DIY Alternative zur Toniebox"
date = 2025-12-31 12:00:00+01:00
description = "Wie ich mit einem ESP32, NFC-Tags und n8n eine smarte Musikbox gebaut habe, die sogar unseren Adventskalender spielt. Eine kostengünstige DIY-Lösung für Kinder."

[taxonomies]
tags = ["diy", "smart-home", "esp32", "nfc", "kids", "hardware", "iot", "project", "n8n", "spotify", "home-automation", "toniebox"]

[extra]
comment =  true

+++

## Die Idee: Musik für kleine Hände

So im Alltag mit Kindern gibt es viele mögliche Konfliktsituationen. Eine, die immer wieder auftritt ist: Die Kinder wollen ihre Musik hören – Bibi & Tina, Benjamin Blümchen, Peppa Wutz – und zwar jetzt sofort. Aber Smartphone-Apps sind zu kompliziert, Sprachassistenten verstehen "Benjamün Blömchen" nicht, und die Toniebox ist... nun ja, teuer und proprietär. Und ehrlich gesagt habe ich ja schon Kindermusik daheim, bzw. im Spotify-Account, ist doch Käse wenn ich das doppelt kaufen muss. (Obwohl eine Toniebox natürlich auch daheim steht.)

Eine weitere Situaton ist das Anschauen von Serien auf dem Fernseher. Die Kinder würden ja alles schauen und da sich meine Frau nicht wirklich auskennt wo welche Serie läuft, schaltet sie immer auf Youtube und sucht da rum. Nicht optimal, alleine schon wegen der Werbung, deshalb wollte ich eine einfache Möglichkeit schaffen, dass die Kinder selbstständig ihre Lieblingsserien starten können, netürlich im Beisein der Eltern, mit Zeitlimit und mit dem richtigen Inhalt.

Deshalb habe ich eine NFC-Holzbox gebaut, die du ganz einfach nachbauen kannst. Die Kinder legen eine beklebte Karte auf die Box, und schon spielt die Squeezebox im Wohnzimmer das gewünschte Album. Der Adventskalender spielt jeden Tag eine neue Geschichte – mit 24 individuellen Chips, oder der Fernseher geht an und spielt eine zufällige Episode der Serie "Bluey".

## Das Herz: Ein schlafender ESP32

Der ESP32 schläft die meiste Zeit und wacht alle 3 Sekunden kurz auf, um nach NFC-Tags zu schauen. So spart man enorm viel Strom und da der Interupt-Modus des MFRC522 NFC-Readers nicht zuverlässig funktioniert, habe ich mich für diese Polling-Lösung entschieden:

```cpp
#define WAKEUP_INTERVAL 3000000    // 3 Sekunden
#define CARD_READ_TIME 800         // 800ms für Kartenerkennung

void goToSleep() {
  powerOffRFID();
  WiFi.disconnect(true);
  WiFi.mode(WIFI_OFF);
  esp_wifi_deinit();
  esp_sleep_pd_config(ESP_PD_DOMAIN_RTC_PERIPH, ESP_PD_OPTION_OFF);
  esp_sleep_enable_timer_wakeup(WAKEUP_INTERVAL);
  esp_deep_sleep_start();
}
```

Wird eine Karte erkannt, spielt der ESP32 einen Piepton, verbindet sich mit dem WiFi und sendet die UID an einen n8n-Webhook.

## Die Intelligenz: n8n orchestriert alles

n8n übernimmt die Steuerung. Der Workflow prüft in einer Datenbank, was die jeweilige NFC-UID bedeutet, und führt dann die passende Aktion aus:

{% mermaid() %}
graph LR
    A[NFC-Tag erkannt] --> B[Webhook empfängt UID]
    B --> C{Tag bekannt?}
    C -->|Nein| D[Telegram-Benachrichtigung]
    D --> N[Neuen Tag anlegen]
    C -->|Ja| E[Datenbankabfrage]
    E --> F{Aktionstyp?}
    F -->|favorite| G[Favorit abspielen]
    F -->|spotify_search| H[Spotify durchsuchen]
    F -->|volume| I[Lautstärke ändern]
    F -->|advent| J[Adventsgeschichte]
    F -->|series| K[Zufällige Episode]
    G --> L[Squeezebox steuern]
    H --> L
    J --> L
    K --> M[Home Assistant Script]
{% end %}

Die Datenbank ist sehr einfach, wusste gar nicht das n8n so etwas kann. Hier ein paar Beispiele:

| UID | action_type | parameter | description |
|-----|-------------|-----------|-------------|
| `EC0E72EB` | `spotify_search` | `bibi_tina` | Bibi und Tina |
| `BCF172EB` | `spotify_album` | `Bluey the Album` | Bluey |
| `8C1A8EEB` | `volume` | `5` | Leiser |
| `04E1A89C240289` | `advent` | `track:67gj...` | 2.12. |
| `D4C3B2A1` | `series` | `Bluey` | Bluey zufällig |

## Besondere Features

### Adventskalender-Integration

Jeder Tag im Dezember bekommt eine eigene NFC-Scheibe mit einer passenden Geschichte. Der Workflow spielt automatisch den richtigen Spotify-Track:


### TV-Steuerung mit Timer

Mit einer speziellen "Karte" schaltest du den Fernseher nach 10 Minuten aus und dimmst das Licht im Wohnzimmer wieder auf 100%.

Andere Karten spielen gezielt eine zufällige Episode der Serie "Bluey" oder "Bobo Siebenschläfer" auf dem Fernseher ab. Dafür habe ich n8n mit dem Home Assistant verbunden, der den Fernseher steuert.

### "Laute Karten" für Dauerschleife

Bestimmte Karten (Lauter/Leiser) reagieren anders: Solange sie aufliegen, wird die Aktion alle 500ms wiederholt – perfekt zum Lautstärke-Regeln!

```cpp
if (isLoudCard(uid)) {
  while (count < 60) {
    if (isCardStillPresent() && millis() - last >= 500) {
      sendWebhook(uid);
      last = millis();
    }
  }
}
```

## Was ich gelernt habe

**Meine wichtigsten Learnings:**

1. Deep Sleep spart enorm Strom: Der ESP32 verbraucht im Deep Sleep nur wenige µA. Damit sind batteriebetriebene NFC-Reader möglich, wobei ich bei mir zwei parallele 18650er-Akkus nutze.
2. n8n ist ideal für Smart Home: Komplexe Workflows lassen sich ohne Programmierung bauen. Neue NFC-Karten sind schnell hinzugefügt.
3. Kinder lieben Haptik: Die gestalteten Karten oder Figuren mit drangeklebten Chips sind viel greifbarer als App-Icons. Das Prinzip ist sofort verständlich (selbst für meine drei jährige) und so viel billiger als Toniefiguren.
4. Duplikat-Erkennung ist wichtig: Ohne diese würde jedes versehentliche Anlegen die Musik neu starten.

<style>
   .containerimg img {
        width: 200px;
        min-height: 200px;
        margin: 0 10px;
        cursor: pointer;
        transition: transform 0.2s;
    }
    .containerimg img:hover {
        transform: scale(1.05);
    }
    .lightbox {
        display: none;
        position: fixed;
        z-index: 999;
        padding-top: 50px;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.9);
    }
    .lightbox-content {
        margin: auto;
        display: block;
        max-width: 90%;
        max-height: 80%;
    }
    .lightbox-close {
        position: absolute;
        top: 15px;
        right: 35px;
        color: #f1f1f1;
        font-size: 40px;
        font-weight: bold;
        cursor: pointer;
    }
    .lightbox-close:hover {
        color: #bbb;
    }
</style>

<div class="containerimg" style="
    text-align: center;
    display: flex;
    overflow: scroll;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;">
<img onclick="openLightbox(this.src)" src="/posts/nfc-box-for-music-and-tv/images/nfc1.jpeg" alt="NFC Box">
<img onclick="openLightbox(this.src)" src="/posts/nfc-box-for-music-and-tv/images/nfc2.jpeg" alt="NFC Box">
<img onclick="openLightbox(this.src)" src="/posts/nfc-box-for-music-and-tv/images/nfc3.jpeg" alt="NFC Box">
<img onclick="openLightbox(this.src)" src="/posts/nfc-box-for-music-and-tv/images/nfc4.jpeg" alt="NFC Box">
</div>

<div id="lightbox" class="lightbox" onclick="closeLightbox()">
    <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
    <img class="lightbox-content" id="lightbox-img">
</div>

<script>
function openLightbox(src) {
    document.getElementById('lightbox').style.display = 'block';
    document.getElementById('lightbox-img').src = src;
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeLightbox();
    }
});
</script>

## Fazit

Die NFC-Musikbox ist bei uns nicht mehr wegzudenken, obwohl sie erst 5 Wochen alt ist. Die Kinder können ihre Musik selbst starten und du kannst die Lösung flexibel erweitern. Der Adventskalender ist das Highlight – jeden Morgen eine neue Geschichte, ganz automatisch. --> Kinder nehmen den Chip vom Esszimmertisch, legen ihn auf die Box, und schon geht's los.

Achtung jetzt kommen Affiliate-Links:

**Kosten:** ca. 15€ ([ESP32 ](https://amzn.to/4qv3Ctt) + [MFRC522](https://amzn.to/4iHk2w5) + [NFC-Tags](https://amzn.to/4iNwc6O) + Holzbox vom Tedi)  optional: 10€ (18650er-Akkus + [Gehäuse](https://amzn.to/44TDqAy))  
**Zeit:** Ein Wochenende  
**Freude:** Unbezahlbar

Die kompletten Sourcen und die n8n-Workflows bekommst du auf Anfrage. Viel Spaß beim Nachbauen!

---

*Hinweis: Die Kinder könnten theoretisch ja den Fernseher damit steuern. Aber die entsprechende NFC-Karte liegt ganz oben auf dem Kamin...*