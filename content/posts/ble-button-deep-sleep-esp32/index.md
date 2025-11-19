+++
title = "BLE-Button mit Deep Sleep: Wenn ein ESP32-S3 zum Foto-Auslöser wird"
date = 2025-11-19 12:00:00+01:00
description = "Ein stromsparender Bluetooth-Button für das Tourismus-Glücksrad - mit Deep Sleep, Bonding und monatelanger Batterielebensdauer. Von Fehlschlägen, Debugging-Sessions und dem finalen Durchbruch."

[taxonomies]
tags = ["ESP32", "BLE", "Deep Sleep", "Hardware", "IoT", "Tourismuspastoral"]

[extra]
comment = true
+++

## Die Ausgangslage: Ein Glücksrad braucht einen Button

Vor einiger Zeit habe ich für die Tourismuspastoral ein [digitales Glücksrad](@/posts/20241120/index.md) entwickelt. Bei Veranstaltungen drücken die Leute einen roten Button, der per USB verbunden ist, damit sich das Rad dreht. Und wenn sie auf dem richtigen Feld landen, soll ein Foto gemacht werden - für die Erinnerung, fürs Gästebuch, für Instagram. Doch nicht jedes Feld löst ein Foto aus. Deshalb brauchte ich eine einfache Möglichkeit, den Foto-Auslöser zu betätigen. 

Die Idee: Ein kabelloser Button, den die Besucher drücken können, um das Foto auszulösen. Simpel, oder?

**Spoiler**: War es nicht. Aber am Ende läuft's - und wie! 🎉

## Das Konzept: Drei Anforderungen

Ich hatte klare Vorstellungen, was der Button können sollte:

1. **Batteriebetrieben**: Keine Kabel bei Veranstaltungen, bitte!
2. **Zuverlässig**: Beim Drücken soll die Taste "2" gesendet werden (die löst in meinem Setup die Fotofunktion aus)
3. **Lange Laufzeit**: Ich will nicht ständig Batterien wechseln

Die Lösung: Ein **ESP32-S3** mit **BLE** (Bluetooth Low Energy), der sich als Tastatur ausgibt und im **Deep Sleep** auf Button-Drücke wartet.

## Hardware - Keep it simple!

Für dieses Projekt brauchst du wirklich nicht viel:

- ESP32-S3 Dev Module (~5-10 Euro)
- Ein Taster/Button (z.B. 100mm Arcade-Button)
- CR123A Batterie + Batteriehalter (siehe Einkaufsliste unten)
- Optional: Ein Gehäuse (3D-Druck, Projektbox, Aschenbecher vom Tedi, etc.)

**Das Setup:**
- Button an GPIO5 und GND
- Interne Pullup-Widerstände nutzen (keine externe Elektronik nötig!)
- Bei Button-Druck: Pin wird LOW → ESP wacht auf
```
┌─────────────┐
│   ESP32-S3  │
│             │
│  GPIO5 ◄────┼──── Button ──── GND
│             │
│  (Pullup    │
│   intern)   │
└─────────────┘
```

## Die Herausforderungen: Ein steiniger Weg zum Erfolg

### Problem #1: ESP ging nicht in Deep Sleep

**Symptom**: Der ESP wollte einfach nicht schlafen. Stromverbrauch blieb hoch, Battery Monitor zeigte 80-120mA statt der erwarteten ~10µA.

**Diagnose**: Beim ESP32-S3 verhindert die aktive USB-Serial-Verbindung den Deep Sleep! Außerdem war BLE noch nicht vollständig deaktiviert.

**Lösung**: 
```cpp
Serial.end();        // Serial beenden
USBSerial.end();     // ESP32-S3 spezifisch!
btStop();            // Bluetooth komplett stoppen
esp_deep_sleep_start();
```

### Problem #2: ESP wachte sofort wieder auf

Das war frustrierend: Der ESP ging schlafen... und 300ms später war er wieder wach. Endlos-Schleife!

