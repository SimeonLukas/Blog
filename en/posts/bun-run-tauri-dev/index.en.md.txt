+++
title = "bun run tauri dev - No AI Challenge"
date = 2026-08-31 12:00:00+01:00
description = "How my seasonal shift in interests left me with no appetite for an AI topic, so I'm indulging my new passion completely without AI - counting calories. A little glimpse into Tauri and cross-platform programming through a calorie tracker app."
[taxonomies]
tags = ["noai", "bun", "tauri", "javascript", "html", "css", "fitness", "kcal!" ,"selfmade"]
[extra]
comment =  true
+++
## The Genesis: I'm in the Mood!
Recently my friend M. sent me an article about ["Time Magazine"](https://www.heise.de/news/Time-Magazine-schaltet-Werbung-gezielt-fuer-KI-Crawler-11409918.html). It was actually about separate markdown pages that the magazine serves to language models, and his comment on it was: "Still such a big fan of AI?". And just like that, today's topic won't be AI, but rather plain old product development and programming that's genuinely fun. And it really is a small blessing to, for once, not rely on AI but instead try to do something yourself, work your way through it, and solve problems by hand. Anyone who follows my blog already knows I have a great passion. I love HTML, CSS, and JavaScript, and if you can combine it with Rust, then I'm truly happy. Today we won't be asking [Claudius Codius](https://enthusiastic.dev/blog/rss-feed-mit-embeddings-modell-sortieren/) or [J.](https://enthusiastic.dev/), but instead doing it the old way: we'll Google (DuckDuckGo) our way to a solution.

### The Idea
Claude recently wrote me a calorie Telegram bot using n8n, which I've now been using since June 2nd and, believe it or not, have lost 5 kilograms thanks to it. So the thing works, basically. Simple principle: I send the bot the calories I've eaten, and it tells me how much I have left for the day. My goal is to stay under 3000 kcal daily, and that has genuinely helped me make progress. I've also been doing intermittent fasting for 5 months now (I start with my first meal at 10:00 and end the eating window at 18:00). All of this has given me a better sense of my body, and I've visibly lost weight. So when my buddy M. wrote to me, he caught me at just the right moment - I need a client-side, offline-capable, self-built calorie counting app. Not because nothing like this exists yet, but simply because I want another project that belongs only to me and was built with my own personal intelligence - even if the result surely won't be as slick as an app built by Claudius Codius.

### The Tools
- [Tauri](https://tauri.app/) is the choice. I do love [Cordova](https://cordova.apache.org/), but for a long time now my fingers have been itching to try something new. Ever since the first major release I've wanted to try Tauri and build apps with it, but unfortunately mobile platform support only arrived with version 2.0. For anyone unfamiliar with Tauri - it lets you build nearly native apps/programs using web technologies by leveraging the OS's webview, which also makes them very small since they don't bundle a full browser.
- HTML, which I already know well.
- CSS, and without Tailwind - just the pure joy of the stylesheet.
- JS, and vanilla at that (okay, that's debatable, but you can do it without types, which doesn't mean you shouldn't pay attention to types anyway. That way I also don't pull in any external libraries, except maybe for icons).

### The Implementation
So now for two weeks I've been sitting there for about half an hour every evening (once everyone in the house is asleep), racking my brain over `EventListener`, `querySelector`, and `new Date()` (my god, I had forgotten how confusing dates and times are in vanilla JavaScript). It's quite a challenge, but it's so much fun. When I don't feel like dealing with CSS, I work on the DOM, and when I don't feel like HTML, I work on the JavaScript, and then there's still the app logo, the icon, and the whole Tauri setup.

#### The Logo and Color Scheme
Yes, you really get to make everything yourself. My logo for the awesome app `kcal!` should look roughly like this, and it also features the font I chose, `Righteous`, for headers, along with the main colors `#F3DB21` and `#F2228D`:
![App Icon](images/app-icon.png)

#### The Layout
For simplicity's sake, I went with a SPA using flex layout. Here are a few screenshots of the work-in-progress app. Weekdays are still shown with their respective numbers. I do like that in the world of HTML5, the week starts on Sunday:
![Screen1](images/Bildschirmfoto%202026-08-31%20um%2022.50.49.png)
![Screen2](images/Bildschirmfoto%202026-08-31%20um%2022.50.58.png)
![Screen3](images/Bildschirmfoto%202026-08-31%20um%2022.52.41.png)

#### The Features
- Thanks to the openly available data from [Kalorientabelle](https://www.kalorientabelle.net/), the app already has over 2000 German products available locally, complete with kcal per 100 g and standard serving size in grams. Here's an example:

```json
{
    "name": "Hanuta (Ferrero)",
    "kcal": 542.0,
    "categorie": "Süßigkeiten: Schokolade, Kekse, Bonbons",
    "size": "22"
  }
```

- You can easily add your own products and adjust existing ones.
- A small statistics view (average and remaining calories)
- An overview of the last 5 days
- Everything offline
- No AI integration
- No tracking
- No advertising
- No dumb nutrition advice
- **Just kcal!**

### Joy and Pain
Tauri is genuinely really cool. Thanks to hot reload, you can immediately see and test every code change (with `bun run tauri dev` a window basically stays open running the program at all times), which makes writing code much faster. With Cordova, that's only possible with a lot of extra effort.

The build for Mac and Android worked instantly and didn't need any fixes.

Tauri already ships with plenty of plugins that talk directly to the respective OS's native functions. In my case, I'm using a `Storage API` that's provided directly by Tauri. In JS, it's simply imported with `const { load } = window.__TAURI__.store`. Bye bye `localStorage`, and welcome to a real, persistent `key-value store`.

I'm already using the app, still in this early alpha stage, but thanks to the simple technologies involved, I had a working version after roughly 4 hours total.

Unfortunately, Tauri still doesn't have an official implementation for overriding the back button on Android (I could tweak the Kotlin myself, but a feature like that really should be built in already). On top of that, the Android webview under Tauri can't correctly render some HTML elements - `<progress>`, for instance, simply doesn't display properly, which is why I switched to a `<div>` inside a `<div>`. Too bad!

You can tell a lot is happening here, and I'm genuinely curious to see how this framework develops further. Once I get the chance, I'll dig more into the Rust side of Tauri too, but only after my next little project.

## Conclusion
It's an incredible amount of fun! There's really not much more to add. Of course, a project like this isn't for everyone, but I enjoy the variety in these small things and the chance to express myself creatively, and if I get to learn a new technology along the way, that's the jackpot. As I said, apps like this are a dime a dozen, but the sense of self-efficacy alone is worth the effort. It also makes something clear to me personally: language models aren't needed everywhere, and I'm not 100% dependent on them. The GitHub link to the `kcal!` project will follow in a future post. Happy calorie counting.
