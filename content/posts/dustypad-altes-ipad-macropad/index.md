+++
title = "dustyPad: Ein altes iPad wird zum Macropad"
date = 2026-11-19
description = "Mit dustyPad wird ein altes iPad oder Tablet mit Browser zum Macropad und Widget-Display für den Mac. Was die Lösung kann und was du dafür brauchst."
draft = true
[taxonomies]
tags = ["tutorial", "hardware", "software", "mac", "ipad", "dashboard", "browser", "smart-home"]
[extra]
vgwort = "https://vg04.met.vgwort.de/na/dc3ba8d8680744d68b11f0c81d6e8c04"
comment = true
+++

# Ein neues Leben für das alte iPad

In der Schublade liegt noch ein altes iPad, das für aktuelle Apps eigentlich zu langsam ist? Für ein Dashboard oder ein paar große Knöpfe am Schreibtisch kann es trotzdem noch reichen. Ich habe schon einmal ein altes iPad als Smart-Home-Dashboard verwendet. Jetzt bin ich auf **dustyPad** gestoßen: Damit wird ein Tablet mit Browser zum Macropad und Widget-Display für den Mac.

Der Gedanke gefällt mir: Statt ein separates Gerät mit Tasten zu kaufen, nutzt man einen Bildschirm, den man schon besitzt. Play und Pause, Lautstärke, Mikrofon stummschalten oder eine häufig genutzte App öffnen – all das kann auf einer eigenen Oberfläche liegen. Daneben passen Widgets wie Uhrzeit, Wetter oder der gerade laufende Titel.

> **Hinweis für die Überarbeitung:** Hier nach dem eigenen Test ergänzen, welches alte iPad oder Tablet verwendet wurde und wie sich die Einrichtung angefühlt hat.

## Was ist dustyPad?

dustyPad besteht aus einer Mac-App und einer Webseite für das Tablet. Die Mac-App läuft in der Menüleiste und stellt die Oberfläche im lokalen Netzwerk bereit. Auf dem iPad öffnet man die Adresse einfach im Browser. Eine zusätzliche iPad-App und ein App-Store-Download sind dafür nicht nötig.

Das ist der Unterschied zu einem normalen Web-Dashboard: Das Tablet ist die Bedienoberfläche für den Mac. Der Mac führt die Aktionen aus – etwa Musik pausieren, die Lautstärke ändern oder ein Programm starten.

Für die Verbindung müssen beide Geräte im selben WLAN sein. Beim ersten Verbinden wird ein sechsstelliger Code eingegeben, der auf dem Mac angezeigt wird. Laut Projekt rotiert dieser Code alle fünf Minuten und kann nur einmal verwendet werden.

## Welche Geräte funktionieren?

Auf der Tablet-Seite reicht ein Browser, der die Seite laden kann. dustyPad nennt Safari ab iOS 9 als Mindestanforderung und führt auch Android-Tablets, Kindle-Fire-Geräte und sogar ältere Smartphones als mögliche Geräte auf. Das Tablet muss keine aktuelle App mehr installieren können.

Es gibt allerdings eine wichtige Voraussetzung: Auf der anderen Seite braucht man einen Mac mit macOS 13 Ventura oder neuer. dustyPad ist also keine alleinstehende Dashboard-Software, die auf jedem Webserver läuft. Der Mac ist der Host und muss eingeschaltet sein, während man das Tablet als Bedienfeld verwenden möchte.

## Ein passender Rahmen aus dem 3D-Drucker

Für mein iPad Air der ersten Generation habe ich außerdem einen [Rahmen-Konfigurator für den 3D-Druck](konfigurator/index.html) ergänzt. Im Browser lässt sich der Rahmen anpassen, zum Beispiel bei Wandstärke, Kabelöffnung, Rückseite und Standfüßen. Anschließend kann man die OpenSCAD-Datei oder einzelne STL-Dateien für Rahmen, Rückplatte und Füße exportieren.

Der Konfigurator ist ein separates Projekt und keine Funktion von dustyPad. Er ist auf das iPad Air der ersten Generation ausgelegt (240 × 169,5 × 7,5 mm, Querformat, Einschub von oben) und daher nicht für beliebige Tablets geeignet. Vor dem Druck sollte man die Maße und die Passform prüfen. Für den saubersten STL-Export empfiehlt der Konfigurator den OpenSCAD-Export.

## Was kann das Macropad?

Schon in der kostenlosen Version gibt es einige praktische Aktionen:

