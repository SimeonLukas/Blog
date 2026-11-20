+++
title = "dustyPad: Turn an Old iPad into a Macropad"
date = 2026-11-19
description = "dustyPad turns an old iPad or browser-equipped tablet into a Macropad and widget display for your Mac. What it can do and what you need."
draft = true
[taxonomies]
tags = ["tutorial", "hardware", "software", "mac", "ipad", "dashboard", "browser", "smart-home"]
[extra]
vgwort = "https://vg04.met.vgwort.de/na/dc3ba8d8680744d68b11f0c81d6e8c04"
comment = true
+++

# Give an old iPad a new purpose

Do you have an old iPad in a drawer that has become too slow for modern apps? It may still be perfectly useful as a dashboard or a screen with a few big buttons on your desk. I have used an old iPad as a smart-home dashboard before. Now I have come across **dustyPad**, which turns a tablet with a browser into a Macropad and widget display for your Mac.

I like the idea: instead of buying a separate device with buttons, you use a screen you already own. Play and pause, volume, microphone mute, or opening a frequently used app can all be available on a custom interface. Widgets for the time, weather, or currently playing track can sit alongside them.

> **To update before publishing:** After trying it out, add which old iPad or tablet you used and how the setup felt.

## What is dustyPad?

dustyPad consists of a Mac app and a webpage for the tablet. The Mac app runs in the menu bar and hosts the interface on your local network. On the iPad, you simply open the address in a browser. There is no need to install an iPad app or download anything from the App Store.

That is what makes it different from a regular web dashboard: the tablet is the control surface for your Mac. The Mac performs the actions, such as pausing music, changing the volume, or launching an app.

Both devices need to be on the same Wi-Fi network. When connecting for the first time, you enter a six-digit code shown on the Mac. According to the project, the code rotates every five minutes and can only be used once.

## Which devices work?

On the tablet, all you need is a browser that can load the page. dustyPad lists Safari on iOS 9 or later as its minimum and also mentions Android tablets, Kindle Fire devices, and even older phones. The tablet does not need to be able to install a current app.

There is one important requirement on the other side: you need a Mac running macOS 13 Ventura or later. dustyPad is not a standalone dashboard application that runs on any web server. The Mac is the host and needs to be on while you use the tablet as a control panel.

## A custom 3D-printed frame

I have also added a [3D-printable frame configurator](konfigurator/index.html) for my first-generation iPad Air. You can adjust the frame in your browser, including its wall thickness, cable opening, back, and stand. Then you can export an OpenSCAD file or individual STL files for the frame, back plate, and feet.

The configurator is a separate project, not a feature of dustyPad. It is designed specifically for the first-generation iPad Air (240 × 169.5 × 7.5 mm, landscape orientation, inserted from the top), so it will not fit arbitrary tablets. Check the dimensions and fit before printing. For the cleanest STL export, the configurator recommends exporting the OpenSCAD file.

## What can the Macropad do?

The free version already includes several useful actions:

- Control media and adjust the volume
- Mute the microphone
- Open apps or websites
- Show the time, weather, and currently playing track
- Customize the interface with themes and icons

The Pro version adds features including custom keyboard shortcuts, Shortcuts app macros, timers, a Pomodoro timer, a world clock, and system information. According to the provider, the free version remains available forever, while Pro is a one-time purchase.

I find the combination interesting: one button can trigger an action while a nearby widget shows information. The tablet becomes more than a collection of links; it can be a small console tailored to your workspace.

## Setup without cables

The setup sounds pleasantly straightforward:

1. Install and launch dustyPad on the Mac.
2. Open a browser on the tablet and visit the local address shown by dustyPad.
3. Enter the one-time pairing code from the Mac.
4. Arrange the actions and widgets you want on the interface.

The connection runs over your local Wi-Fi. An account or cloud relay is not supposed to be required for normal use. According to the FAQ, some features can still use an internet connection—for example, weather, Pro license verification, and update checks.

## A Stream Deck from the drawer?

A real Stream Deck has physical keys. You can press them without looking and feel what you are pressing. A tablet cannot replace that. On the other hand, you may already own the screen, you can change the interface, and you can see widgets alongside the buttons.

I would not see dustyPad as a perfect copy of a Stream Deck, but as an inexpensive way to give an old tablet another purpose. Especially if it is already on your desk and you want a few recurring actions within easy reach.

It is not automatically the right solution as a smart-home dashboard, either: dustyPad's actions control the Mac. If you mainly want to operate lights, sensors, and other smart-home devices, you will still need an appropriate dashboard or smart-home integration.

## Privacy and limitations

The provider describes dustyPad as a local connection between the Mac and tablet: no account, no cloud relay, and no in-app telemetry. Pairing with a rotating code is a sensible measure so that not just any device on the Wi-Fi network can send actions to the Mac.

Of course, that does not replace checking the software and your network settings yourself. The Mac also remains an essential part of the setup. If it is off or dustyPad is not running, the tablet control panel will not be available.

## Is it worth trying?

If you have an old iPad or another browser-equipped tablet lying around and use a Mac running Ventura or later, you can try dustyPad without buying new hardware. The free version already covers several common Macropad actions. A one-time Pro license adds more widgets, custom shortcuts, and themes.

I especially like the idea: not every old device has to be thrown away just because its App Store selection has shrunk. If its browser still works, the tablet may still be useful as an interface.

**Links:** [dustyPad](https://dustypad.com/) · [macOS downloads](https://github.com/mknarciso/dustypad-releases/releases)

> **Check before publishing:** Try dustyPad on an older device of your own, add screenshots, and verify the price and system requirements on the project website.
