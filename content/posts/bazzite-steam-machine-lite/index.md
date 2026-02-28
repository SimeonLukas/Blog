+++
title = "Meine 420€ Steam Machine Lite: AWOW Mini-PC, Bazzite, EmuDeck, Heroic und Citron"
date = 2026-02-28
description = "Wie ich aus einem AWOW Mini Gaming PC mit Ryzen 7 7840HS, 32 GB RAM und 1 TB SSD eine Steam Machine Lite gebaut habe – mit Bazzite, EmuDeck, Heroic, Citron und Hogwarts in Full HD mit Raytracing."
[taxonomies]
tags = ["gaming", "linux", "bazzite", "mini-pc", "awow", "ryzen-7-7840hs", "steam-machine", "emudeck", "heroic-games-launcher", "citron", "switch-emulation", "hogwarts-legacy", "zelda", "decky-loader", "budget-build", "steam"]
+++

## Von eBay zum Endgegner: Der AWOW-Würfel

Es fing – wie so oft – völlig harmlos an: „Ich schau nur kurz bei eBay, was Mini-PCs so kosten.“  
Ein bisschen Budget von Weihnachten und Geburtstag war übrig, und die Idee, eine Art „Steam Machine Lite“ zu bauen, schwebte schon länger im Hinterkopf herum. - Die Alternative wäre ein Mac Mini M4 gewesen, aber der Preisunterschied war einfach zu groß, um ihn zu ignorieren und eine Nintendo Switch 2 wäre die andere Alterntaive gewesen, die ich wahrscheinlich eh nicht so oft nutzen würde.
Zwei Scrolls, ein innerer Monolog und ein leicht schlechtes Gewissen später war es passiert: Ein **AWOW Mini Gaming PC** mit ziemlich absurden Specs für die Größe lag im Warenkorb.

Drin steckt:
- **AMD Ryzen 7 7840HS** – 8 Kerne, 16 Threads, Boost bis 5,1 GHz  
- **32 GB DDR5 RAM** – genug, um nebenbei noch drei Browser mit je 40 Tabs offen zu lassen  
- **1 TB NVMe PCIe 4.0 SSD** – Ladezeiten, was sind Ladezeiten?
- **Radeon 780M iGPU** – die kleine integrierte GPU, die so tut, als wäre sie eine Mittelklasse-Grafikkarte (Ciao du alte 1050Ti, du bist jetzt überflüssig)  
- WiFi 6, Bluetooth 5.2, 2.5G LAN, 4K-Triple-Display-Support

Also alles in allem: Ein sehr kompakter Klotz mit ernstzunehmender Hardware. Perfekt, um daraus meine ganz persönliche **„Steam Machine Lite“** zu bauen – und das Ganze für rund **420€** Gesamtbudget.


![AWOW Mini Gaming PC](images/steam-machine-lite.png)

<!-- more -->

## Bazzite: Das Gaming-Linux, das ich gesucht habe

Windows? Nein danke. Ich wollte etwas, das sich mehr nach Steam Deck anfühlt und weniger nach „Rate mal, welches Update heute alles kaputt macht“.  
Die Wahl fiel auf **Bazzite** – ein Gaming-fokussiertes Linux, das optisch und funktional stark an SteamOS angelehnt ist, aber auf einem vollwertigen PC läuft.

### Installation: Fast zu einfach

Der Weg war simpel:
1. Bazzite-ISO runterladen  
2. Auf USB-Stick flashen  
3. Mini-PC davon booten  
4. Installer durchklicken  
5. Fertig

Nach dem Neustart lande ich direkt im Gaming-Mode – Controller-fokussiert, hübsch, übersichtlich. Wie ein Steam Deck in Desktop-Form.

### Bazzite-Befehle: Komfort auf Knopfdruck

Das besonders Schöne an Bazzite:  
Es bringt eigene **Komfortbefehle** mit, um typische Gaming-Tools zu installieren, ohne selbst Paketnamen zu googeln oder in Foren zu graben.

Statt „Wie installiere ich XY auf Fedora?“ heißt es eher:  
„Okay, Bazzite, bitte einmal EmuDeck & Co. klar machen, ich hol mir in der Zeit einen Kaffee.“

Der Befehl heißt `ujust` und dahinter verbirgt sich eine Art Meta-Installer, der die gängigsten Gaming-Tools und Emulatoren automatisch installiert und konfiguriert.

Für Emudeck zum Beispiel muss ich nur `ujust install-emudeck` eingeben, und schon wird alles Nötige installiert, die Verzeichnisse angelegt und die Emulatoren vorkonfiguriert.

So werden Dinge wie Emulations-Setups und zusätzliche Gaming-Tools von einer halben Nacht Googlen zu: „einmal Befehl abfeuern, schauen, ob’s durchläuft, fertig“.

## EmuDeck: Der Emulations-Tower auf Knopfdruck

**EmuDeck** ist auf diesem System mein Emulations-Hub.  
Einmal eingerichtet, habe ich eine saubere Struktur:

- ROM-Ordner nach System sortiert  
- BIOS-Verzeichnisse  
- Emulatoren vorkonfiguriert  
- Optional Integration in den Spiele-Frontend

Der Assistent führt einen durch die wichtigsten Fragen:  
„Welche Systeme brauchst du?“, „Wo sollen die ROMs hin?“, „Willst du Integration in deine Spieleoberfläche?“

Nach ein paar Klicks wird aus dem AWOW-Würfel eine Zeitmaschine:
von alten Klassikern bis hin zu modernen Konsolen findet alles seinen Platz.