**Ursache**: Der Button-Pin war beim Einschlafen noch LOW (gedrückt). Der ext0-Wakeup triggerte sofort, weil die Bedingung "wache auf bei LOW" schon erfüllt war.

**Lösung**: Warten bis der Button losgelassen wird!
```cpp
while(digitalRead(buttonPin) == LOW) {
  Serial.println("Button gedrückt - warte...");
  delay(100);
}
delay(500);  // Sicherheitspuffer
```

### Problem #3: RTC GPIO Konfiguration

Der ESP32-S3 hat eine Besonderheit: Für ext0-Wakeup muss man die **RTC GPIO** explizit konfigurieren. Ohne das funktioniert der Wakeup nicht zuverlässig.
```cpp
rtc_gpio_init((gpio_num_t)buttonPin);
rtc_gpio_set_direction((gpio_num_t)buttonPin, RTC_GPIO_MODE_INPUT_ONLY);
rtc_gpio_pullup_en((gpio_num_t)buttonPin);
rtc_gpio_hold_en((gpio_num_t)buttonPin);  // Config im Sleep halten!
```

Das `rtc_gpio_hold_en()` ist crucial - es sorgt dafür, dass die Pin-Konfiguration im Deep Sleep erhalten bleibt.

### Problem #4: "2" wurde nicht gesendet

Der ESP wachte auf, BLE startete... aber keine Taste wurde gesendet. Dann kam der Timeout und er ging wieder schlafen.

**Ursache**: BLE braucht 5-10 Sekunden zum Verbinden! Der ursprüngliche 10-Sekunden-Timer lief aber schon beim Aufwachen los.

**Lösung**: Timer wird **nach** erfolgreichem Senden zurückgesetzt:
```cpp
if(bleKeyboard.isConnected()) {
  bleKeyboard.print("2");
  startTime = millis();  // JETZT Timer neu starten!
  Serial.println("Timer neu gestartet - 10 Sekunden wach");
}
```

### Problem #5: Verbindung brach ständig ab

Nach jedem Deep Sleep musste das Gerät neu gepairt werden. Nervig!

**Ursache**: Keine Bonding-Informationen wurden gespeichert. Der Computer sah nach jedem Aufwachen ein "neues" Gerät.

**Lösung**: BLE Security mit Bonding aktivieren:
```cpp
esp_ble_auth_req_t auth_req = ESP_LE_AUTH_REQ_SC_MITM_BOND;
esp_ble_gap_set_security_param(ESP_BLE_SM_AUTHEN_REQ_MODE, &auth_req, sizeof(uint8_t));
// ... weitere Security-Parameter
```

Und eine **feste MAC-Adresse** im Flash speichern:
```cpp
void setCustomMacAddress() {
  preferences.begin("ble-button", false);
  
  if (!preferences.getBool("mac_set", false)) {
    // Beim ersten Start: Zufällige MAC generieren
    uint8_t newMac[6];
    esp_fill_random(newMac, 6);
    newMac[0] = (newMac[0] & 0xFE) | 0x02;  // Locally administered
    preferences.putBytes("mac_addr", newMac, 6);
    preferences.putBool("mac_set", true);
  }
  
  uint8_t customMac[6];
  preferences.getBytes("mac_addr", customMac, 6);
  esp_base_mac_addr_set(customMac);
}
```

## Der Code: Kompakt und durchdacht

