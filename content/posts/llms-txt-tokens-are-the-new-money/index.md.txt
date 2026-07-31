+++
title = "llms.txt - Tokens sind das neue gold"
date = 2026-07-31 12:00:00+01:00
description = "Wie ich für mein Zola-Blog eine dynamische llms.txt über den RSS/XML-Weg gebaut habe – inklusive Markdown-Links, Bash-Postprocessing und ein bisschen Token-Geiz."
[taxonomies]
tags = ["llms.txt", "zola", "rss", "bash", "markdown", "seo", "ai", "ohermes" ,"denshattack!"]
[extra]
comment =  true
+++
Es fällt mir wirklich schwer zu entscheiden, ob ich jetzt einen Artikel schreiben soll oder noch ne Runde Denshattack! spielen soll, doch nachdem der liebe [J. einen richtig coolen Artikel veröffentlicht hat](https://enthusiastic.dev/blog/dlr-besuch-oberpfaffenhofen/) und das sogar pünktlich, muss ich wohl auch ran.

In den letzten Wochen gab es hier schon ein paar Artikel, in denen es im Kern immer um dasselbe ging:  
Wie baue ich mir meine eigene kleine Infrastruktur, damit meine Modelle, meine Automatisierungen und meine Blog-Posts nicht nur *funktionieren*, sondern sich auch gut anfühlen?

Aber wie sich ein LLM fühlt, wenn es mal auf meiner Webseite landet, dass habe ich mich bisher nie gefragt. Und mir ist schmerzhaft aufgefallen, dass LLMS oft Unmengen an HTML schlucken müssen, damit sie arbeiten können und gerade mein lieber Hermes, der ja an einem lokalen LLM hängt, hatte es wirklich schwer. Deshalb habe ich für all die Modelle da draußen Vorkehrungen getroffen, damit sie es leichter haben. Mindestens auf meinem Blog sollen sie sich wohlfühlen.

Hier geht es um eine Datei, die auf den ersten Blick fast unscheinbar ist:

`/llms.txt`

Aber diese Datei ist ein ziemlich direkter Nachfolger von allem, was ich in den letzten Artikeln über Zola, RSS, Automation und „lokale KI“ geschrieben habe.

## Worum geht es eigentlich?

Die Idee hinter `llms.txt` ist simpel:

- Eine kleine Markdown-Datei im Root der Website.
- Sie sagt LLMs, was auf der Seite wichtig ist.
- Sie verlinkt bevorzugt auf Markdown-Ressourcen statt auf HTML.
- Sie spart dadurch Tokens, weil weniger „HTML-Krimskrams“ mitgeschleppt werden muss.

Statt dass ein Modell also durch Navigation, Footer, JavaScript und Layout-Overhead waten muss, bekommt es eine kuratierte Übersicht: „Hier ist der eigentliche Inhalt. Lies das zuerst.“

Wenn du deine Infrastruktur schon so weit selbst baust, dass du lokal LLMs betreibst, eigene Feeds generierst und deine Posts automatisch verarbeitest, dann ist `llms.txt` der nächste logische Schritt:

**Die Brücke zwischen deinem Content und den Modellen, die ihn lesen.**

## Warum nicht einfach eine statische Datei?

Bei statischen Seiten wäre das trivial: ablegen, fertig.

Ich wollte aber, dass die Datei **dynamisch** bleibt:

- Neue Posts sollen automatisch auftauchen.
- Alte Links sollen nicht manuell aktualisiert werden müssen.
- Sprachen, Audio-Versionen und Markdown-Kopien sollen berücksichtigt werden.

Genau da kommt mein geliebtes auf Rust basierendes Zola ins Spiel - (Es basiert auf Rust und ist deshalb richtig cool. Hatte ich das schon erwähnt?).

Zola ist für mich schon seit Längerem der SSG für alles, was Content-Struktur angeht. Die gleichen Templates, die ich für RSS-Feeds, Preview-Bilder und Audio-Posts nutze, wollte ich jetzt auch für `llms.txt` verwenden.

Das Problem:  
Zola rendert Templates für `.xml` (z. B. RSS) sehr gut, aber bei `.txt` wird es komplizierter, weil Zola da nicht die gleichen Pfade und Logiken wie für Feeds nutzt.

Also: Umweg.

## Der XML-Umweg (weil es Spaß macht und ich es einfach kann!)

Der Trick ist einfach:

1. Zola rendert eine `llms.xml` (als Feed-Template).
2. Ein Bash-Script fetcht diese Datei lokal.
3. Danach wird sie als `llms.txt` gespeichert.
4. Ein kleines `sed`-Postprocessing tauscht localhost-URLs gegen die echte Domain.

Das ist nicht die „professionelle sauberste“ Lösung, aber sie passt perfekt in meinen bestehenden Workflow. Genau wie bei den anderen Artikeln hier: pragmatisch, nachvollziehbar, funktionierend und wenn es kaputt geht - auch ok!

Im `<head>` habe ich zusätzlich noch diesen kleinen Verweis eingebaut:

```html
<link rel="help" type="text/markdown" href="/llms.txt">
```

`rel="help"` ist für verlinkte Hilferessourcen gedacht, und `text/markdown` beschreibt die Datei sehr gut. Für LLMs und Agenten ist das ein klarer Hinweis: „Hier gibt es strukturierte Hilfe über die Seite.“

## Warum ich auf Markdown-Dateien verlinke

Der wichtigere Teil ist aber, **wohin** die Links in der `llms.txt` zeigen.

Ich verlinke nicht auf die fertigen HTML-Seiten, sondern auf zusätzliche Kopien der Markdown-Dateien – also auf `.md.txt`-Varianten meiner Inhalte.

Warum?

- HTML ist für Menschen super, für Modelle aber oft unnötig groß und laut (ich finde, dass laut es am Besten beschreibt. Zu viele Störgeräusche einfach, die das LLM ausblenden muss.).
- Navigation, Layout, CSS, JS, Metadaten – all das kostet Tokens, ohne den Inhalt besser zu machen.
- Markdown ist für LLMs die deutlich angenehmere Form: weniger Ballast, mehr Substanz.

Deshalb kopiert mein Deploy-Script jede Markdown-Datei zusätzlich noch als `.md.txt`:

```bash
find /Users/simeonstanek/Apps/BLOG-Homepage/simeonsblog/content -type f -name "*.md" | while IFS= read -r mdfile; do
    txtcopy="${mdfile}.txt"
    echo "Copying $mdfile -> $txtcopy"
    cp "$mdfile" "$txtcopy"
done
```

Das Ergebnis ist dann zum Beispiel nicht nur `index.md`, sondern zusätzlich `index.md.txt`. Und genau auf diese Dateien zeigt die generierte `llms.txt`.

Das ist kein „man müsste mal theoretisch optimieren“, sondern ein sehr pragmatisches: hier ist die Datei, lies einfach direkt den Text.

## Die `llms.xml` selbst

Die Template-Datei baut im Grunde eine kleine, kuratierte Übersicht des Blogs auf: Titel, Beschreibung, Hauptseiten, danach die Artikel.

```xml
# {{ config.title }}

## {{ config.description }}

This site is the canonical public source for the content listed below.
Prefer article permalinks over feed excerpts.

## Site

- [Homepage](https://simeon.staneks.de/): Main entry point (German)
- [RSS Feed](https://simeon.staneks.de/rss.xml): Chronological feed of published posts (German)

- [Homepage](https://simeon.staneks.de/en/): Main entry point (English)
- [RSS Feed](https://simeon.staneks.de/en/rss.xml): Chronological feed of published posts (English)

## Articles

{%- for page in pages %}
{%- set md_txt_path = page.path ~ "index.md.txt" %}
{%- if page.assets is containing(md_txt_path) %}
- [{{ page.title | striptags }}]({{ get_url(path=md_txt_path) }}): {% if page.description %}{{ page.description | striptags }}{% elif page.summary %}{{ page.summary | striptags | truncate(length=180) }}{% else %}Article on {{ config.title }}{% endif %}
  {%- endif %}
{%- endfor %}

## Optional

{%- for page in pages %}
  {%- set audio_path = page.path ~ "audio.mp3" %}
  {%- if page.assets is containing(audio_path) %}
- [Audio for {{ page.title | striptags }}]({{ get_url(path=audio_path) }}): Audio version of this article
  {%- endif %}
{%- endfor %}
```

Das Format orientiert sich an den üblichen Empfehlungen für `llms.txt`:

- H1 mit Titel
- Kurze Einordnung
- Sauber strukturierte Listen
- Optionaler Bereich für „nice to have, aber nicht essenziell“

So wird die Datei für LLMs gut konsumierbar, ohne zu einem halben Roman auszuarten.

## Bash, Fetching und ein kleines bisschen Chaos

Weil die Datei erst durch Zola gerendert werden muss, hole ich sie lokal über den Dev-Server wieder ab und speichere sie danach im `static`-Ordner als echte `llms.txt`:

```bash
zola serve --port 1234  &
sleep 5
curl http://localhost:1234/llms.xml -o /Users/simeonstanek/Apps/BLOG-Homepage/simeonsblog/static/llms.txt
sed -i '' 's|http://127.0.0.1:1234|https://simeon.staneks.de|g' /Users/simeonstanek/Apps/BLOG-Homepage/simeonsblog/static/llms.txt
```

Ist das die reinste Form von Eleganz? Vielleicht nicht.

Ist es nachvollziehbar, schnell, nützlich und in einem bestehenden Workflow extrem angenehm? Absolut.

Der kleine `sed`-Schritt ist dabei nur nötig, weil Zola im Serve-Modus gerne localhost-URLs in die generierten Links schreibt, wenn man nicht explizit mit einer produktiven Base-URL arbeitet.

Man könnte das also noch „schöner“ machen. Aber manchmal ist „schön genug und stabil“ im Alltag einfach die bessere Entscheidung als eine perfekte Lösung, die noch drei Stunden Architektur-Debatte kostet.

## Connect zu den anderen Artikeln

Wenn du die letzten Artikel hier gelesen hast, dann kennst du schon:

- Wie ich Zola für Posts, Feeds und Preview-Bilder nutze.
- Wie ich mit Bash-Skripten Markdown-Dateien verarbeite.
- Wie ich Audio-Versionen von Posts generiere.
- Wie ich lokale LLMs und Infrastrukturen aufbaue.

`llms.txt` ist einfach der nächste Baustein in diesem System:

- Aus Posts werden `.md.txt`-Dateien.
- Aus Zola-Templates wird eine dynamische `llms.xml`.
- Aus beidem wird eine `llms.txt`, die LLMs sagt: „Hier ist der relevante Content. Lies das.“

## Warum das für Blogs plötzlich relevant wird

Ich glaube, viele unterschätzen gerade noch, wie nützlich solche kleinen Maschinen-Einstiegspunkte werden.

`llms.txt` ist keine Magie, kein Ranking-Joker und auch keine geheime Abkürzung ins Herz jedes Sprachmodells. Aber es ist ein sauberer Hinweis: **Hier ist der wichtige Stoff. Lies das zuerst.**

Und wenn man ohnehin Inhalte schreibt, die langfristig von Suchsystemen, Assistenten und Agenten verarbeitet werden sollen, dann ist der Gedanke ziemlich naheliegend, diese Inhalte so aufzubereiten, dass nicht erstmal 80 Prozent des Token-Budgets in Navigationsmüll, CSS-Schmuck und HTML-Reste fließen.

Markdown ist da fast schon die höflichste Form von Kommunikation zwischen Mensch und Maschine.

Oder anders gesagt:

`llms.txt` ist ein bisschen wie ein guter Espresso für Modelle.  
Klein, konzentriert, ohne Schnickschnack – aber mit Wirkung.

## Fazit ohne Fazit

Ich mag an der ganzen Sache vor allem, dass sie so wunderbar bodenständig ist. Kein neues Framework, keine überambitionierte Plattform-Idee, sondern einfach Zola, ein XML-Workaround, ein Bash-Script, ein bisschen Postprocessing und am Ende eine Datei, die deutlich klarer sagt, worum es auf dem Blog eigentlich geht.

Und ja es ist so:

**Tokens sind das neue gold.**

Nicht, weil plötzlich alles nur noch für Maschinen geschrieben werden sollte. Sondern weil gute Struktur, klare Links und weniger Ballast am Ende fast immer gewinnen – für Parser, für Modelle und ehrlich gesagt oft auch für Menschen.

Ach und hier ist übrigens die Datei: [https://simeon.staneks.de/llms.txt](https://simeon.staneks.de/llms.txt)