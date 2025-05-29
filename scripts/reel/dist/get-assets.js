"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const utils_1 = require("./utils");
const uuid_1 = require("uuid");
const fs = require("fs");
async function createAssets(topic, voiceName) {
    const jobId = (0, uuid_1.v4)();
    console.log("Generating assets...");
    const script = await (0, utils_1.getVideoScript)(topic);
    console.log("script", script);
    await (0, utils_1.generateAudio)(script, voiceName, `./public/${jobId}-audio.wav`);
    const words = await (0, utils_1.getWordTimestamps)(`./public/${jobId}-audio.wav`);
    console.log("Generating images...");
    const imagePromises = Array.from({ length: 5 }).map(async (_, index) => {
        const imagePrompt = await (0, utils_1.getImagePromptFromScript)(script);
        await (0, utils_1.dalleGenerate)(imagePrompt, `./public/${jobId}-image-${index}.png`);
        return `/${jobId}-image-${index}.png`;
    });
    const imageFileNames = await Promise.all(imagePromises);
    const metadata = {
        audioUrl: `${jobId}-audio.wav`,
        images: imageFileNames,
        words: words
    };
    await fs.promises.writeFile(`./public/${jobId}-metadata.json`, JSON.stringify(metadata, null, 2));
}
createAssets("The moon landing", "Sarah");
//# sourceMappingURL=get-assets.js.map