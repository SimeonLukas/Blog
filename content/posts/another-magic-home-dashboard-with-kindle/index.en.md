+++
title = "How to Brew a Magical Smart Home Dashboard with Three Ingredients"
date = 2025-08-26 12:00:00+01:00
description = "Yarr! In this article, I show how I created an interactive Smart Home Dashboard with HTML, CSS, and JavaScript - essentially the three ingredients of a powerful voodoo spell. A story about point-and-click magic and modern technology."
draft = true
[taxonomies]
tags = ["programming", "javascript", "html", "css", "smarthome", "dashboard", "tutorial", "point-and-click"] 
[extra]
comment = true
+++

# How to Brew a Magical Smart Home Dashboard with Three Ingredients
*or: "My name is Simeon Stanek and I want to become a pirate errr... programmer!"*

As a tech enthusiast with a Smart Home system, I faced a puzzle that even the mighty Voodoo priest of Mêlée Island™ couldn't have solved: How do you control a modern home without getting lost in a maze of apps? The answer was as simple as mixing a grog: I would develop my own dashboard - with the three magical ingredients of the web: HTML, CSS, and JavaScript.

## The Concept: An Interface That Would Even Impress LeChuck
The dashboard should be one thing above all: functional. I needed an overview of different rooms and the ability to control lights and other devices. The user interface should be intuitive and adapt to my habits.

### The Technical Implementation
The project is based on three main components:

1. **HTML** for the structure
2. **CSS** for the design
3. **JavaScript** for interactivity

The data is stored in a JSON file that acts as a kind of simple database. This allows me to make changes to the configuration without touching the code.

### The Rooms - My Personal SCUMM Bar
The dashboard shows different rooms of my home - kind of like a modern version of the SCUMM Bar, only here instead of grog, various Smart Home beverages are served:

- Living room (definitely better lighting than in the tavern)
- Bedroom (perfect for a power nap between adventures)
- Hallway (first impressions count, even without a talking skull)
- Dining room (here even the Root Beer™ tastes good)
- Kitchen (for unforgettable background music while cooking)
- 1st Floor (where the secret treasures are stored)
- TV room (for epic movie nights)

Each room is represented by its own image and shows the current status of the devices - completely without voodoo spells or talking skulls. I chose the images so they represent each room well while creating an atmospheric mood.

### The Control: A Mini Point-and-Click Adventure
As a big fan of point-and-click adventure games, I wanted to bring some of that playful charm to my dashboard. Instead of ordinary buttons, I opted for an HTML Image Map - a technique that many might still remember from classic adventure games. You simply click directly on the objects in the room you want to control, just like in an adventure game.

For each device, there are clickable areas in the room image:

- Main lighting - a click on the ceiling lamp
- Ambient lighting (like the floor lamp in the living room) - click directly on the lamp
- Other devices (like music in the kitchen) - simply click the corresponding device

Status changes are immediately displayed visually, so you can see at a glance which devices are turned on - almost like when you solve a puzzle in an adventure game and the environment changes. This playful interaction makes the control not only functional but also entertaining.

## Implementation Highlights

### Efficient Data Management
The data is stored in a JSON file:
- `data.json`

```json
[
{
        "name": "wohnzimmer",
        "items": [
            {
                "name": "Licht Wohnzimmer",
                "coords": "972,194,120",
                "shape": "circle",
                "ip": "192.168.178.***",
                "device": "shelly",
                "onclick": "shelly('192.168.178.***', 'light', 'toggle')"
            },
            {
                "name": "Stehlampe Wohnzimmer",
                "coords": "1395,797,1467,489",
                "shape": "rect",
                "ip": "192.168.178.***",
                "device": "shelly",
                "onclick": "shelly('192.168.178.***', 'relay', 'toggle')"
            }
        ]
    },
    ...
]
```

### Image Optimization
The images were carefully selected and optimized to ensure fast loading times. For status changes, small, efficient PNG files or GIF files for animations are used.

By the way: All images were generated with ChatGPT. I simply took photos of my rooms and then added them as attachments to the prompt "Transform this into a pixel art image like in a point-and-click adventure." The results turned out surprisingly good!

## Structure and Examples

### Structure

The project follows a clear folder structure:

```
/
├── css/
│   ├── style.css
│   └── style.min.css
├── js/
│   ├── script.js
│   └── script.min.js
├── images/
│   └── [various images for rooms and status]
├── data.json
└── index.html
```

### Examples    

<video controls style="max-width: 100%; height: auto;">
  <source src="images/clip.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## Conclusion and Outlook - The End of This Developer Story
The dashboard fulfills its purpose better than a rubber chicken with a pulley: It provides a simple, fast, and reliable way to control my Smart Home. Using web technologies makes it incredibly flexible.

For the future, I'm planning some extensions (or as Murray would say: "Mighty plans!"):
- Integration of additional Smart Home devices (maybe even a Root Beer™ dispenser?)
- Automation rules directly in the dashboard (more complicated than the recipe for Monkey Island™ grog)
- Usage statistics
- Energy consumption monitoring

The project shows that you can create an effective solution even with simple means - completely without a talking skull. Sometimes you just need three ingredients and the courage of a wannabe pirate to create something great.

*As Guybrush Threepwood would say: "That's the second-best dashboard I've ever seen!" - "Second-best? What's the best?" - "Oh, I haven't found that yet, but with such a big ocean out there, there must be a better one somewhere!"*