Hier ist der finale, funktionierende Code:
```cpp
#include <BleKeyboard.h>
#include <Preferences.h>
#include "driver/rtc_io.h"
#include "esp_bt_device.h"
#include "esp_gap_ble_api.h"

BleKeyboard bleKeyboard("Blauer Button", "Espressif", 100);
Preferences preferences;

const int buttonPin = 5;
const unsigned long awakeTime = 10000;      // 10 Sekunden wach
const unsigned long bleTimeout = 15000;     // 15 Sekunden für BLE
bool lastButtonState = HIGH;
unsigned long startTime;
bool alreadySentOnWake = false;

void setCustomMacAddress() {
  preferences.begin("ble-button", false);
  
  bool macExists = preferences.getBool("mac_set", false);
  
  if (!macExists) {
    Serial.println(">>> Erster Start - generiere neue MAC...");
    uint8_t newMac[6];
    esp_fill_random(newMac, 6);
    newMac[0] = (newMac[0] & 0xFE) | 0x02;
    preferences.putBytes("mac_addr", newMac, 6);
    preferences.putBool("mac_set", true);
  }
  
  uint8_t customMac[6];
  preferences.getBytes("mac_addr", customMac, 6);
  preferences.end();
  
  esp_base_mac_addr_set(customMac);
}

void setupBLESecurity() {
  esp_ble_auth_req_t auth_req = ESP_LE_AUTH_REQ_SC_MITM_BOND;
  esp_ble_io_cap_t iocap = ESP_IO_CAP_NONE;
  uint8_t key_size = 16;
  uint8_t init_key = ESP_BLE_ENC_KEY_MASK | ESP_BLE_ID_KEY_MASK;
  uint8_t rsp_key = ESP_BLE_ENC_KEY_MASK | ESP_BLE_ID_KEY_MASK;
  
  esp_ble_gap_set_security_param(ESP_BLE_SM_AUTHEN_REQ_MODE, &auth_req, sizeof(uint8_t));
  esp_ble_gap_set_security_param(ESP_BLE_SM_IOCAP_MODE, &iocap, sizeof(uint8_t));
  esp_ble_gap_set_security_param(ESP_BLE_SM_MAX_KEY_SIZE, &key_size, sizeof(uint8_t));
  esp_ble_gap_set_security_param(ESP_BLE_SM_SET_INIT_KEY, &init_key, sizeof(uint8_t));
  esp_ble_gap_set_security_param(ESP_BLE_SM_SET_RSP_KEY, &rsp_key, sizeof(uint8_t));
  
  Serial.println(">>> BLE Security aktiviert");
}

void goToSleep() {
  Serial.println("\n>>> Bereite Deep Sleep vor...");
  
  // Warte bis Button losgelassen
  while(digitalRead(buttonPin) == LOW) {
    delay(100);
  }
  delay(500);
  
  // BLE sauber beenden
  bleKeyboard.end();
  delay(500);
  btStop();
  delay(200);
  
  // RTC GPIO konfigurieren
  rtc_gpio_init((gpio_num_t)buttonPin);
  rtc_gpio_set_direction((gpio_num_t)buttonPin, RTC_GPIO_MODE_INPUT_ONLY);
  rtc_gpio_pullup_en((gpio_num_t)buttonPin);
  rtc_gpio_pulldown_dis((gpio_num_t)buttonPin);
  rtc_gpio_hold_en((gpio_num_t)buttonPin);
  
  esp_sleep_enable_ext0_wakeup((gpio_num_t)buttonPin, 0);
  
  Serial.println(">>> Gehe schlafen...");
  Serial.flush();
  Serial.end();
  USBSerial.end();
  delay(100);
  
  esp_deep_sleep_start();
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  rtc_gpio_deinit((gpio_num_t)buttonPin);
  rtc_gpio_hold_dis((gpio_num_t)buttonPin);
  
  pinMode(buttonPin, INPUT_PULLUP);
  
  Serial.println("\n=== AUFGEWACHT! ===");
  
  setCustomMacAddress();
  bleKeyboard.begin();
  setupBLESecurity();
  
  Serial.println("BLE gestartet - warte auf Verbindung...");
  startTime = millis();
}

void loop() {
  // Warte auf BLE und sende dann
  if(!alreadySentOnWake) {
    if(bleKeyboard.isConnected()) {
      Serial.println(">>> BLE VERBUNDEN! Sende '2'...");
      delay(500);
      bleKeyboard.print("2");
      delay(300);
      Serial.println(">>> '2' gesendet!");
      alreadySentOnWake = true;
      startTime = millis();  // Timer zurücksetzen
    } else {
      if(millis() - startTime > bleTimeout) {
        Serial.println(">>> Timeout - schlafen ohne Senden");
        goToSleep();
      }
    }
  }
  
  // Nach Senden: 10 Sekunden wach
  if(alreadySentOnWake && millis() - startTime >= awakeTime) {
    Serial.println("\n>>> Timeout!");
    goToSleep();
  }
  
  // Button während Wachzeit
  bool buttonState = digitalRead(buttonPin);
  if(buttonState == LOW && lastButtonState == HIGH) {
    if(bleKeyboard.isConnected()) {
      Serial.println("Button: Sende '2'");
      bleKeyboard.print("2");
      delay(300);
      startTime = millis();  // Timer zurücksetzen
    }
    delay(50);
  }
  lastButtonState = buttonState;
  
  delay(10);
}
```

