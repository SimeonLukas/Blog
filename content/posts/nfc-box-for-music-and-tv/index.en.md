+++
title = "An NFC Wooden Box for Kids' Music – DIY Alternative to Toniebox"
date = 2025-12-31 12:00:00+01:00
description = "How I built a smart music box with an ESP32, NFC tags, and n8n that even plays our Advent calendar. A cost-effective DIY solution for children."

[taxonomies]
tags = ["diy", "smart-home", "esp32", "nfc", "kids", "hardware", "iot", "project", "n8n", "spotify", "home-automation"]

[extra]
comment =  true

+++

## The Idea: Music for Little Hands

In everyday life with children, many conflict situations arise. One that keeps coming up is: The kids want to hear their music – Bibi & Tina, Benjamin Blümchen, Peppa Pig – and they want it right now. But smartphone apps are too complicated, voice assistants don't understand "Benjamün Blömchen," and the Toniebox is... well, expensive and proprietary. And honestly, I already have kids' music at home, or rather in the Spotify account, so it's nonsense to buy it twice. (Although a Toniebox does sit at home too.)

Another situation is watching series on the TV. The kids would watch everything, and since my wife doesn't really know where which series is, she always switches to YouTube and searches around there. Not optimal, especially because of the ads, so I wanted to create a simple way for the kids to start their favorite series independently, of course with parents present, with a time limit, and with the right content.

That's why I built an NFC wooden box that you can easily replicate. The kids place a stickered card on the box, and the Squeezebox in the living room plays the desired album. The Advent calendar plays a new story every day – with 24 individual chips, or the TV turns on and plays a random episode of the series "Bluey."

## The Heart: A Sleeping ESP32

The ESP32 sleeps most of the time and wakes up briefly every 3 seconds to check for NFC tags. This saves enormous amounts of power, since the interrupt mode of the MFRC522 NFC reader doesn't work reliably, I chose this polling solution:

```cpp
#define WAKEUP_INTERVAL 3000000    // 3 seconds
#define CARD_READ_TIME 800         // 800ms for card detection

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

When a card is detected, the ESP32 plays a beep, connects to WiFi, and sends the UID to an n8n webhook.

## The Intelligence: n8n Orchestrates Everything

n8n takes over the control. The workflow checks a database for what the respective NFC UID means and then executes the appropriate action:

{% mermaid() %}
graph LR
    A[NFC tag detected] --> B[Webhook receives UID]
    B --> C{Tag known?}
    C -->|No| D[Telegram notification]
    D --> N[Create new tag]
    C -->|Yes| E[Database query]
    E --> F{Action type?}
    F -->|favorite| G[Play favorite]
    F -->|spotify_search| H[Search Spotify]
    F -->|volume| I[Change volume]
    F -->|advent| J[Advent story]
    F -->|series| K[Random episode]
    G --> L[Control Squeezebox]
    H --> L
    J --> L
    K --> M[Home Assistant script]
{% end %}

The database is very simple; I didn't even know n8n could do that. Here are some examples:

| UID          | action_type    | parameter         | description    |
|--------------|----------------|-------------------|----------------|
| `EC0E72EB`  | `spotify_search` | `bibi_tina`     | Bibi and Tina |
| `BCF172EB`  | `spotify_album`  | `Bluey the Album` | Bluey        |
| `8C1A8EEB`  | `volume`         | `5`              | Quieter      |
| `04E1A89C240289` | `advent`   | `track:67gj...`  | Dec 2        |
| `D4C3B2A1`  | `series`         | `Bluey`          | Bluey random |

## Special Features

### Advent Calendar Integration

Each day in December gets its own NFC disc with a matching story. The workflow automatically plays the correct Spotify track.

### TV Control with Timer

With a special "card," you turn off the TV after 10 minutes and dim the living room light back to 100%.

Other cards play a targeted random episode of the series "Bluey" or "Bobo Siebenschläfer" on the TV. For this, I connected n8n with Home Assistant, which controls the TV.

### "Loud Cards" for Loops

Certain cards (Louder/Quieter) react differently: As long as they are placed on, the action is repeated every 500ms – perfect for volume control!

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

## What I Learned

**My key takeaways:**

1. Deep sleep saves enormous power: The ESP32 consumes only a few µA in deep sleep. This makes battery-operated NFC readers possible; at home, I use two parallel 18650 batteries.
2. n8n is ideal for smart home: Complex workflows can be built without programming. New NFC cards are added quickly.
3. Kids love haptics: Designed cards or figures with glued-on chips are much more tangible than app icons. The principle is immediately understandable (even for my three-year-old) and so much cheaper than Tonie figures.
4. Duplicate detection is important: Without it, every accidental placement would restart the music.

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

## Conclusion

The NFC music box is indispensable in our home, even though it's only 5 weeks old. The kids can start their music themselves, and you can flexibly expand the solution. The Advent calendar is the highlight – a new story every morning, fully automatic. --> Kids take the chip from the dining table, place it on the box, and it starts.

Note: Affiliate links ahead:

**Cost:** about 15€ ([ESP32](https://amzn.to/4qv3Ctt) + [MFRC522](https://amzn.to/4iHk2w5) + [NFC tags](https://amzn.to/4iNwc6O) + wooden box from Tedi) optional: 10€ (18650 batteries + [case](https://amzn.to/44TDqAy))  
**Time:** A weekend  
**Joy:** Priceless

You'll get the complete sources and n8n workflows on request. Have fun building!

***

*Note: The kids could theoretically control the TV with it too. But the corresponding NFC card lies up on the mantelpiece...*