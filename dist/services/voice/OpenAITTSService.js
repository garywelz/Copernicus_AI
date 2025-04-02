"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAITTSService = void 0;
const openai_1 = require("openai");
const storage_1 = require("@google-cloud/storage");
class OpenAITTSService {
    constructor(apiKey, projectId) {
        this.openai = new openai_1.OpenAI({ apiKey });
        this.storage = new storage_1.Storage({ projectId });
        this.voiceSettings = {
            host: {
                model: "tts-1",
                voice: "onyx"
            },
            expert: {
                model: "tts-1",
                voice: "nova"
            },
            questioner: {
                model: "tts-1",
                voice: "shimmer"
            }
        };
    }
    async generateAudio(text, speaker = "host", outputPath) {
        try {
            const voiceConfig = this.voiceSettings[speaker] || this.voiceSettings.host;
            const response = await this.openai.audio.speech.create({
                model: voiceConfig.model,
                voice: voiceConfig.voice,
                input: text
            });
            // Convert to AudioSegment
            const audioSegment = {
                duration: 0, // This would need to be calculated from the audio content
                export: (path, format) => {
                    // Implementation would depend on your audio processing library
                    // For now, we'll just save the raw audio content
                    const bucket = this.storage.bucket('audio-temp');
                    const blob = bucket.file(path);
                    blob.save(response.buffer);
                }
            };
            if (outputPath) {
                audioSegment.export(outputPath, 'mp3');
            }
            return audioSegment;
        }
        catch (error) {
            throw new Error(`Error generating OpenAI TTS audio: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async combineAudioSegments(segments, outputPath, pauseDuration = 500) {
        try {
            // Implementation would depend on your audio processing library
            // For now, we'll just concatenate the segments
            const bucket = this.storage.bucket('audio-temp');
            const blob = bucket.file(outputPath);
            // This is a placeholder - actual implementation would need to handle audio concatenation
            await blob.save(Buffer.from([]));
            return outputPath;
        }
        catch (error) {
            throw new Error(`Error combining audio segments: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
exports.OpenAITTSService = OpenAITTSService;
//# sourceMappingURL=OpenAITTSService.js.map