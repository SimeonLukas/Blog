+++
title = "Gameboy Games for Educational and Pastoral Work"
date = 2025-04-30 22:59:00+01:00
description = "Gamification in education and pastoral work: How using Gameboy games in education and pastoral work can increase intrinsic motivation. Insights into the use of Gameboy games in education and pastoral work. With tutorial for creating Gameboy games using GB Studio."
[taxonomies]
tags = ["programmierung", "gb-studio", "javascript", "nintendo", "gameboy", "rom", "software", "games", "levels", "sprites", "story", "emulator", "pastoral", "bildung", "gamefication", "education"] 
[extra]
comment =  true
+++

# The Genesis: Gameboy Games for Educational and Pastoral Work

Those who follow my blog might suspect that I'm a bit of a retro gaming fan. To my regret, I never owned a Gameboy, but that didn't stop me from exploring the topic. When I was working on my app for confirmation preparation (feiafanga) in the Werdenfels-Rottenbuch deanery three years ago, I had the idea that I could create Gameboy games to gamify educational content. I searched for a tool to create Gameboy games and discovered [GB Studio](https://www.gbstudio.dev/). This tool allows you to create actual Gameboy games that run on original Gameboy hardware, without requiring programming knowledge. The tool is very easy to use, and I recommend it to anyone interested in Gameboy games. It also offers the ability to export games as HTML5 games that run in a browser, which is fantastic because I can integrate the games directly into my app.

## Preparation for Creating a Gameboy Game

Here I'd like to briefly explain what you need to create a short Gameboy game:

1. **GB Studio**: This is the tool for creating games. It's free and open source.
2. **GB Assets**: These are the graphics you need for your game. You can create them yourself or search online. Many sites offer free graphics.
3. **GB Emulator**: This is a program for testing your games. There are many emulators available for free download, plus the game can be exported as an HTML5 game from within GB Studio.
4. **GB Music**: This is the music you need. You can create it yourself or search online. Many sites offer free music.
5. **Story**: This is the story you want to tell. You can write it yourself or get help from a language model. Many sites offer free stories. In an educational context, it's important that the story has a connection to the topic you want to convey.
6. **LDtk**: This is a tool for creating levels. It's free and open source. You can download it here: [LDtk](https://ldtk.io/). The tool is very easy to use, and I recommend it to anyone interested in Gameboy games. There are many tutorials online to help you understand the tool.

## Creation Based on an Example

### Example Images

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
<img src="/posts/gameboy-games-for-education-and-pastoral-work/images/gb00001.jpg" alt="Gameboy image">
<img src="/posts/gameboy-games-for-education-and-pastoral-work/images/gb00002.jpg" alt="Gameboy image">
<img src="/posts/gameboy-games-for-education-and-pastoral-work/images/gb00003.jpg" alt="Gameboy image">
<img src="/posts/gameboy-games-for-education-and-pastoral-work/images/gb00004.jpg" alt="Gameboy image">
<img src="/posts/gameboy-games-for-education-and-pastoral-work/images/gb00005.jpg" alt="Gameboy image">
<img src="/posts/gameboy-games-for-education-and-pastoral-work/images/gb00006.jpg" alt="Gameboy image">
<img src="/posts/gameboy-games-for-education-and-pastoral-work/images/gb00007.jpg" alt="Gameboy image">
</div>

### The Story

For the feiafanga app, I created small and short games, all related to confirmation preparation themes. I use the seven gifts of the Holy Spirit as the foundation for the games. The games are all very short and simple so they can be used in confirmation preparation. I came up with a short story that I then incorporated into the games. The stories are about Eli, who is on the way to the first confirmation class. Along the way, Eli encounters different tasks related to the gifts of the Holy Spirit. After Eli solves the task, the player receives a badge in the app. Here's the short story for the gift of knowledge:

> Eli is still on the way to the first confirmation class. Eli passes by the library and realizes that going through the library would be faster. Since the door to the library exit is locked, Eli goes to the librarian and asks how to open the door. She is lost in thought, searching for the answer to the question: "What leads to a happy life?" Eli interrupts her thoughts, and she realizes she doesn't know where the key to the door is. While she's searching, she asks Eli to bring her a book. After Eli brings her two books, she still hasn't found an answer to her question, until Eli says: "What does your heart tell you?" The librarian then says: "That's a good question. I'll think about it," and gives Eli the key to the door. Now Eli can leave the library and go to the first confirmation class.

This clearly demonstrates that the gift of knowledge is not just an intellectual ability but also has an emotional and spiritual dimension. The gift of knowledge helps us better understand the world around us and make the right decisions. It is a gift of the Holy Spirit that helps us recognize and live the truth.

### The Creation of the Game

1. First, I create the graphics I need for the game. I found most assets on [itch.io](https://itch.io/) and created the appropriate backgrounds with LDtk. I made changes easily with [Gimp](https://www.gimp.org/) and [Polotno Studio](https://studio.polotno.com/).

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
<img src="/posts/gameboy-games-for-education-and-pastoral-work/images/tiles00001.png" alt="Tile image">
<img src="/posts/gameboy-games-for-education-and-pastoral-work/images/tiles00002.png" alt="Tile image">
<img src="/posts/gameboy-games-for-education-and-pastoral-work/images/tiles00005.png" alt="Tile image">
<img src="/posts/gameboy-games-for-education-and-pastoral-work/images/tiles00006.png" alt="Tile image">
</div>

2. Within GB Studio, I then create the individual levels and logic. This is quite simple, and there are many tutorials online to help you understand the tool. I watched a few tutorials and then just got started. Here are some images for better understanding, but you get the hang of it quickly and it's really fun.

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
<img class="full" src="/posts/gameboy-games-for-education-and-pastoral-work/images/screen00001.png" alt="Screen image">
<img  class="full" src="/posts/gameboy-games-for-education-and-pastoral-work/images/screen00002.png" alt="Screen image">
<img  class="full" src="/posts/gameboy-games-for-education-and-pastoral-work/images/screen00003.png" alt="Screen image">
</div>

3. After that, I export the game as a .gb ROM and upload it to my server. The app then downloads the game, and the youth can play it directly in the app. Through a small JavaScript script within the app, the app recognizes when the game is finished and then stores a badge in the app. Here's the snippet. It conveniently reads the emulator's video buffer and recognizes by a color code whether the game has been completed. This method isn't perfect, but it works.

```javascript
      setInterval(() => {
        if ( emulator.video.buffer[0] == 248 && emulator.video.buffer[4] == 0 && emulator.video.buffer[8] == 248 && emulator.video.buffer[12] == 0 && emulator.video.buffer[16] == 248 && emulator.video.buffer[20] == 0 ) {
          addBadge("Game ", localStorage.getItem("romname"));
          window.location.href = "../index.html";

        }
      },10);
```

## Gamification in Education and Pastoral Work

Gamification offers valuable opportunities to increase learner motivation and make complex content more accessible. In the context of pastoral work, game elements can make spiritual topics more tangible.

### Benefits of Gameboy Games

- **Easy Access**: Simple game mechanics
- **Focus on Content**: Reduced graphics don't distract from the educational content
- **Universal Availability**: HTML5 export and ROM export allow use on various devices, even cheap handhelds like the R36S can be used.

### Learning Effects Through Gamification

- More active engagement instead of passive information reception
- Emotional connection through characters and stories
- Immediate feedback on learning progress
- Self-directed learning at your own pace

### Integration into Confirmation Preparation

The Gameboy games centered around Eli illustrate the gifts of the Holy Spirit and serve as conversation starters. The connection with badges in the app creates additional motivation for young people.

### Challenges

During development, it was important to find a balance between entertainment and educational content. The technical integration and age-appropriate design required creative solutions. Translating theological concepts into game mechanics needed special care.

### Further Applications

The concept can be applied to other areas such as Bible stories, church history, or ethical issues.

## Conclusion

The use of Gameboy games in educational and pastoral work has proven to be an effective method for emotionally engaging young people and making complex theological topics experiential. GB Studio enables even technically less proficient individuals to develop their own educational games. The positive feedback confirms that this innovative approach enriches confirmation preparation and promotes the intrinsic motivation of young people. The combination of nostalgic game aesthetics and modern pedagogical concepts creates new paths for contemporary religious education.