## Heroic Games Launcher: Nicht nur Steam

Natürlich läuft auf Bazzite **Steam** als Hauptdarsteller.  
Aber meine Spielebibliothek ist ein chaotischer Patchwork-Teppich aus Steam, Epic und GOG.

Dafür gibt es **Heroic Games Launcher**:
- verbindet sich mit meinen Epic- und GOG-Accounts  
- lädt die Bibliotheken rein  
- installiert Spiele direkt unter Linux  
- nutzt Proton/Wine im Hintergrund, ohne dass ich mich um Details kümmern muss
- außerdem lässt sich das Spiel direkt aus der Steam-Bibliothek starten, was das Ganze noch nahtloser macht

Der AWOW-Mini-PC wird damit zur Plattform, die all meine digitalen Fehlkäufe und spontanen Gratis-Spiele unter einem Dach vereint.

## Hogwarts Legacy: Full HD mit Raytracing – auf einem Mini-PC

Jetzt kommt der Teil, bei dem ich selbst kurz skeptisch war, nicht nur wegen J.K. (aber das Spiel war gratis): **Hogwarts Legacy**.  
Das ist kein kleines Indiespiel, sondern ein ziemlich hungriger Brocken. Aber genau deshalb ist es perfekt als Benchmark für die Steam Machine Lite.

Und – Überraschung – auf dem Ryzen 7 7840HS mit Radeon 780M läuft es bei mir:
- in **Full HD**  
- sehr stabil  
- **mit aktiviertem Raytracing**

Ja, wirklich. Full HD + Raytracing. Auf einem Mini-PC. Unter Linux.  
Wenn mir das jemand vor ein paar Jahren erzählt hätte, hätte ich gelacht und weiter meine 720p-Settings angepasst.

Die Kombination aus:
- kräftiger APU  
- schneller DDR5  
- Bazzite + Proton  
macht das möglich. Und das Ergebnis ist kein „okay, zur Not spielbar“, sondern „ich vergesse komplett, dass das gerade kein dicker Tower-PC ist“.

Durch die Gänge von Hogwarts zu laufen, während Raytracing die Beleuchtung übernimmt, fühlt sich verdächtig nach „Next-Gen“ an – nur eben aus einem Schuhkarton großen Gehäuse.

## Switch-Emulation mit Citron: Zelda in Höchstform

Natürlich musste ich dann auch an der Emulationsfront eskalieren.  
Für die Switch-Emulation nutze ich **Citron** und – keine große Überraschung – ich habe es direkt mit **Zelda** ausprobiert.

Die Schritte sind klassisch:
1. Keys und Firmware von der eigenen Switch dumpen  
2. Citron einrichten und die Dateien an die richtige Stelle legen  
3. Spiel-Datei (z.B. Tears of the Kingdom) einbinden  
4. Grafikbackend wählen (Vulkan), ein bisschen Settings drehen, fertig

Und dann stehe ich plötzlich wieder in Hyrule – nur diesmal nicht auf der Couch mit der Switch in der Hand, sondern am Schreibtisch oder vorm großen TV, gesteuert über einen Steam Controller oder sogar Maus und Tastatur (wirklich nicht empfehlenswert).


Kurz: Citron + AWOW + Bazzite = Hyrule auf dem PC, als wäre das Spiel dafür gedacht.

## Decky Loader: Meine Cover-Galerie

**Decky** ist auf meinem System aktuell noch der stille Mitbewohner.  
Ich nutze ihn nämlich bisher **fast ausschließlich für Titelbilder und Symbole** meiner Spiele.

Das klingt erstmal nach „Kosmetik“, aber:
- hübsche Cover  
- saubere Icons  
- konsistente Darstellung im Gaming-Mode  

machen erstaunlich viel fürs Gefühl.  

Die richtig wilden Dinge, die Decky kann – Performance-Plugins, Themes, UI-Hacks – hebe ich mir für später auf. Im Moment reicht mir mein kleines grafisches Aufräum-Abenteuer.

## Fazit: 420€ für eine ernsthafte Steam Machine Lite

Wenn ich alles zusammenzähle, habe ich jetzt:

- Einen **AWOW Mini Gaming PC** mit Ryzen 7 7840HS, 32 GB DDR5, 1 TB NVMe und Radeon 780M  
- **Bazzite** als stabiles, gaming-optimiertes Linux mit Komfortbefehlen  
- **EmuDeck** als Emulations-Backbone  
- **Heroic** für Epic- und GOG-Spiele  
- **Citron** für Zelda & Co. auf dem Desktop  
- **Decky**, um das Ganze optisch aufzuräumen

Das alles für rund **420€** Gesamtinvestition.  
Für mich ist das die perfekte Mischung aus:

- genug Power für moderne Titel wie Hogwarts Legacy in Full HD mit Raytracing  
- genug Flexibilität für Emulation bis in die aktuelle Konsolengeneration
- genug Komfort, um das Ganze tatsächlich zu nutzen – und nicht nur als „Projekt“ im Hinterkopf zu haben
- dafür kann ich getrost meinen alten Gamingrechner verkaufen, da die alte 1050Ti jetzt überflüssig ist, und das Geld in neue Spiele investieren, die ich auf der Steam Machine Lite zocken kann.
- By the way das Gerät ist viel perofmanter als mein Steam Deck, deshalb nutze ich mein Steam Deck als quasi Streaming Client für die Steam Machine Lite, wenn ich mal auf der Couch zocken will, was auch super funktioniert.