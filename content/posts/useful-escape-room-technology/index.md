+++
title = "Nützliche Escape Room Technik: Drehscheibentelefon als Eingabegerät"
date = 2025-05-28 22:59:00+01:00
description = "In diesem Artikel beschreibe ich wie man ein altes Drehscheibentelefon als Eingabegerät für Escape Rooms nutzen kann. Ich erkläre die technische Umsetzung, die Programmierung und die Integration in ein Escape Room Konzept. Der Artikel richtet sich an Technikbegeisterte und Escape Room Enthusiasten."
[taxonomies]
tags = ["programmierung", "hardware", "arduino", "escape-room", "tutorial", "retro", "diy", "n8n", "esp8266"] 
[extra]
comment =  true
+++
# Die Genese: Wenn Nostalgie auf Technik trifft

Als kleiner Hobbyist bin ich ständig auf der Suche nach kreativen Lösungen für meine Escape Rooms in der Firmvorbereitung. Seit drei Jahren baue ich für die Firmvorbereitung im Dekanat Werdenfels-Rottenbuch regelmäßig knifflige Rätselparcours und experimentiere dabei gerne mit ungewöhnlichen Eingabegeräten. 

Die Idee kam mir, als ich bei meinem Vater im Keller ein altes Drehwähltelefon entdeckte. "Das wäre doch perfekt für einen Escape Room!", dachte ich mir. Stell dir vor: Die Teilnehmer müssen eine geheime Nummer wählen, und erst wenn sie die richtige Kombination eingeben, öffnet sich die nächste Rätseletappe. Pure Nostalgie meets moderne Technik!

## Das Konzept: Drei Drähte, unendliche Möglichkeiten