## Wie es funktioniert: Der Ablauf
```
┌─────────────────────────────┐
│   DEEP SLEEP (~10µA)        │
│   CPU: OFF                  │
│   RAM: OFF                  │
│   BLE: OFF                  │
│   RTC: ON (wartet)          │
└─────────────────────────────┘
            │
            │ [Button gedrückt!]
            ▼
┌─────────────────────────────┐
│   WAKEUP (~300ms)           │
│   - CPU startet             │
│   - setup() läuft           │
│   - MAC laden               │
│   - BLE starten             │
└─────────────────────────────┘
            │
            │ [BLE Verbindung]
            ▼
┌─────────────────────────────┐
│   VERBINDUNG (2-10 Sek)     │
│   - Bonding-Keys prüfen     │
│   - Sichere Verbindung      │
└─────────────────────────────┘
            │
            │ [isConnected()]
            ▼
┌─────────────────────────────┐
│   TASTE SENDEN              │
│   bleKeyboard.print("2")    │
│   Timer zurücksetzen        │
└─────────────────────────────┘
            │
            │ [10 Sekunden warten]
            ▼
┌─────────────────────────────┐
│   ZURÜCK IN SLEEP           │
│   - BLE trennen             │
│   - RTC GPIO config         │
│   - esp_deep_sleep_start()  │
└─────────────────────────────┘
```

## Stromversorgung mit CR123A Batterie

Für den mobilen Einsatz habe ich mich für eine **CR123A Batterie** entschieden - eine geniale Lösung für dieses Projekt!

### Warum CR123A?

- **Hohe Kapazität**: 1.500-1.700mAh bei 3V
- **Kompakte Bauform**: Perfekt für portable Geräte
- **Lange Haltbarkeit**: Bis zu 10 Jahre Lagerfähigkeit
- **Stabile Spannung**: 3V passt perfekt zum ESP32 (2,3V-3,6V toleriert)
- **Überall verfügbar**: In jedem Elektronik- oder Fotogeschäft

### Anschluss

Der ESP32-S3 kann direkt mit 3V betrieben werden:
- CR123A Batterie: Plus (+) an 3V3-Pin
- CR123A Batterie: Minus (-) an GND
- Batteriehalter mit Schalter empfohlen

**Achtung**: Bei USB-Betrieb den 3V3-Pin nicht nutzen, sondern über USB versorgen! Beim Flashen die Batterie trennen oder einen Batteriehalter mit Schalter verwenden.

## Stromverbrauch: Die Zahlen

| Zustand | Verbrauch | Dauer |
|---------|-----------|-------|
| Deep Sleep | ~10-150µA | 99% der Zeit |
| Wakeup + BLE | ~80-120mA | 2-10 Sekunden |
| Connected | ~40-80mA | 10 Sekunden |
| Senden | ~100-150mA | <1 Sekunde |

