+++
title = "Gameboy Spiele für Bildungs- und Pastoralarbeit"
date = 2025-04-30 22:59:00+01:00
description = "Gamefication in der Bildung und Pastoralarbeit: Wie das Einsetzen von Gameboy-Spielen in der Bildung und Pastoralarbeit die intrinsische Motivation steigern kann. Einblicke in die Nutzung von Gameboy-Spielen in der Bildung und Pastoralarbeit. Mit Tutorial zur Erstellung von Gameboy-Spielen mit GB Studio."
[taxonomies]
tags = ["programmierung", "gb-studio", "javascript", "nintendo", "gameboy", "rom", "software", "games", "levels", "sprites", "story", "emulator", "pastoral", "bildung", "gamefication", "education"] 
[extra]
comment =  true
+++
# Die Genese: Gameboy Spiele für Bildungs- und Pastoralarbeit
Wer mir auf diesem Blog folgt ahnt vielleicht, dass ich ein kleiner Fan von Retrospielen bin. Ich habe zu meinem Leidwesen noch nie einen Gameboy bessessen, aber das hielt mich nicht davon ab, mich mit dem Thema zu beschäftigen. Als ich vor drei Jahren dann an meiner App für die Firmvorberietung (feiafanga) im Dekanat Werdenfels-Rottenbuch gearbeitet habe, kam mir die Idee, dass ich zum Gamefification von Bildungsinhalten auch Gameboy-Spiele erstellen könnte. Ich habe mich dann auf die Suche nach einem Tool gemacht, mit dem ich Gameboy Spiele erstellen kann. Ich bin dann auf [GB Studio](https://www.gbstudio.dev/) gestoßen. Das ist ein Tool mit dem man ohne Programmierkenntnisse Gameboy-Spiele erstellen kann. Tatsächliche Gameboyspiele, die auf originalen Gameboy-Hardware laufen. Das Tool ist sehr einfach zu bedienen und ich kann es jedem empfehlen, der sich für Gameboy-Spiele interessiert. Zugleich bietet es Dir die Möglichkeit die Spiele als HTML5-Spiele zu exportieren, die dann im Browser laufen. Das ist natürlich eine tolle Sache, denn so kann ich die Spiele direkt in meine App einbauen.

## Vorbereitung zur Erstellung eines Gameboy-Spiels
Hier möchte ich kurz erklären, was du alles zur Erstellung von einem kurzen Gameboy-Spiel brauchst:
1. **GB Studio**: Das ist das Tool, mit dem du die Spiele erstellen kannst. Es ist kostenlos und Open Source.
2. **GB Assets**: Das sind die Grafiken, die du für dein Spiel brauchst. Du kannst sie selbst erstellen oder im Internet suchen. Es gibt viele Seiten, die kostenlose Grafiken anbieten.
3. **GB Emulator**: Das ist ein Programm, mit dem du die Spiele testen kannst. Es gibt viele Emulatoren, die du kostenlos herunterladen kannst, außerdem lässt sich das Spiel innerhalb von GB Studio als HTML5 Spiel esportieren.
4. **GB Music**: Das sind die Musik, die du brauchst. Du kannst sie selbst erstellen oder im Internet suchen. Es gibt viele Seiten, die kostenlose Musik anbieten.
5. **Story**: Das ist die Geschichte, die du erzählen möchtest. Du kannst sie selbst schreiben oder dir von einem Sprachmodell helfen lassen. Es gibt viele Seiten, die kostenlose Geschichten anbieten. Im Bildungskontext ist es wichtig, dass die Geschichte auch einen Bezug zu dem Thema hat, das du vermitteln möchtest.
6. **LDtk**: Das ist ein Tool, mit dem du die Level erstellen kannst. Es ist kostenlos und Open Source. Du kannst es hier herunterladen: [LDtk](https://ldtk.io/). Das Tool ist sehr einfach zu bedienen und ich kann es jedem empfehlen, der sich für Gameboy-Spiele interessiert. Es gibt viele Tutorials im Internet, die dir helfen, das Tool zu verstehen.
## Erstellung Anhand eines Beispiels
### Beispielbilder
<style>
    img {
        width: 200px;
        height: auto;
        margin: 0 10px;
    }
</style>
<div style="
    text-align: center;
    display: flex;
    overflow: scroll;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;">
<img src="/posts/gameboy-games-for-education-and-pastoral-work/images/gb00001.jpg" alt="Gameboy-Bild">
<img src="/posts/gameboy-games-for-education-and-pastoral-work/images/gb00002.jpg" alt="Gameboy-Bild">
<img src="/posts/gameboy-games-for-education-and-pastoral-work/images/gb00003.jpg" alt="Gameboy-Bild">
<img src="/posts/gameboy-games-for-education-and-pastoral-work/images/gb00004.jpg" alt="Gameboy-Bild">
<img src="/posts/gameboy-games-for-education-and-pastoral-work/images/gb00005.jpg" alt="Gameboy-Bild">
<img src="/posts/gameboy-games-for-education-and-pastoral-work/images/gb00006.jpg" alt="Gameboy-Bild">
<img src="/posts/gameboy-games-for-education-and-pastoral-work/images/gb00007.jpg" alt="Gameboy-Bild">
</div>

### Die Story
Für die feiafanga App habe ich kleine und kurze Spiele erstellt, die alle einen Bezug zu den Themen der Firmvorbereitung haben. Ich nutze die sieben Gaben des Heiligen Geistes als Grundlage für die Spiele. Die Spiele sind alle sehr kurz und einfach gehalten, damit sie auch in der Firmvorbereitung eingesetzt werden können. Ich habe mir eine kleine Geschichte ausgedacht, die ich dann in die Spiele eingebaut habe. Die Geschichten handeln von Eli, die/der auf dem Weg zur ersten Firmstunde ist. Auf dem Weg erfährt Eli unterschiedliche Aufgaben, die im Zusammenhang mit den Gaben des Heiligen Geistes stehen. Nachdem Eli die Aufgabe gelöst hat, erhält der Spieler ein Abzeichen in der App. Hier die kurze Geschichte zur Gabe der Erkenntnis:

> Eli ist immer noch auf dem Weg zur ersten Firmstunde. Eli kommt an der Bibliothek vorbei und merkt, dass der Weg durch die Bibliothek schneller ist. Da die Tür zum Ausgang der Bibliothek verschlossen ist, geht Eli zur Bibliothekarin und fragt sie, wie die Tür geöffnet werden kann. Die ist in Gedanken versunken und ist auf der Suche nach der Antwort auf die Frage: "Was führt zu einem glücklichen Leben?". Eli reißt sie aus ihren Gedanken und sie bemerkt, dass sie nicht weiß wor der Schlüssel für die Tür ist. Während sie auf der Suche ist, fragt sie Eli, ob Eli ihr ein Buch bringen kann. Nachdem Eli ihr insgesmat zwei Bücher bringt, findet sie immer noch keine Antwort auf dies Frage, bis Eli von sich sagt: "Was sagt Dir denn Dein Herz?". Daraufhin sagt die Bibliothekarin: "Das ist eine gute Frage. Ich werde darüber nachdenken." und gibt Eli den Schlüssel für die Tür. Eli kann jetzt die Bibliothek verlassen und zur ersten Firmstunde gehen.

Hier wird plakativ deutlich, dass die Gabe der Erkenntnis nicht nur eine intellektuelle Fähigkeit ist, sondern auch eine emotionale und spirituelle Dimension hat. Die Gabe der Erkenntnis hilft uns, die Welt um uns herum besser zu verstehen und die richtigen Entscheidungen zu treffen. Sie ist eine Gabe des Heiligen Geistes, die uns hilft, die Wahrheit zu erkennen und zu leben.

### Die Erstellung des Spiels

1. Zuerst erstelle ich die Grafiken, die ich für das Spiel brauche. Die meisten Assets habe ich bei [itch.io](https://itch.io/) gefunden und mit LDtk habe ich die passenden Hintergründe erstellt. Änderungen habe ich einfach mit [Gimp](https://www.gimp.org/) vorgenommen und [Polotno Studio](https://studio.polotno.com/).

<style>
    img {
        width: 200px;
       min-height: 200px;
        margin: 0 10px;
    }
</style>
<div style="
    text-align: center;
    display: flex;
    overflow: scroll;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;">
<img src="/posts/gameboy-games-for-education-and-pastoral-work/images/tiles00001.png" alt="Tile-Bild">
<img src="/posts/gameboy-games-for-education-and-pastoral-work/images/tiles00002.png" alt="Tile-Bild">
<img src="/posts/gameboy-games-for-education-and-pastoral-work/images/tiles00005.png" alt="Tile-Bild">
<img src="/posts/gameboy-games-for-education-and-pastoral-work/images/tiles00006.png" alt="Tile-Bild">
</div>

2. Innerhalb von GB Studio erstelle ich dann die einzelnen Level und die Logik. Dies ist recht einfach und im Internet gibt es viele Tutorials, die dir helfen, das Tool zu verstehen. Ich habe mir ein paar Tutorials angeschaut und dann einfach drauf losgelegt. Hier ein paar Bilder zum besseren Verständnis, aber man kommt schnell rein und es macht wirklich Spaß.
<style>
    img {
        width: 200px;
       min-height: 200px;
        margin: 0 10px;
    }
    .full {
        width: 95%;
        height: auto;
        margin: 0 10px;
    }
</style>
<div style="
    text-align: center;
    display: flex;
    overflow: scroll;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;">
<img class="full" src="/posts/gameboy-games-for-education-and-pastoral-work/images/screen00001.png" alt="Screen-Bild">
<img  class="full" src="/posts/gameboy-games-for-education-and-pastoral-work/images/screen00002.png" alt="Screen-Bild">
<img  class="full" src="/posts/gameboy-games-for-education-and-pastoral-work/images/screen00003.png" alt="Screen-Bild">
</div>

3. Danach exportiere ich das Spiel als .gb Rom und lade es auf meinen Server hoch. Die App lädt das Spiel dann herunter und die Jugendlichen können es direkt in der App spielen. Durch ein kleines JavaScript-Script innerhalb der App erkennt die App wann das Spiel beendet ist und hinterlegt dann ein Abzeichen in der App. Hier ist das Snippet. Es liest praktischerweise den Videobuffer des Emulators und erkennt anhand eine Farbcodes ob das Spiel beendet wurde. Diese Methode ist zwar nicht perfekt, aber es funktioniert.

```javascript
      setInterval(() => {
        if ( emulator.video.buffer[0] == 248 && emulator.video.buffer[4] == 0 && emulator.video.buffer[8] == 248 && emulator.video.buffer[12] == 0 && emulator.video.buffer[16] == 248 && emulator.video.buffer[20] == 0 ) {
          addBadge("Spiel ", localStorage.getItem("romname"));
          window.location.href = "../index.html";

        }
      },10);
``` 


## Gamification in der Bildung und Pastoralarbeit

Gamification bietet wertvolle Möglichkeiten, die Motivation von Lernenden zu steigern und komplexe Inhalte zugänglicher zu machen. Im Kontext der Pastoralarbeit können Spielelemente spirituelle Themen anschaulicher vermitteln.

### Vorteile von Gameboy-Spielen

- **Einfacher Zugang**: Leicht verständliche Spielmechanik
- **Fokus auf Inhalt**: Reduzierte Grafik lenkt nicht vom Lerninhalt ab
- **Universelle Verfügbarkeit**: HTML5-Export und Rom-Export ermöglicht Nutzung auf verschiedenen Geräten, selbst billig Handhelds wie der R36S können genutzt werden.


### Lerneffekte durch Gamification

- Aktiveres Engagement statt passiver Informationsaufnahme
- Emotionale Verbindung durch Charaktere und Geschichten
- Unmittelbares Feedback zum Lernfortschritt
- Selbstbestimmtes Lernen im eigenen Tempo

### Integration in die Firmvorbereitung

Die Gameboy-Spiele rund um Eli veranschaulichen die Gaben des Heiligen Geistes und dienen als Gesprächsgrundlage. Die Verknüpfung mit Abzeichen in der App schafft zusätzliche Motivation für die Jugendlichen.

### Herausforderungen

Bei der Entwicklung war es wichtig, eine Balance zwischen Unterhaltung und Lerninhalt zu finden. Die technische Integration und zielgruppengerechte Gestaltung erforderten kreative Lösungen. Die Übersetzung theologischer Konzepte in Spielmechaniken benötigte besondere Sorgfalt.

### Weitere Anwendungsmöglichkeiten

Das Konzept lässt sich auf andere Bereiche wie Bibelgeschichten, Kirchengeschichte oder ethische Fragestellungen übertragen.

## Fazit

Der Einsatz von Gameboy-Spielen in der Bildungs- und Pastoralarbeit hat sich als effektive Methode erwiesen, um Jugendliche emotional anzusprechen und komplexe theologische Themen erfahrbar zu machen. GB Studio ermöglicht auch technisch weniger versierten Personen die Entwicklung eigener Bildungsspiele. Die positiven Rückmeldungen bestätigen, dass dieser innovative Ansatz die Firmvorbereitung bereichert und die intrinsische Motivation der Jugendlichen fördert. Die Kombination aus nostalgischer Spielästhetik und modernen pädagogischen Konzepten schafft neue Wege für eine zeitgemäße religiöse Bildung.