- Medien steuern und die Lautstärke ändern
- das Mikrofon stummschalten
- Apps oder Webseiten öffnen
- Uhrzeit, Wetter und den gerade laufenden Titel anzeigen
- die Oberfläche mit Themes und Symbolen anpassen

Mit der Pro-Version kommen unter anderem frei belegbare Tastenkürzel, Shortcuts-App-Makros, Timer, Pomodoro, Weltuhr und Systeminformationen dazu. Die kostenlose Version bleibt laut Anbieter dauerhaft verfügbar; Pro wird als einmaliger Kauf angeboten.

Das ist für mich eine interessante Mischung: Ein Knopf kann eine Aktion auslösen, während ein Widget daneben Informationen zeigt. Das Tablet wird damit nicht nur zur Ansammlung von Links, sondern zu einer kleinen, auf den eigenen Arbeitsplatz zugeschnittenen Konsole.

## Einrichtung ohne Kabel

Der Ablauf klingt angenehm überschaubar:

1. dustyPad auf dem Mac installieren und starten.
2. Auf dem Tablet den Browser öffnen und die lokale Adresse aufrufen, die dustyPad anzeigt.
3. Den einmaligen Verbindungscode vom Mac eingeben.
4. Die gewünschten Aktionen und Widgets auf der Oberfläche anordnen.

Die Verbindung läuft über das lokale WLAN. Ein Konto oder ein Cloud-Relay soll für die normale Nutzung nicht erforderlich sein. Für einzelne Funktionen – zum Beispiel Wetter, die Pro-Lizenzprüfung und die Suche nach Updates – kann dustyPad laut FAQ trotzdem eine Internetverbindung verwenden.

## Ein Stream Deck aus der Schublade?

Ein echtes Stream Deck hat physische Tasten. Man kann sie blind bedienen und spürt, was man drückt. Ein Tablet kann das nicht ersetzen. Dafür besitzt man den Bildschirm vielleicht bereits, kann die Oberfläche verändern und sieht neben den Knöpfen auch Widgets.

Für mich wäre dustyPad deshalb keine perfekte Kopie eines Stream Decks, sondern eine günstige Möglichkeit, einem alten Tablet noch eine Aufgabe zu geben. Besonders dann, wenn es ohnehin auf dem Schreibtisch liegt und man ein paar wiederkehrende Aktionen griffbereit haben möchte.

Auch als Smart-Home-Dashboard ist es nicht automatisch die passende Lösung: Die Aktionen von dustyPad steuern den Mac. Wer vor allem Lampen, Sensoren und andere Smart-Home-Geräte bedienen möchte, braucht dafür weiterhin eine entsprechende Dashboard- oder Smart-Home-Integration.

## Datenschutz und Grenzen

Der Anbieter beschreibt dustyPad als lokale Verbindung zwischen Mac und Tablet: kein Benutzerkonto, kein Cloud-Relay und keine Telemetrie in der App. Die Kopplung über einen wechselnden Code ist sinnvoll, weil nicht einfach jedes Gerät im WLAN Aktionen an den Mac schicken können soll.

Das ersetzt natürlich nicht den eigenen Blick auf die Software und die Netzwerkeinstellungen. Außerdem bleibt der Mac ein notwendiger Teil des Aufbaus. Wenn er ausgeschaltet ist oder dustyPad nicht läuft, steht das Bedienfeld auf dem Tablet nicht zur Verfügung.

## Lohnt sich der Versuch?

Wer ein altes iPad oder ein anderes Tablet mit Browser herumliegen hat und einen Mac mit Ventura oder neuer nutzt, kann dustyPad ausprobieren, ohne erst neue Hardware anzuschaffen. Die kostenlose Version deckt schon mehrere typische Macropad-Aktionen ab. Für erweiterte Widgets, eigene Tastenkürzel und weitere Designs gibt es eine einmalige Pro-Lizenz.

Ich finde vor allem den Ansatz sympathisch: Nicht jedes alte Gerät muss sofort entsorgt werden, nur weil der App-Store-Katalog kleiner wird. Wenn der Browser noch funktioniert, kann das Tablet vielleicht weiterhin eine nützliche Oberfläche sein.

**Links:** [dustyPad](https://dustypad.com/) · [Downloads für macOS](https://github.com/mknarciso/dustypad-releases/releases)

> **Vor Veröffentlichung prüfen:** dustyPad auf einem eigenen älteren Gerät testen, Screenshots ergänzen und Preis sowie Systemanforderungen noch einmal auf der Projektseite abgleichen.
