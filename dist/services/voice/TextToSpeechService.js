"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextToSpeechService = void 0;
const audio_1 = require("../../utils/audio");
const audioEffects_1 = require("../../utils/audioEffects");
const logger_1 = require("../../utils/logger");
const node_fetch_1 = __importDefault(require("node-fetch"));
class TextToSpeechService {
    constructor(apiKey) {
        this.baseUrl = 'https://api.elevenlabs.io/v1';
        this.apiKey = apiKey;
        this.audioProcessor = new audio_1.AudioProcessor();
        this.audioEnhancer = new audioEffects_1.AudioEnhancer();
    }
    async synthesize(text, options) {
        try {
            const response = await (0, node_fetch_1.default)(`${this.baseUrl}/text-to-speech/${options.model}`, {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': this.apiKey
                },
                body: JSON.stringify({
                    text,
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: options.settings || {
                        stability: 0.5,
                        similarity_boost: 0.75,
                        style: 0.7,
                        use_speaker_boost: true,
                        volume: 1.0
                    }
                })
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to synthesize speech: ${response.status} - ${errorText}`);
            }
            const audioBuffer = Buffer.from(await response.arrayBuffer());
            // Process the audio
            let processedAudio = await this.audioProcessor.processAudio(audioBuffer);
            // Enhance the audio
            processedAudio = await this.audioEnhancer.enhance(processedAudio);
            // Estimate duration (assuming 16kHz 16-bit audio)
            const duration = Math.ceil(processedAudio.length / 32000);
            return {
                audioData: processedAudio,
                duration,
                speaker: options.model
            };
        }
        catch (error) {
            logger_1.logger.error('Error in synthesize:', error);
            throw error;
        }
    }
    async combineAudio(segments) {
        try {
            const processedSegments = [];
            for (let i = 0; i < segments.length; i++) {
                const segment = segments[i];
                processedSegments.push(segment.audioData);
                // Add a small pause between segments (0.5 seconds)
                if (i < segments.length - 1) {
                    const pause = Buffer.alloc(22050); // 0.5 seconds at 44.1kHz
                    processedSegments.push(pause);
                }
            }
            return Buffer.concat(processedSegments);
        }
        catch (error) {
            logger_1.logger.error('Error combining audio segments:', error);
            throw error;
        }
    }
}
exports.TextToSpeechService = TextToSpeechService;
//# sourceMappingURL=TextToSpeechService.js.map