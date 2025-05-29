"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWordTimestamps = getWordTimestamps;
exports.generateAudio = generateAudio;
exports.getVideoScript = getVideoScript;
exports.getImagePromptFromScript = getImagePromptFromScript;
exports.dalleGenerate = dalleGenerate;
const index_mjs_1 = require("openai/index.mjs");
const axios_1 = require("axios");
const fs = require("fs");
const sdk_1 = require("@deepgram/sdk");
const deepgram = (0, sdk_1.createClient)(process.env["DEEPGRAM_API_KEY"] || "");
const openai = new index_mjs_1.default({
    apiKey: process.env['OPENAI_API_KEY'],
});
async function getWordTimestamps(audioFilePath) {
    const { result } = await deepgram.listen.prerecorded.transcribeFile(fs.readFileSync(audioFilePath), {
        model: "nova-2",
        smart_format: true,
    });
    if (result) {
        return result.results.channels[0].alternatives[0].words;
    }
    else {
        throw Error("transcription result is null");
    }
}
async function generateAudio(text, voiceName, savePath) {
    const data = {
        model_id: "eleven_multilingual_v2",
        text: text,
    };
    const voiceId = await getVoiceByName(voiceName);
    const response = await axios_1.default.post(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, data, {
        headers: {
            "Content-Type": "application/json",
            "xi-api-key": process.env.ELEVEN_API_KEY || "",
        },
        responseType: "arraybuffer",
    });
    fs.writeFileSync(savePath, response.data);
}
async function getVoiceByName(name) {
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
        method: "GET",
        headers: {
            "xi-api-key": process.env.ELEVEN_API_KEY || "",
        },
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const voice = data.voices.find((voice) => voice.name === name);
    return voice ? voice.voice_id : null;
}
async function getVideoScript(videoTopic) {
    const prompt = `Create a script for a youtube short. The script should be around 60 to 80 words long and be an interesting text about the provided topic, and it should start with a catchy headline, something like "Did you know that?" or "This will blow your mind". Remember that this is for a voiceover that should be read, so things like hashtags should not be included. Now write the script for the following topic: "${videoTopic}". Now return the script and nothing else, also no meta-information - ONLY THE VOICEOVER.`;
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-4-turbo-preview',
    });
    const result = chatCompletion.choices[0].message.content;
    if (result) {
        return result;
    }
    else {
        throw Error("returned text is null");
    }
}
async function getImagePromptFromScript(script) {
    const prompt = `My goal is to create a Youtube Short based on the following script. To create a background image for the video, I am using a text-to-video AI model. Please write a short (not longer than a single sentence), suitable prompt for such a model based on this script: ${script}.\n\nNow return the prompt and nothing else.`;
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-4-turbo-preview',
        temperature: 1.0 // high temperature for "creativeness"
    });
    const result = chatCompletion.choices[0].message.content;
    if (result) {
        return result;
    }
    else {
        throw Error("returned text is null");
    }
}
async function dalleGenerate(prompt, savePath) {
    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        size: "1024x1792",
        quality: "standard",
        n: 1,
    });
    if (!response.data || !response.data[0]) {
        throw new Error("No image generated");
    }
    const url = response.data[0].url;
    const responseImage = await axios_1.default.get(url || "", {
        responseType: "arraybuffer",
    });
    const buffer = Buffer.from(responseImage.data, "binary");
    try {
        await fs.promises.writeFile(savePath, buffer);
    }
    catch (error) {
        console.error("Error saving the file:", error);
        throw error; // Rethrow the error so it can be handled by the caller
    }
}
//# sourceMappingURL=utils.js.map