"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("@revideo/2d/lib/jsx-runtime");
const _2d_1 = require("@revideo/2d");
const core_1 = require("@revideo/core");
const metadata_json_1 = require("./metadata.json");
require("./global.css");
const textSettings = {
    fontSize: 50,
    numSimultaneousWords: 10, // how many words are shown at most simultaneously
    textColor: "black",
    fontWeight: 500,
    fontFamily: "monospace",
    textTransform: "capitalize",
    stream: false, // if true, words appear one by one
    textAlign: "left",
    textBoxWidthInPercent: 60,
    fadeInAnimation: true,
    currentWordColor: "#5F9EA0", // color of the word currently spoken
    currentWordBackgroundColor: "white", // adds a colored box to the word currently spoken
    shadowColor: "black",
    shadowBlur: 5
};
/**
 * The Revideo scene
 */
const scene = (0, _2d_1.makeScene2D)('scene', function* (view) {
    const images = (0, core_1.useScene)().variables.get('images', [])();
    const audioUrl = (0, core_1.useScene)().variables.get('audioUrl', [])();
    const words = (0, core_1.useScene)().variables.get('words', [])();
    const duration = words[words.length - 1].end + 0.5;
    const imageContainer = (0, core_1.createRef)();
    const textContainer = (0, core_1.createRef)();
    yield view.add((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(_2d_1.Layout, { size: "100%", ref: imageContainer }), (0, jsx_runtime_1.jsx)(_2d_1.Layout, { size: "100%", position: { x: 0, y: -100 }, ref: textContainer }), (0, jsx_runtime_1.jsx)(_2d_1.Audio, { src: audioUrl[0], play: true, volume: 0.5 })] }));
    yield* (0, core_1.all)(displayImages(imageContainer, images, duration), displayWords(textContainer, words, textSettings));
});
function* displayImages(container, images, totalDuration) {
    let position = 0;
    for (const img of images) {
        const ref = (0, core_1.createRef)();
        container().add((0, jsx_runtime_1.jsx)(_2d_1.Img, { src: img, height: 1920, ref: ref, zIndex: 0, position: { x: position, y: 0 } }));
        yield* (0, core_1.waitFor)(totalDuration / images.length);
    }
}
function* displayWords(container, words, settings) {
    let waitBefore = words[0].start;
    for (let i = 0; i < words.length; i += settings.numSimultaneousWords) {
        const currentBatch = words.slice(i, i + settings.numSimultaneousWords);
        const nextClipStart = i < words.length - 1 ? words[i + settings.numSimultaneousWords]?.start || null : null;
        const isLastClip = i + settings.numSimultaneousWords >= words.length;
        const waitAfter = isLastClip ? 1 : 0;
        const textRef = (0, core_1.createRef)();
        yield* (0, core_1.waitFor)(waitBefore);
        if (settings.stream) {
            let nextWordStart = 0;
            yield container().add((0, jsx_runtime_1.jsx)(_2d_1.Txt, { width: `${settings.textBoxWidthInPercent}%`, textWrap: true, zIndex: 2, textAlign: settings.textAlign, ref: textRef }));
            for (let j = 0; j < currentBatch.length; j++) {
                const word = currentBatch[j];
                yield* (0, core_1.waitFor)(nextWordStart);
                const optionalSpace = j === currentBatch.length - 1 ? "" : " ";
                const backgroundRef = (0, core_1.createRef)();
                const wordRef = (0, core_1.createRef)();
                const opacitySignal = (0, core_1.createSignal)(settings.fadeInAnimation ? 0.5 : 1);
                textRef().add((0, jsx_runtime_1.jsx)(_2d_1.Txt, { fontSize: settings.fontSize, fontWeight: settings.fontWeight, fontFamily: settings.fontFamily, textWrap: true, textAlign: settings.textAlign, fill: settings.currentWordColor, ref: wordRef, lineWidth: settings.borderWidth, shadowBlur: settings.shadowBlur, shadowColor: settings.shadowColor, zIndex: 2, stroke: settings.borderColor, opacity: opacitySignal, alignSelf: "start", alignItems: "center", children: word.punctuated_word }));
                textRef().add((0, jsx_runtime_1.jsx)(_2d_1.Txt, { fontSize: settings.fontSize, children: optionalSpace }));
                container().add((0, jsx_runtime_1.jsx)(_2d_1.Rect, { fill: settings.currentWordBackgroundColor, zIndex: 1, size: wordRef().size, position: wordRef().position, radius: 10, padding: 10, ref: backgroundRef }));
                yield* (0, core_1.all)((0, core_1.waitFor)(word.end - word.start), opacitySignal(1, Math.min((word.end - word.start) * 0.5, 0.1)));
                wordRef().fill(settings.textColor);
                backgroundRef().remove();
                nextWordStart = currentBatch[j + 1]?.start - word.end || 0;
            }
            textRef().remove();
        }
        else {
            yield container().add((0, jsx_runtime_1.jsx)(_2d_1.Txt, { width: `${settings.textBoxWidthInPercent}%`, textAlign: settings.textAlign, ref: textRef, textWrap: true, zIndex: 2 }));
            const wordRefs = [];
            const opacitySignal = (0, core_1.createSignal)(settings.fadeInAnimation ? 0.5 : 1);
            for (let j = 0; j < currentBatch.length; j++) {
                const word = currentBatch[j];
                const optionalSpace = j === currentBatch.length - 1 ? "" : " ";
                const wordRef = (0, core_1.createRef)();
                textRef().add((0, jsx_runtime_1.jsx)(_2d_1.Txt, { fontSize: settings.fontSize, fontWeight: settings.fontWeight, ref: wordRef, fontFamily: settings.fontFamily, textWrap: true, textAlign: settings.textAlign, fill: settings.textColor, zIndex: 2, stroke: settings.borderColor, lineWidth: settings.borderWidth, shadowBlur: settings.shadowBlur, shadowColor: settings.shadowColor, opacity: opacitySignal, children: word.punctuated_word }));
                textRef().add((0, jsx_runtime_1.jsx)(_2d_1.Txt, { fontSize: settings.fontSize, children: optionalSpace }));
                // we have to yield once to await the first word being aligned correctly
                if (j === 0 && i === 0) {
                    yield;
                }
                wordRefs.push(wordRef);
            }
            yield* (0, core_1.all)(opacitySignal(1, Math.min(0.1, (currentBatch[0].end - currentBatch[0].start) * 0.5)), highlightCurrentWord(container, currentBatch, wordRefs, settings.currentWordColor, settings.currentWordBackgroundColor), (0, core_1.waitFor)(currentBatch[currentBatch.length - 1].end - currentBatch[0].start + waitAfter));
            textRef().remove();
        }
        waitBefore = nextClipStart !== null ? nextClipStart - currentBatch[currentBatch.length - 1].end : 0;
    }
}
function* highlightCurrentWord(container, currentBatch, wordRefs, wordColor, backgroundColor) {
    let nextWordStart = 0;
    for (let i = 0; i < currentBatch.length; i++) {
        yield* (0, core_1.waitFor)(nextWordStart);
        const word = currentBatch[i];
        const originalColor = wordRefs[i]().fill();
        nextWordStart = currentBatch[i + 1]?.start - word.end || 0;
        wordRefs[i]().text(wordRefs[i]().text());
        wordRefs[i]().fill(wordColor);
        const backgroundRef = (0, core_1.createRef)();
        if (backgroundColor) {
            container().add((0, jsx_runtime_1.jsx)(_2d_1.Rect, { fill: backgroundColor, zIndex: 1, size: wordRefs[i]().size, position: wordRefs[i]().position, radius: 10, padding: 10, ref: backgroundRef }));
        }
        yield* (0, core_1.waitFor)(word.end - word.start);
        wordRefs[i]().text(wordRefs[i]().text());
        wordRefs[i]().fill(originalColor);
        if (backgroundColor) {
            backgroundRef().remove();
        }
    }
}
/**
 * The final revideo project
 */
exports.default = (0, core_1.makeProject)({
    scenes: [scene],
    variables: metadata_json_1.default,
    settings: {
        shared: {
            size: { x: 1080, y: 1920 },
        },
    },
});
//# sourceMappingURL=project.js.map