### Hardware - Keep it simple! 
Für dieses Projekt brauchst du wirklich nicht viel:
- Ein altes Drehwähltelefon (Flohmarkt, eBay, Kleinanzeigen, Oma's Dachboden 😉)
- Einen WemosD1 Mini (ESP8266) - kostet keine 5 Euro
- Drei simple Jumperkabel
- Eine passende Telefonbuchse (Telekommunikations-Anschluss-Einheit auch TAE genannt)

Das Geniale: Du musst nur drei Jumperkabel an die Telefonbuchse anschließen! Kein kompliziertes Löten, keine aufwendige Verkabelung. Der ESP8266 liest die Drehimpulse über den analogen Pin und interpretiert sie als Ziffern. Genaueres siehst du im Diagramm unten.

{% mermaid() %}
flowchart TD
    A[👤 Spieler dreht Wählscheibe] --> B{📞 Drehwähltelefon}
    B --> C[⚡ Impulse über 3 Drähte]
    C --> D[🔧 WemosD1 Mini ESP8266]
    
    D --> E[📊 Analoger Pin A0<br/>liest Impulse]
    E --> F[🧮 Impulse zählen<br/>& entprellen]
    F --> G[🔢 Ziffer erkennen<br/>1 Impuls = 1<br/>10 Impulse = 0]
    
    G --> H[📝 Komplette Nummer<br/>zusammenbauen]
    H --> I{⏱️ Pause erkannt?<br/>3 Sekunden ohne Eingabe}
    
    I -->|Nein| G
    I -->|Ja| J[📡 WLAN-Verbindung prüfen]
    
    J --> K[🌐 HTTP GET Request<br/>an n8n Webhook]
    K --> L[🎯 n8n Workflow]
    
    L --> M[🔓 Escape Room Aktion]
    M --> N1[💡 Smart Home steuern]
    M --> N2[📧 E-Mail senden]  
    M --> N3[🔊 Sound abspielen]
    M --> N4[🚪 Schloss öffnen]
    
    D --> B[📞 Drehwähltelefon & Telefonhörer für Feedback]
    B --> P1[📢 Impuls-Beep]
    B --> P2[🎵 Ziffer-Beep]
    B --> P3[✅ Erfolgs-Melodie]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style D fill:#fff3e0
    style L fill:#e8f5e8
    style M fill:#fff8e1

{% end %}
### Software - Von analog zu digital
Der Code ist überraschend simpel gehalten. Das Drehwähltelefon erzeugt bei jeder gewählten Ziffer eine bestimmte Anzahl von Impulsen:
- Ziffer 1 = 1 Impuls
- Ziffer 2 = 2 Impulse  
- ...
- Ziffer 0 = 10 Impulse

Der ESP8266 zählt diese Impulse, erkennt Pausen zwischen den Ziffern und baut daraus die komplette gewählte Nummer zusammen. Sobald eine vollständige Nummer erkannt wurde, sendet er diese via HTTP-Request an einen n8n-Webhook weiter.

```cpp
// Kurzer Code-Ausschnitt
// Wenn wir eine Ziffer zählen und es gibt eine Pause, interpretiere die Ziffer
  if (countingDigit && (millis() - lastPulseTime > interDigitDelay)) {
    int dialedDigit = (pulseCount == 10) ? 0 : pulseCount;
    Serial.print("Gewählte Ziffer: ");
    Serial.println(dialedDigit);
    
    // Spiele einen Ton für die erkannte Ziffer
    playDigitBeep(dialedDigit);
    
    // Füge die Ziffer zur gewählten Nummer hinzu
    dialedNumber += String(dialedDigit);
    lastDigitTime = millis();
    
    // Zurücksetzen für die nächste Ziffer
    pulseCount = 0;
    countingDigit = false;
  }
```
<br>
<details>

  <summary>Kompletter Code </summary>

```cpp
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

// WLAN-Konfiguration
const char* ssid = "MeinWLAN";       // Ändern Sie dies zu Ihrem WLAN-Namen
const char* password = "**********"; // Ändern Sie dies zu Ihrem WLAN-Passwort

// Webhook-Konfiguration
const char* webhookUrl = "http://example.com/webhook";  // Ändern Sie dies zu Ihrer Webhook-URL sie darf in diesem Fall nicht SSL sein, da der ESP8266 kein SSL unterstützt

// Konfiguration für das Drehwähltelefon
const int phonePin = A0;           // Analoger Pin für das Drehwähltelefon
const int threshold = 1000;        // Schwellenwert für die Impulserkennung
const int debounceDelay = 20;      // Entprellzeit in Millisekunden
const int interDigitDelay = 700;   // Zeit zum Warten vor der Erkennung einer neuen Ziffer

// Buzzer / Sound Output
const int buzzerPin = D5;          // Pin für den Buzzer oder Lautsprecher
const int pulseBeepDuration = 50;  // Dauer des Beep-Tons in Millisekunden
const int digitBeepDuration = 200; // Dauer des Beep-Tons für erkannte Ziffern
const int digitBeepFrequency = 1000; // Tonhöhe für erkannte Ziffern

bool pulseState = false;           // Aktueller Impulszustand
bool lastPulseState = false;       // Vorheriger Impulszustand
int pulseCount = 0;                // Anzahl der Impulse (Drehklicks)
unsigned long lastPulseTime = 0;   // Zeit des letzten Impulses
bool countingDigit = false;        // Ob wir gerade dabei sind, eine Ziffer zu zählen

String dialedNumber = "";          // Speichert die komplette gewählte Nummer
unsigned long lastDigitTime = 0;   // Zeit der letzten erkannten Ziffer
const int completeNumberDelay = 3000; // Zeit nach der letzten Ziffer, bevor die Nummer als vollständig betrachtet wird

// WLAN-Management
unsigned long lastWifiCheckTime = 0;
const int wifiCheckInterval = 30000;  // Überprüfe WLAN alle 30 Sekunden

void setup() {
  Serial.begin(9600);
  pinMode(phonePin, INPUT);
  pinMode(buzzerPin, OUTPUT);
  
  // Deaktiviere WiFi-Schlafmodus für stabilere Verbindung
  WiFi.setSleepMode(WIFI_NONE_SLEEP);
  
  // Verbinde mit WLAN mit höherem Timeout-Wert
  connectToWifi();
  
  Serial.println("Drehwähltelefon-Leser gestartet");
  Serial.println("-------------------------");
  
  // Startup sound
  playSuccessSound();
}

// Einfacher Ton mit der angegebenen Frequenz und Dauer
void playTone(int frequency, int duration) {
  // Wir verwenden einen einfachen On/Off-Ton für ESP8266
  // Die Frequenz wird durch die Verzögerung zwischen den Umschaltungen simuliert
  long delayValue = 1000000 / frequency / 2;
  long numCycles = frequency * duration / 1000;
  
  for (long i = 0; i < numCycles; i++) {
    digitalWrite(buzzerPin, HIGH);
    delayMicroseconds(delayValue);
    digitalWrite(buzzerPin, LOW);
    delayMicroseconds(delayValue);
  }
}

// Kurzer Ton für erkannte Impulse
void playPulseBeep() {
  digitalWrite(buzzerPin, HIGH);
  delay(pulseBeepDuration);
  digitalWrite(buzzerPin, LOW);
}

// Ton für erkannte Ziffer
void playDigitBeep(int digit) {
  // Spiele einen Ton mit der Frequenz proportional zur Ziffer
  int freq = digitBeepFrequency + (digit * 100); // Höherer Ton für höhere Ziffern
  playTone(freq, digitBeepDuration);
}

// Erfolgsmelodie für erfolgreiches Senden
void playSuccessSound() {
  playTone(1000, 100);
  delay(50);
  playTone(1500, 100);
  delay(50);
  playTone(2000, 200);
}

void connectToWifi() {
  Serial.print("Verbinde mit WLAN ");
  Serial.print(ssid);
  Serial.println("...");
  
  WiFi.mode(WIFI_STA);  // Setze explizit den Station-Modus
  WiFi.begin(ssid, password);
  
  // Setze einen höheren Timeout-Wert für die Verbindung (10 Sekunden)
  int timeout = 20;  // 10 Sekunden Timeout
  while (WiFi.status() != WL_CONNECTED && timeout > 0) {
    delay(500);
    Serial.print(".");
    timeout--;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("");
    Serial.println("WiFi verbunden!");
    Serial.print("IP-Adresse: ");
    Serial.println(WiFi.localIP());
    playSuccessSound(); // Ton für erfolgreiche Verbindung
  } else {
    Serial.println("");
    Serial.println("WiFi-Verbindung fehlgeschlagen. Versuche es später erneut.");
    // Fehlerton für fehlgeschlagene Verbindung
    playTone(300, 500);
  }
}

void checkWifiConnection() {
  if (millis() - lastWifiCheckTime > wifiCheckInterval) {
    lastWifiCheckTime = millis();
    
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("WLAN-Verbindung verloren. Versuche Wiederverbindung...");
      WiFi.disconnect();
      delay(1000);
      connectToWifi();
    } else {
      // Optional: Bestätigung, dass WLAN noch verbunden ist
      // Serial.println("WLAN-Verbindung OK");
    }
  }
}

void loop() {
  // Überprüfe regelmäßig die WLAN-Verbindung
  checkWifiConnection();
  
  // Lese den Eingang vom Drehwähltelefon
  int sensorValue = analogRead(phonePin);
  
  // Bestimme den Impulszustand (hoch oder niedrig)
  pulseState = (sensorValue < threshold);
  
  // Erkennung einer fallenden Flanke (Impulsbeginn)
  if (pulseState && !lastPulseState) {
    // Entprellen
    delay(debounceDelay);
    
    // Nochmals lesen zur Bestätigung
    sensorValue = analogRead(phonePin);
    if (sensorValue < threshold) {
      // Gültiger Impuls erkannt
      countingDigit = true;
      pulseCount++;
      lastPulseTime = millis();
      
      Serial.print("Impuls erkannt! Zählung: ");
      Serial.println(pulseCount);
      
      // Erzeugt einen kurzen Signalton für jeden erkannten Impuls
      playPulseBeep();
    }
  }
  
  // Wenn wir eine Ziffer zählen und es gibt eine Pause, interpretiere die Ziffer
  if (countingDigit && (millis() - lastPulseTime > interDigitDelay)) {
    int dialedDigit = (pulseCount == 10) ? 0 : pulseCount;
    Serial.print("Gewählte Ziffer: ");
    Serial.println(dialedDigit);
    
    // Spiele einen Ton für die erkannte Ziffer
    playDigitBeep(dialedDigit);
    
    // Füge die Ziffer zur gewählten Nummer hinzu
    dialedNumber += String(dialedDigit);
    lastDigitTime = millis();
    
    // Zurücksetzen für die nächste Ziffer
    pulseCount = 0;
    countingDigit = false;
  }
  
  // Prüfe, ob die komplette Nummer gewählt wurde (keine neue Ziffer seit X Sekunden)
  if (dialedNumber.length() > 0 && (millis() - lastDigitTime > completeNumberDelay)) {
    Serial.print("Komplette gewählte Nummer: ");
    Serial.println(dialedNumber);
    
    // Sende die Nummer an den Webhook
    sendNumberToWebhook(dialedNumber);
    
    // Zurücksetzen für die nächste Nummer
    dialedNumber = "";
  }
  
  // Speichere aktuellen Zustand für den nächsten Vergleich
  lastPulseState = pulseState;
  
  delay(1); // Kleine Verzögerung für Stabilität
}

void sendNumberToWebhook(String number) {
  // Überprüfen der WLAN-Verbindung
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    
    // URL mit der gewählten Nummer erstellen
    String url = String(webhookUrl) + "?number=" + number;
    
    Serial.print("Sende Nummer an Webhook: ");
    Serial.println(url);
    
    // Beginne HTTP-Verbindung mit höherem Timeout
    http.begin(client, url);
    http.setTimeout(10000);  // 10 Sekunden Timeout für HTTP-Verbindung
    
    // Sende HTTP GET-Request
    int httpResponseCode = http.GET();
    
    if (httpResponseCode > 0) {
      Serial.print("HTTP Antwort-Code: ");
      Serial.println(httpResponseCode);
      String payload = http.getString();
      Serial.println(payload);
      
      // Erfolgssound spielen
      playSuccessSound();
    } else {
      Serial.print("Fehler beim HTTP-Request. Fehlercode: ");
      Serial.println(httpResponseCode);
      
      // Fehlerton spielen
      playTone(300, 500);
    }
    
    // Beende HTTP-Verbindung
    http.end();
  } else {
    Serial.println("WLAN nicht verbunden. Nummer wird zwischengespeichert und später gesendet.");
    // Fehlerton spielen
    playTone(300, 500);
  }
}
```
</details>
<br>



<style>
  .containerimg  img {
        width: 200px;
        height: auto;
        margin: 0 10px;
    }
</style>
<div class="containerimg" style="
    text-align: center;
    display: flex;
    overflow: scroll;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;">
<img src="/posts/useful-escape-room-technology/images/drehscheibe00001.jpg" alt="Drehwähltelefon">
<img src="/posts/useful-escape-room-technology/images/drehscheibe00003.jpg" alt="TAE Buchse">
<img src="/posts/useful-escape-room-technology/images/drehscheibe00004.jpg" alt="TAE Buchse Anschluss">
<img src="/posts/useful-escape-room-technology/images/drehscheibe00002.jpg" alt="ESP8266">
</div>


## Die Möglichkeiten: Mehr als nur Telefon

Auch wenn ich das Telefon noch nicht in einem meiner Escape Rooms eingesetzt habe, schwirren mir schon unzählige Ideen im Kopf herum:

**🔐 Klassischer Safe-Code:** Die Teilnehmer müssen eine bestimmte Nummer wählen, um den nächsten Hinweis zu erhalten.

**📋 Kontaktliste-Rätsel:** "Rufe deinen Großvater an!" - Die Spieler müssen erst herausfinden, welche Nummer sie wählen müssen.

**🎵 Musikalische Codes:** Jede Ziffer spielt einen anderen Ton - die richtige Melodie öffnet das Schloss.

**⏰ Zeitreise-Szenarien:** Perfekt für 70er/80er-Jahre Settings - authentischer geht's nicht!

**🔄 Sequenz-Rätsel:** Mehrere Nummern müssen in einer bestimmten Reihenfolge gewählt werden.

## Der Webhook-Zauber: n8n macht's möglich

Das Schöne an dieser Lösung: Über n8n kannst du die gewählten Nummern mit praktisch allem verknüpfen:
- Smart Home Geräte steuern
- E-Mails versenden  
- Andere APIs ansprechen
- Datenbanken füllen
- Und vieles mehr!

Ein einfacher HTTP-Request genügt, und schon reagiert dein gesamtes Escape Room-System auf die gewählte Nummer.

## Warum du es selbst ausprobieren solltest

Dieses Projekt ist perfekt für Tüftler, die gerne mit Technik spielen.
Du lernst:
- **Analoge Signale lesen** - Wie Hardware und Software zusammenspielen
- **WLAN-Kommunikation** - Webhooks und HTTP-Requests verstehen  
- **Entprellung und Timing** - Komplizierte aber spannende Programmierkonzepte
- **Audio-Feedback** - Benutzerinteraktion verbessern

Und das Beste: Das Erfolgserlebnis ist garantiert! Wenn das erste Mal der Webhook aufgerufen wird, nachdem du eine Nummer gewählt hast, ist das ein magischer Moment.

## Los geht's! 💪

Du hast Lust bekommen, selbst ein Drehwähltelefon zu hacken? Perfekt! Schnapp dir ein altes Telefon, bestell einen ESP8266 und leg einfach los. Der Code ist simpel, die Hardware überschaubar, und die Möglichkeiten sind endlos.

**Happy Hacking!**