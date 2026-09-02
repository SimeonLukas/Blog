+++
title = "Wie ein Kindle aus dem Jahr 2011 mein Pip-Boy fürs Home wurde"
date = 2025-09-01 12:00:00+01:00
description = "Technik... Technik bleibt immer gliech - oder? Wie ich mit HTML, PHP, CSS und JavaScript ein Smart Home Dashboard auf einem alten jailbroken Kindle 4 Touch realisierte. Ein leichtes Tutorial vom Jailbreaken bis zum fertigen Dashboard."
[taxonomies]
tags = ["programming", "javascript", "php", "html", "css", "smarthome", "dashboard", "tutorial", "kindle", "software", "jailbreak"] 
[extra]
comment =  true
+++

# Wie ein Kindle aus der vergangenen Zeit mein Hub für das Smart Home wurde
Das Tutorial ist für meinen lieben Freund [J.](https://enthusiastic.dev/) und alle anderen, die vielleicht auch so ein altes Kindle-Gerät herumliegen haben und es als Smart Home Dashboard nutzen möchten - oder einfach nur, weil sie Spaß an so etwas haben. 2020 hat mir mein Schwager das alte Kindle 4 Touch geschenkt, das er nicht mehr brauchte. Ursprünglich wollte ich es als E-Book-Reader nutzen, aber nach ein paar Wochen merkte ich, dass ich es kaum benutzte. Also begann ich, nach anderen Verwendungsmöglichkeiten zu suchen.

## Das Konzept: Ein Interface, das jeden Endzeitkrieg übersteht
Das Kindle soll wie ein Pip-Boy sein. Naja... ähm... zumindest ein bisschen. Es soll mir ermöglichen, mein Smart Home, die Squeezeboxen zu steuern, ohne dass ich ständig mein Smartphone oder PC benutzen muss. Das Gerät ist robust und braucht wenig Strom. Außerdem hat es einen E-Ink-Bildschirm, der auch bei direkter Sonneneinstrahlung gut lesbar ist - perfekt für den Einsatz in verschiedenen Lichtverhältnissen. Außerdem dient es als Anzeige für unterschiedliche Bilder (je nach Wetter) und die Abfallabfuhrtermine sollen auch erkennbar sein. Also fast wie ein Pip-Boy, außer Waffen und den Rest. Das einzige was vielleicht ein bisschen daran erinnert, ist die Tatsache, dass das Gerät die Musik steuert und einfach alt ist.

## Die technische Umsetzung
Das Projekt basiert auf mehreren Technologien und Komponenten:
#### Software
1. **HTML** für die Struktur
2. **CSS** für das Design und die richtige Anzeige auf dem E-Ink-Display
3. **JavaScript** für die Interaktivität
4. **PHP** für die serverseitige Logik

#### Hardware
1. **jailbroken Kindle 4 Touch** als Display und Steuergerät
2. **Micro-USB-Kabel** für die Stromversorgung
3. **Bilderrahmen** als Case

### Der Jailbreak mit aktuellen Developer Zertifikaten
In diesem Jahr sind tatsächlich die alten Developer-Zertifikate für das Mobileread Kindlet Kit abgelaufen und die Extensions, vor allem KUAL (Kindle Unified Application Launcher) auf den früheren jailbroken Kindle-Geräten funktionieren nicht mehr. Aber keine Sorge, es gibt eine Lösung! Mit den neuen Zertifikaten von [NiLuJe](https://www.mobileread.com/forums/showpost.php?p=4506164&postcount=1295) läuft alles wieder wie geschmiert.

Hier ist eine kurze Anleitung, wie du dein Kindle 4 Touch jailbreaken kannst:

1. **Vorbereitung**: Verbinde dein Kindle mit dem Computer und sichere alle wichtigen Daten.
2. **Download der aktuellen Updates für dein Kindle**: Lade die neueste Firmware von der [Amazon-Website](https://www.amazon.com/-/de/gp/help/customer/display.html?nodeId=GX3VVAQS4DYDE5KE#GUID-4C9EFFF2-2B4E-4DB8-997D-6DC9B3566220__SECTION_AA6BD2D5AAF04CE196510F7D3FA2B2F0) herunter. In diesem Fall (Kindle 4 Touch) muss dein Kindle bis zur Verion *5.3.7.3* geupdatet werden. Die .bin Datei wird in das Wurzelverzeichnis des Kindles kopiert und über das "Menü" -> "Einstellungen" -> "Menü" -> "Kindle aktualisieren" installiert. Das Gerät startet danach neu.
3. **Download der Jailbreak-Dateien**: Lade die aktuellen [Jailbreak-Dateien](https://storage.gra.cloud.ovh.net/v1/AUTH_2ac4bfee353948ec8ea7fd1710574097/mr-public/Touch/kindle-jailbreak-1.16.N-r19426.tar.xz) herunter.
4. **Vorbereitung des Jailbreaks**: Entpacke die heruntergeladenen Dateien und kopiere den Inhalt von *kindle-5.4-jailbreak.zip* in das Wurzelverzeichnis deines Kindles.
5. **Zertifikate austauschen**: Lade die neuen Zertifikate von [NiLuJe](https://storage.gra.cloud.ovh.net/v1/AUTH_2ac4bfee353948ec8ea7fd1710574097/mr-public/KUAL/developer.keystore) herunter und ersetze die alte *developer.keystore* Datei im Wurzelverzeichnis deines Kindles.
6. **Installation des Jailbreaks**: Aktiviere den Jailbreak über das "Menü" -> "Einstellungen" -> "Menü" -> "Kindle aktualisieren". Wenn alles geklappt hat, dann müsste am unteren Rand des Bildschirms **\*\*Jailbreak\*\*** stehen. Das Gerät muss danach neu gestartet werden.

### Anleitung für bisherige Jailbroken Kindles mit KUAL
Falls dein Kindle bereits jailbroken ist, dann kannst du direkt die Zertifikate austauschen, indem du folgende Datei von [NiLuJe](https://www.mobileread.com/forums/attachment.php?attachmentid=215127&d=1745098511) herunterlädst und die passende .bin-Datei für dein Kindle in das Wurzelverzeichnis deines Kindles packst. In diesem Fall wäre es *Update_mkk-20250419-k4-ALL_keystore-install.bin*. Danach kannst du die Datei über das "Menü" -> "Einstellungen" -> "Menü" -> "Kindle aktualisieren" installieren. KUAL sollte wieder funktionieren.

### Installation von KUAL und WebLaunch
1. **Download und Installation von KUAL**: Lade die neueste Version von [KUAL](https://www.mobileread.com/forums/showthread.php?t=225030) herunter. Entpacke die ZIP-Datei und kopiere in das *documents* Verzeichnis deines Kindles die Datei *KUAL-KDK-2.0.azw2*.
2. **Download und Installation von WebLaunch**: Lade die neueste Version von [WebLaunch](https://github.com/PaulFreund/WebLaunch) herunter. Entpacke die ZIP-Datei und kopiere den gesamten Inhalt in ein Verzeichnis namens *WebLaunch* in das *extension* Verzeichnis deines Kindles.
3. **Konfiguration von WebLaunch**: Erstelle eine *settings.js* Datei im *WebLaunch* Verzeichnis und passe diese an (siehe unten). Starte KUAL auf dem Homescreen deines Kindles, wähle WebLaunch aus und schon müsste die Webseite erscheinen.

### Struktur und Konfiguration der *settings.js* Datei

```
/
├── extensions/
│   ├── WebLaunch/
│   │   ├── Alle Dateien von WebLaunch und
|   │   └── settings.js
|── documents/
│   ├── KUAL-KDK-2.0.azw2
```

```javascript
var settings = { 
	url: 'http://192.168.178.***', // IP-Adresse deines Dashboards (achte darauf, dass es per HTTP erreichbar ist), du kannst auch eine lokale HTML-Datei angeben, z.B. 'control.html', die muss dann im Ordner 'bin' liegen.
	title: 'Pip-Boy Home', 
	hideStatusbar: true,
	enableWireless: true,
	powerButtonClose: true,
	enablePreventScreenSaver: false,
	landscape: false
};
```

### Jetzt bist du dran!
Nachdem du dein Kindle erfolgreich jailbroken und KUAL sowie WebLaunch installiert hast, kannst du jetzt dein eigenes Smart Home Dashboard erstellen. Hier ist ein einfaches Beispiel, wie du eine HTML-Seite für dein Dashboard gestalten kannst:

```html
<!DOCTYPE html>
<html lang="de">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Smart Home Dashboard</title>
</head>
<body>
	<div class="dashboard">
		<h1>Willkommen zu deinem Smart Home Dashboard</h1>
		<button onclick="toggleLight1()">Licht An/Aus</button>
		<!-- Hier kannst du weitere Smart Home Steuerungselemente hinzufügen -->
	</div>
	<script>
		function toggleLight1() {
			// Hier kommt der Code zum Steuern deines Smart Home Lichts hin
			let xmlhttp = new XMLHttpRequest();
			// Beispiel für eine Shelly-API-Anfrage
			xmlhttp.open("GET", "http://192.168.178.***/light/0?turn=toggle", true);
			xmlhttp.send();
			// Denke daran, dass das Kindle JavaScript nur eingeschränkt unterstütz. Aktuelle Funktionen wie fetch fehlen.
		}
	</script>
</body>
</html>
```
So schaut mein Ergebnis aus:

<style>
     .containerimg img {
        width: 200px;
       min-height: 200px;
        margin: 0 10px;
    }
  .containerimg  .full {
        width: 95%;
        height: auto;
        margin: 0 10px;
    }
</style>
<div  class="containerimg" style="
    text-align: center;
    display: flex;
    overflow: scroll;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;">
<img class="full" src="/posts/another-magic-home-dashboard-with-kindle/images/image1.jpeg" alt="Foto vom Kindle">
<img  class="full" src="/posts/another-magic-home-dashboard-with-kindle/images/image2.jpeg" alt="Foto vom Kindle">
<img  class="full" src="/posts/another-magic-home-dashboard-with-kindle/images/image3.jpeg" alt="Foto vom Kindle">
</div>

## Fazit
Aus einem verstaubten E-Reader von 2011 ist ein funktionales Smart Home Dashboard geworden - und das mit überraschend wenig Aufwand. Das Kindle überzeugt durch seinen stromsparenden E-Ink-Bildschirm, die einfache Bedienung und die robuste Hardware.
Was als Experiment begann, läuft nun seit Monaten zuverlässig und steuert täglich Licht, Musik und andere Smart Home Geräte. Alte Hardware muss nicht im Schrank verstauben - manchmal braucht sie nur eine neue Aufgabe. Und falls doch mal die Apokalypse kommt, haben wir schon mal ein funktionierendes Terminal.