**Mit CR123A (1.600mAh)**: Theoretisch **Monate bis Jahre** Laufzeit, abhängig von der Häufigkeit der Button-Drücke.

Bei 10 Foto-Auslösungen pro Tag:
- 10 × 15 Sekunden wach = 150 Sekunden = 2,5 Minuten
- Verbrauch während Wachzeit: ~80mA × 2,5min = ~3,3mAh pro Tag
- Deep Sleep restliche Zeit: ~23,96h × 0,1mA = ~2,4mAh pro Tag
- **Gesamt: ~5,7mAh pro Tag**
- **Laufzeit mit CR123A: ca. 280 Tage (9+ Monate)!**

Mit der CR123A Batterie hält der Button also fast ein Jahr durch - perfekt für Events und Veranstaltungen!

## Die wichtigsten Erkenntnisse

### 1. ESP32-S3 ist anders
Der S3 braucht explizite RTC GPIO-Konfiguration und das Beenden von USBSerial. Die "normalen" ESP32-Beispiele funktionieren oft nicht 1:1.

### 2. Deep Sleep ist pingelig
Der Pin-Status beim Einschlafen ist entscheidend. Immer warten bis der Button wirklich losgelassen ist!

### 3. BLE braucht Zeit
5-10 Sekunden für eine Verbindung sind normal. Plant euren Timeout entsprechend.

### 4. Bonding ist Gold wert
Mit Bonding verbindet sich das Gerät nach jedem Aufwachen automatisch wieder. Ohne Bonding muss man jedes Mal neu pairen.

### 5. Feste MAC = Happy Life
Ohne feste MAC sieht der Computer nach jedem Sleep ein "neues" Gerät. Die MAC im Flash speichern löst das Problem elegant.

## Warum du es selbst ausprobieren solltest

Dieses Projekt ist perfekt zum Lernen:

- **Analoge Hardware trifft digitale Logik**: RTC GPIO, Pullups, Wakeup-Quellen
- **Power Management**: Deep Sleep, Stromverbrauch optimieren
- **BLE verstehen**: Bonding, Security, Pairing
- **Persistente Daten**: Preferences Library für Flash-Speicher
- **Debugging**: Serial Monitor, Logik-Analyse, Trial & Error

Und das Beste: Am Ende hast du ein **praktisches Gerät**, das wirklich nützlich ist!

## Einsatz beim Glücksrad

Der Button wird beim Tourismus-Glücksrad eingesetzt: Besucher drücken den Button, die Taste "2" wird gesendet, das Javascript auf dem Raspberry Pi löst die Fotofunktion aus. Simpel, zuverlässig, keine Kabel.

Die Besucher lieben es - besonders die haptische Komponente. Ein echter Button fühlt sich einfach besser an als "Drück mal auf den Bildschirm".

