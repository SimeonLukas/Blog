+++
title = "Useful Escape Room Technology: Rotary Phone as Input Device"
date = 2025-05-28 22:59:00+01:00
description = "In this article I describe how to use an old rotary phone as an input device for escape rooms. I explain the technical implementation, programming, and integration into an escape room concept. The article is aimed at technology enthusiasts and escape room aficionados."
[taxonomies]
tags = ["programmierung", "hardware", "arduino", "escape-room", "tutorial", "retro", "diy", "n8n", "esp8266"] 
[extra]
comment = true
+++
# The Genesis: When Nostalgia Meets Technology

As a small hobbyist, I'm constantly searching for creative solutions for my escape rooms in confirmation preparation. For three years now, I've been regularly building tricky puzzle courses for confirmation preparation in the Werdenfels-Rottenbuch deanery and love experimenting with unusual input devices.

The idea came to me when I discovered an old rotary phone in my father's basement. "That would be perfect for an escape room!", I thought to myself. Imagine: participants have to dial a secret number, and only when they enter the correct combination does the next puzzle stage open. Pure nostalgia meets modern technology!

## The Concept: Three Wires, Infinite Possibilities

### Hardware - Keep it simple! 
For this project you really don't need much:
- An old rotary phone (flea market, eBay, Kleinanzeigen, grandma's attic 😉)
- A WemosD1 Mini (ESP8266) - costs less than 5 euros
- Three simple jumper cables
- A suitable telephone socket (Telecommunications Connection Unit, also called TAE)

The brilliant part: You only need to connect three jumper cables to the telephone socket! No complicated soldering, no elaborate wiring. The ESP8266 reads the rotary pulses via the analog pin and interprets them as digits. You can see more details in the diagram below.

{% mermaid() %}
flowchart TD
    A[👤 Player rotates dial] --> B{📞 Rotary Phone}
    B --> C[⚡ Pulses via 3 wires]
    C --> D[🔧 WemosD1 Mini ESP8266]
    
    D --> E[📊 Analog Pin A0<br/>reads pulses]
    E --> F[🧮 Count pulses<br/>& debounce]
    F --> G[🔢 Recognize digit<br/>1 pulse = 1<br/>10 pulses = 0]
    
    G --> H[📝 Assemble complete<br/>number]
    H --> I{⏱️ Pause detected?<br/>3 seconds without input}
    
    I -->|No| G
    I -->|Yes| J[📡 Check WiFi connection]
    
    J --> K[🌐 HTTP GET Request<br/>to n8n Webhook]
    K --> L[🎯 n8n Workflow]
    
    L --> M[🔓 Escape Room Action]
    M --> N1[💡 Control Smart Home]
    M --> N2[📧 Send Email]  
    M --> N3[🔊 Play Sound]
    M --> N4[🚪 Open Lock]
    
    D --> B[📞 Rotary Phone & Buzzer for Feedback]
    B --> P1[📢 Pulse Beep]
    B --> P2[🎵 Digit Beep]
    B --> P3[✅ Success Melody]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style D fill:#fff3e0
    style L fill:#e8f5e8
    style M fill:#fff8e1

{% end %}

### Software - From Analog to Digital
The code is surprisingly simple. The rotary phone generates a specific number of pulses for each dialed digit:
- Digit 1 = 1 pulse
- Digit 2 = 2 pulses  
- ...
- Digit 0 = 10 pulses

The ESP8266 counts these pulses, recognizes pauses between digits, and assembles the complete dialed number from them. As soon as a complete number is recognized, it sends it to an n8n webhook via HTTP request.

```cpp
// Short code excerpt
// If we're counting a digit and there's a pause, interpret the digit
  if (countingDigit && (millis() - lastPulseTime > interDigitDelay)) {
    int dialedDigit = (pulseCount == 10) ? 0 : pulseCount;
    Serial.print("Dialed digit: ");
    Serial.println(dialedDigit);
    
    // Play a tone for the recognized digit
    playDigitBeep(dialedDigit);
    
    // Add the digit to the dialed number
    dialedNumber += String(dialedDigit);
    lastDigitTime = millis();
    
    // Reset for the next digit
    pulseCount = 0;
    countingDigit = false;
  }
```
<br>
<details>

  <summary>Complete Code</summary>

```cpp
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

// WiFi Configuration
const char* ssid = "MyWiFi";       // Change this to your WiFi name
const char* password = "**********"; // Change this to your WiFi password

// Webhook Configuration
const char* webhookUrl = "http://example.com/webhook";  // Change this to your webhook URL - must not be SSL as ESP8266 doesn't support SSL

// Configuration for the rotary phone
const int phonePin = A0;           // Analog pin for the rotary phone
const int threshold = 1000;        // Threshold value for pulse detection
const int debounceDelay = 20;      // Debounce time in milliseconds
const int interDigitDelay = 700;   // Time to wait before recognizing a new digit

// Buzzer / Sound Output
const int buzzerPin = D5;          // Pin for the buzzer or speaker
const int pulseBeepDuration = 50;  // Duration of beep tone in milliseconds
const int digitBeepDuration = 200; // Duration of beep tone for recognized digits
const int digitBeepFrequency = 1000; // Pitch for recognized digits

bool pulseState = false;           // Current pulse state
bool lastPulseState = false;       // Previous pulse state
int pulseCount = 0;                // Number of pulses (dial clicks)
unsigned long lastPulseTime = 0;   // Time of last pulse
bool countingDigit = false;        // Whether we're currently counting a digit

String dialedNumber = "";          // Stores the complete dialed number
unsigned long lastDigitTime = 0;   // Time of last recognized digit
const int completeNumberDelay = 3000; // Time after last digit before number is considered complete

// WiFi Management
unsigned long lastWifiCheckTime = 0;
const int wifiCheckInterval = 30000;  // Check WiFi every 30 seconds

void setup() {
  Serial.begin(9600);
  pinMode(phonePin, INPUT);
  pinMode(buzzerPin, OUTPUT);
  
  // Disable WiFi sleep mode for more stable connection
  WiFi.setSleepMode(WIFI_NONE_SLEEP);
  
  // Connect to WiFi with higher timeout value
  connectToWifi();
  
  Serial.println("Rotary phone reader started");
  Serial.println("-------------------------");
  
  // Startup sound
  playSuccessSound();
}

// Simple tone with specified frequency and duration
void playTone(int frequency, int duration) {
  // We use a simple on/off tone for ESP8266
  // Frequency is simulated by delay between switches
  long delayValue = 1000000 / frequency / 2;
  long numCycles = frequency * duration / 1000;
  
  for (long i = 0; i < numCycles; i++) {
    digitalWrite(buzzerPin, HIGH);
    delayMicroseconds(delayValue);
    digitalWrite(buzzerPin, LOW);
    delayMicroseconds(delayValue);
  }
}

// Short tone for detected pulses
void playPulseBeep() {
  digitalWrite(buzzerPin, HIGH);
  delay(pulseBeepDuration);
  digitalWrite(buzzerPin, LOW);
}

// Tone for recognized digit
void playDigitBeep(int digit) {
  // Play a tone with frequency proportional to digit
  int freq = digitBeepFrequency + (digit * 100); // Higher tone for higher digits
  playTone(freq, digitBeepDuration);
}

// Success melody for successful sending
void playSuccessSound() {
  playTone(1000, 100);
  delay(50);
  playTone(1500, 100);
  delay(50);
  playTone(2000, 200);
}

void connectToWifi() {
  Serial.print("Connecting to WiFi ");
  Serial.print(ssid);
  Serial.println("...");
  
  WiFi.mode(WIFI_STA);  // Explicitly set station mode
  WiFi.begin(ssid, password);
  
  // Set higher timeout value for connection (10 seconds)
  int timeout = 20;  // 10 second timeout
  while (WiFi.status() != WL_CONNECTED && timeout > 0) {
    delay(500);
    Serial.print(".");
    timeout--;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("");
    Serial.println("WiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    playSuccessSound(); // Tone for successful connection
  } else {
    Serial.println("");
    Serial.println("WiFi connection failed. Will try again later.");
    // Error tone for failed connection
    playTone(300, 500);
  }
}

void checkWifiConnection() {
  if (millis() - lastWifiCheckTime > wifiCheckInterval) {
    lastWifiCheckTime = millis();
    
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("WiFi connection lost. Trying to reconnect...");
      WiFi.disconnect();
      delay(1000);
      connectToWifi();
    } else {
      // Optional: Confirmation that WiFi is still connected
      // Serial.println("WiFi connection OK");
    }
  }
}

void loop() {
  // Regularly check WiFi connection
  checkWifiConnection();
  
  // Read input from rotary phone
  int sensorValue = analogRead(phonePin);
  
  // Determine pulse state (high or low)
  pulseState = (sensorValue < threshold);
  
  // Detection of falling edge (pulse start)
  if (pulseState && !lastPulseState) {
    // Debounce
    delay(debounceDelay);
    
    // Read again for confirmation
    sensorValue = analogRead(phonePin);
    if (sensorValue < threshold) {
      // Valid pulse detected
      countingDigit = true;
      pulseCount++;
      lastPulseTime = millis();
      
      Serial.print("Pulse detected! Count: ");
      Serial.println(pulseCount);
      
      // Generate short signal tone for each detected pulse
      playPulseBeep();
    }
  }
  
  // If we're counting a digit and there's a pause, interpret the digit
  if (countingDigit && (millis() - lastPulseTime > interDigitDelay)) {
    int dialedDigit = (pulseCount == 10) ? 0 : pulseCount;
    Serial.print("Dialed digit: ");
    Serial.println(dialedDigit);
    
    // Play a tone for the recognized digit
    playDigitBeep(dialedDigit);
    
    // Add the digit to the dialed number
    dialedNumber += String(dialedDigit);
    lastDigitTime = millis();
    
    // Reset for the next digit
    pulseCount = 0;
    countingDigit = false;
  }
  
  // Check if complete number was dialed (no new digit for X seconds)
  if (dialedNumber.length() > 0 && (millis() - lastDigitTime > completeNumberDelay)) {
    Serial.print("Complete dialed number: ");
    Serial.println(dialedNumber);
    
    // Send number to webhook
    sendNumberToWebhook(dialedNumber);
    
    // Reset for next number
    dialedNumber = "";
  }
  
  // Save current state for next comparison
  lastPulseState = pulseState;
  
  delay(1); // Small delay for stability
}

void sendNumberToWebhook(String number) {
  // Check WiFi connection
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    
    // Create URL with dialed number
    String url = String(webhookUrl) + "?number=" + number;
    
    Serial.print("Sending number to webhook: ");
    Serial.println(url);
    
    // Start HTTP connection with higher timeout
    http.begin(client, url);
    http.setTimeout(10000);  // 10 second timeout for HTTP connection
    
    // Send HTTP GET request
    int httpResponseCode = http.GET();
    
    if (httpResponseCode > 0) {
      Serial.print("HTTP response code: ");
      Serial.println(httpResponseCode);
      String payload = http.getString();
      Serial.println(payload);
      
      // Play success sound
      playSuccessSound();
    } else {
      Serial.print("Error in HTTP request. Error code: ");
      Serial.println(httpResponseCode);
      
      // Play error tone
      playTone(300, 500);
    }
    
    // End HTTP connection
    http.end();
  } else {
    Serial.println("WiFi not connected. Number will be cached and sent later.");
    // Play error tone
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
<img src="/posts/useful-escape-room-technology/images/drehscheibe00001.jpg" alt="Rotary Phone">
<img src="/posts/useful-escape-room-technology/images/drehscheibe00003.jpg" alt="TAE Socket">
<img src="/posts/useful-escape-room-technology/images/drehscheibe00004.jpg" alt="TAE Socket Connection">
<img src="/posts/useful-escape-room-technology/images/drehscheibe00002.jpg" alt="ESP8266">
</div>

## The Possibilities: More Than Just a Phone

Even though I haven't used the phone in one of my escape rooms yet, countless ideas are already swirling around in my head:

**🔐 Classic Safe Code:** Participants must dial a specific number to receive the next clue.

**📋 Contact List Puzzle:** "Call your grandfather!" - Players must first figure out which number to dial.

**🎵 Musical Codes:** Each digit plays a different tone - the correct melody opens the lock.

**⏰ Time Travel Scenarios:** Perfect for 70s/80s settings - it doesn't get more authentic!

**🔄 Sequence Puzzles:** Multiple numbers must be dialed in a specific order.

## The Webhook Magic: n8n Makes It Possible

The beautiful thing about this solution: Through n8n you can connect the dialed numbers with practically anything:
- Control smart home devices
- Send emails  
- Call other APIs
- Fill databases
- And much more!

A simple HTTP request is enough, and your entire escape room system reacts to the dialed number.

## Why You Should Try It Yourself

This project is perfect for tinkerers who like to play with technology.
You'll learn:
- **Reading Analog Signals** - How hardware and software work together
- **WiFi Communication** - Understanding webhooks and HTTP requests  
- **Debouncing and Timing** - Complicated but exciting programming concepts
- **Audio Feedback** - Improving user interaction

And the best part: Success is guaranteed! When the webhook is called for the first time after you dial a number, it's a magical moment.

## Let's Go! 💪

Got the urge to hack a rotary phone yourself? Perfect! Grab an old phone, order an ESP8266, and just get started. The code is simple, the hardware is manageable, and the possibilities are endless.

**Happy Hacking!**