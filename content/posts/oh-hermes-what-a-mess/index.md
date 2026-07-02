+++
title = "Oh Hermes, what a mess! - Mein LOKALER KI-Assistent"
date = 2026-06-30 12:00:00+01:00
description = "Dieser Kaninchenbau ist tief, tiefer als ich dachte. Ich habe mich in die Welt der lokalen KI-Assistenten gestürzt und dabei einige interessante Entdeckungen gemacht. In diesem Artikel teile ich meine Erfahrungen, die Herausforderungen und die Möglichkeiten, die sich mir eröffnet bzw. nicht eröffnet haben."

[taxonomies]
tags = ["ai", "local-ai", "hermes", "qwen3.6", "gemma4", "ai-generated", "locale-ai"]

[extra]
comment =  true
+++

## Genesis: Oh my [Hermes](https://hermes-agent.org/de/)!
Von meinen bisherigen Artikeln weißt du ja, dass ich mir einen kleinen Mini-PC mit einer 780m iGPU gekauft habe. Ich lasse da bereits KI-Modelle lokal laufen, um meine eigenen KI-Stimme zu erzeugen. gemma4 und qwen3.6 liefen jetzt auch ne Zeit lang auf dem Gerät, aber ich habe mich gefragt, ob es nicht noch mehr Möglichkeiten gibt. [J.](https://enthusiastic.dev/) hatte schon was von Huggingface erwähnt und ich bin auch schon öftes darüber gestolpert, aber, dass es da so einen großen Schatz an Modellen gibt, war mir nicht bewusst. Ich habe mich also mal hingesetzt und ein bisschen recherchiert, was es da so alles gibt. Und ich muss sagen, ich bin überwältigt und zugleich verloren, weil ich keinen Plan habe was es da alles gibt und was die Fachbegriffe bedeutetn, aber ich wollte unbedingt meinen persönlichen KI-Assistenten [Hermes](https://hermes-agent.org/de/) lokal laufen lassen und damit beginnt die Reise vor über einer Woche am 17. Juni 2026.

### Der erste Tag - Von der Ordnung zum Chaos
Ich habe Hermes mit ollama installiert und mal geschaut was das Ding kann. Ich habe einfach gemma4 12B it qat damit verbunden und Telegram und dann habe ich versucnte mit Hermes zu Chatten. Doch es kam nichts. Es kam nur

```
Connection error.
APIConnectionError: http://127.0.0.1:11434/v1/chat/completions
```

"Und die Erde war wüst und leer." Passender hätte es kaum sein können. Kein Modell, kein Output, nur ein Chatfenster, das mich anstarrte. Willkommen im Chaos.

### Tag 2 - Die Scheidung der Wasser: ollama raus, llama.cpp rein
Nach dem ersten Frust war klar: ollama und meine 780m (gfx1103) werden keine Freunde mehr. Ich hatte vorher schon mal versucht, über ROCm/HIP GPU-Beschleunigung zu bekommen — Ergebnis: Abstürze, weil die TensileLibrary für gfx1103 schlicht fehlt. Also Trennung der Wasser: ollama abgeschafft, llama.cpp rein, der auf der iGPU tatsächlich stabil läuft. systemd-Service mit `LimitMEMLOCK=infinity` und korrektem `HOME` aufgesetzt, Hermes per OpenAI-kompatibler API an `llama-server` gehängt. Endlich Boden unter den Füßen.

### Tag 3 bis 5 - Das Land bringe Modelle hervor
Jetzt ging die eigentliche Suche los. Huggingface ist, wie gesagt, ein Schatz — aber auch ein Sumpf aus Quants, Buchstabensuppe und MoE-Fachchinesisch (ich dachte ich habe als Theologe schon viele Abkürzungen an der Hand, OH IHS sag ich nur!), durch den ich mich erstmal wühlen musste. Mein Testkandidat: **Qwen3.6-35B-A3B** von unsloth, in gleich drei Ausführungen durchprobiert — `UD-IQ4_NL`, `UD-Q4_K_XL` und eine MTP-Variante (`UD-IQ4_XS`) für spekulatives Decoding. Dazu kamen jede Menge Flags zum Feintuning: `--n-cpu-moe` zum Aufteilen der MoE-Experten zwischen CPU und GPU, `-ctk q8_0 -ctv q8_0` für einen quantisierten KV-Cache, und `--spec-type draft-mtp` für die Multitokenprediktion.

Das Ergebnis war ernüchternd: gutes HTML, aber das Deutsch war eine Katastrophe — viele Fehler, oft mitten im Satz ins Englische gerutscht. Ich habe in der Zeit auch kurz GLM 4.7 Flash und ein dichtes Qwen3.6-27B mit MTP angetestet, aber GLM 4.7 hatte nur unendliche Antworten, und das Qwen3.6-27B war auf der 780m einfach zu langsam, um praktikabel zu sein. Zurück zum Reißbrett.

### Tag 6 - Und Gott schuf den Menschen (oder: gemma kriegt die Krone)
Dann der Wechsel zu **gemma-4-26B-A4B-it** (`UD-Q4_K_XL`). Und siehe da: richtig gutes Deutsch, flüssig, kaum Ausrutscher. Dafür ist es beim Programmieren eine Niete — viele Fehler, wenig Vertrauens würdig. Überraschend gut dagegen: 3D-Modelle mit OpenSCAD. Da liefert gemma4 sauberen, parametrischen Code, mit dem ich tatsächlich etwas anfangen kann. Bin aber trotzdem nicht zufrieden, weil ich mir von einem 26B-Modell mehr erhofft hatte und llama.cpp auf der 780m einfach an seine Grenzen stößt und bei diesem Modell regelmäßig hängenbleibt. Also wieder zurück zu Huggingface, diesmal mit einem anderen MoE-Modell.

So sieht mein aktueller Testlauf (30.06.2026), diesmal mit einem Modell von mradermacher:

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

### Tag 7 - Ruhetag, oder: die ernüchternde Wahrheit
Am siebten Tag ruhte ich — und schaute mir die Logs der letzten Woche an. Ich hatte fleißig mitgeschrieben, wenn Hermes hängenblieb, und siehe da: 78 protokollierte Vorfälle, 75 davon mit erschöpften Wiederholungsversuchen. Über zwei Drittel davon schlichte Verbindungsabbrüche, ein gutes Viertel die Meldung "Loading model" mit Fehlercode 503 — mein Mini-PC, der beim Modellwechsel einfach nicht hinterherkam. Dazu ein paar herrlich kuriose Ausreißer: ein Modell, das partout keine zwei Assistant-Nachrichten hintereinander vertrug, und eine Antwort, die in einem völlig falschen Ausgabeformat landete, statt im erwarteten.

Die Quintessenz: Mein Rechner ist für ein "richtiges", großes Modell schlicht nicht stark genug. Die 780m iGPU ist ein guter Sparringspartner, aber kein Schwergewicht. Trotzdem — und das ist vielleicht der eigentliche Schöpfungsmoment dieser Woche — macht es wahnsinnig Spaß, an den Reglern zu drehen, Quants zu vergleichen und zuzusehen, wie aus Chaos langsam etwas Brauchbares wird.

## Die Skills, die ich Hermes beigebracht habe
Neben dem reinen Modell-Hopping habe ich Hermes in der Woche auch ein paar handfeste Fähigkeiten beigebracht, meist über die `skill_manage`-Funktion direkt aus dem Gespräch heraus:

- **todo** — legt Aufgaben direkt als VTODO in meinem CalDAV-Kalender an, sauber sortiert nach Persönlich, Webentwicklung oder Arbeit. Eine erste Version (`tudu`) habe ich nach kurzer Zeit wieder verworfen und in `todo` aufgehen lassen — Chaos eben, auch beim Skill-Bauen.
- **openscad-design** — erstellt, rendert und exportiert parametrische 3D-Modelle (Vasen, Halterungen, kleine Figuren) als STL, mit klaren Regeln, wo Quellcode und fertige Drucke landen.
- **Zola Workflow & Migration** — wandelt klassische HTML/CSS/JS-Seiten in die Zola-Struktur um (`content/`, `templates/`, `static/`) und deployt sie zum Testen. Praktisch, wenn man nebenbei eine Schulwebsite pflegt.
- **email-triage** — sortiert den Posteingang, erkennt Newsletter und Werbung, räumt auf, ohne je etwas wirklich zu löschen.
- **plakate** — eigene Vorlagen und Skripte für schnelle Veranstaltungsplakate.

Ein bunter Werkzeugkasten, der über die Woche organisch gewachsen ist — genau wie der Rest dieses Experiments. Fortsetzung folgt, sobald die nächste Modellgeneration auf den Markt kommt (oder mein Mini-PC ein Upgrade verträgt).

## Fazit: Ein Kaninchenbau, der tiefer ist als gedacht

Eine Woche, 78 protokollierte Abstürze, drei Modellfamilien, gefühlt hundert Quants und ein Mini-PC, der ehrlich gesagt öfter kapituliert hat, als ich zugeben wollte. Und trotzdem würde ich es sofort wieder so machen.

Die nüchterne Wahrheit zuerst: Eine 780m iGPU ersetzt keine echte GPU-Workstation. Wenn ein Modell groß genug ist, um wirklich gut zu sein, ist es meistens auch groß genug, um meinen kleinen Server beim Laden ins Schwitzen zu bringen — die vielen "Loading model"-Fehler in den Logs sprechen da eine deutliche Sprache. Wer auf dieser Hardware lokal arbeiten will, muss Kompromisse eingehen: kleinere Quants, MoE-Modelle, bei denen nur ein Teil der Experten geladen wird, spekulatives Decoding, um die fehlende Rohleistung etwas auszugleichen. Glanz und Elend liegen hier nah beieinander.

Aber genau das macht für mich den Reiz aus. Jeder Absturz hat mir etwas über Quantisierung, MoE-Architekturen oder die Eigenheiten von Vulkan auf AMD-Hardware beigebracht, das ich vorher nicht wusste. Und am Ende der Woche stand nicht nur ein laufender (wenn auch launischer) KI-Assistent, sondern auch eine Handvoll handfester Skills, die mir im Alltag schon jetzt Arbeit abnehmen — vom Kalendereintrag bis zum 3D-Druck.

Der Kaninchenbau aus der Einleitung war also tatsächlich tiefer, als ich dachte — aber er führt nicht ins Nichts, sondern von Tag zu Tag zu etwas, das ein bisschen mehr nach einem eigenen, lokalen Werkzeug aussieht. Und wie das bei einer guten Schöpfungsgeschichte so ist: Fertig ist das hier noch lange nicht. Fortsetzung folgt, sobald die nächste Modellgeneration auf den Markt kommt — oder mein Mini-PC endlich das Upgrade bekommt, das er sich redlich verdient hat. Die Zukunft gehört meines Erachtens den lokalen KI-Modellen. Viel Spaß beim Experimentieren!

## Bilder, die mir Hermes in der Woche geschickt:

![Von Hermes](images/photo_2026-06-30%2023.31.52.jpeg)
![Von Hermes](images/photo_2026-06-30%2023.31.57.jpeg)
![Von Hermes](images/photo_2026-06-30%2023.32.05.jpeg)
![Von Hermes](images/photo_2026-06-30%2023.32.09.jpeg)
![Von Hermes](images/photo_2026-06-30%2023.32.19.jpeg)
![Von Hermes](images/photo_2026-06-30%2023.32.26.jpeg)