<style>
   .containerimg   img {
        width: 200px;
       min-height: 200px;
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
<img onclick="location.href='/posts/ble-button-deep-sleep-esp32/images/image00001.jpg'" src="/posts/ble-button-deep-sleep-esp32/images/image00001.jpg" alt="Blauer Button">
<img onclick="location.href='/posts/ble-button-deep-sleep-esp32/images/image00002.jpg'" src="/posts/ble-button-deep-sleep-esp32/images/image00002.jpg" alt="Blauer Button">
<img onclick="location.href='/posts/ble-button-deep-sleep-esp32/images/image00003.jpg'" src="/posts/ble-button-deep-sleep-esp32/images/image00003.jpg" alt="Blauer Button">
<img onclick="location.href='/posts/ble-button-deep-sleep-esp32/images/image00004.jpg'" src="/posts/ble-button-deep-sleep-esp32/images/image00004.jpg" alt="Blauer Button">
<img onclick="location.href='/posts/ble-button-deep-sleep-esp32/images/image00005.jpg'" src="/posts/ble-button-deep-sleep-esp32/images/image00005.jpg" alt="Blauer Button">
</div>

## Ausblick: Was noch möglich wäre

Mit diesem Setup könnte man noch viel mehr machen:

- **LED-Feedback**: Kurzes Blinken bei erfolgreicher Übertragung
- **Battery Monitoring**: Batteriespannung messen und warnen
- **Multi-Button**: Verschiedene Tasten je nach Druck-Dauer
- **OTA Updates**: Firmware über BLE aktualisieren
- **Bewegungssensor**: Zusätzlicher Wakeup per Accelerometer

## Los geht's!

Du hast Lust bekommen, selbst einen BLE-Button zu bauen? Perfekt! Besorg dir einen ESP32-S3, einen Taster und leg los. Der Code ist da, die Erklärungen auch.

Und wenn du Fragen hast oder dein Projekt teilen möchtest - melde dich gerne!

**Happy Hacking!**

## Einkaufsliste - Alles was du brauchst

Hier findest du alle Komponenten, die du für dieses Projekt benötigst. Die Links führen zu Amazon und sind Affiliate-Links, wo du die Teile direkt bestellen kannst:

### Hauptkomponenten

**ESP32-S3 Development Board**
- [ESP32-S3 DevKit (2er Set)](https://amzn.eu/d/0T1NcSH/?tag=simeonstaneks-21)
- Empfehlung: Das 2er-Set ist günstiger pro Board und du hast Ersatz für weitere Projekte

**100mm Arcade Button**
- [LED Arcade Button 100mm (verschiedene Farben)](https://amzn.eu/d/6UCftt8/?tag=simeonstaneks-21)
- Große, gut fühlbare Taste - perfekt für Events
- Alternative: [Standard Arcade Button 60mm](https://amzn.eu/d/j9O9DTu/?tag=simeonstaneks-21)

### Stromversorgung

**CR123A Batterien**
- [Varta CR123A Lithium Batterien (2er Pack)](https://amzn.eu/d/ejrz6xh/?tag=simeonstaneks-21)
- Hochwertige Markenbatterien mit langer Lebensdauer

**Batteriehalter für CR123A**
- [CR123A Batteriehalter mit Anschlusskabel](https://amzn.eu/d/abbsqNz/?tag=simeonstaneks-21)
- Mit Schalter zum einfachen Ein/Ausschalten
- Alternative: [CR123A Halter ohne Schalter (günstiger)](https://www.amazon.de/dp/B07VPVCKC4/?tag=simeonstaneks-21)

### Optional aber nützlich

**USB-C Kabel zum Flashen**
- [USB-C Datenkabel](https://amzn.eu/d/j8toLfn/?tag=simeonstaneks-21)
- Wichtig: Datenkabel verwenden, nicht nur Ladekabel!

**Jumper Kabel**
- [Dupont Jumper Kabel Set](https://www.amazon.de/dp/B07K8PVKBP/?tag=simeonstaneks-21)
- Zum einfachen Verbinden während des Prototypings

### Geschätzte Gesamtkosten

- **Minimal-Setup**: ~25-30 Euro (ESP32, Button, Batterie + Halter)

Viel Spaß beim Nachbauen! 🛠️

*Verwendete Hardware:*
- ESP32-S3 Dev Module
- 100mm Arcade Button
- CR123A Batterie + Batteriehalter
- Optional: Gehäuse

*Benötigte Libraries:*
- [ESP32-BLE-Keyboard](https://github.com/T-vK/ESP32-BLE-Keyboard)
- Preferences (ESP32 Core)
- driver/rtc_io.h (ESP32 Core)

*Board Manager für ESP32:*
- Version 2.0.17 !!!

*Stromversorgung:*
- Für Entwicklung/Flashen: USB-C Kabel
- Für Produktivbetrieb: CR123A Batterie mit Batteriehalter (siehe Einkaufsliste)