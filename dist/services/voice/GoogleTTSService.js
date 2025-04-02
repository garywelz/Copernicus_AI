"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleTTSService = void 0;
const text_to_speech_1 = require("@google-cloud/text-to-speech");
const storage_1 = require("@google-cloud/storage");
class GoogleTTSService {
    constructor(projectId) {
        this.ttsClient = new text_to_speech_1.TextToSpeechClient({ projectId });
        this.storage = new storage_1.Storage({ projectId });
        this.voiceSettings = {
            host: {
                language_code: "en-US",
                name: "en-US-Neural2-D",
                ssml_gender: "MALE"
            },
            expert: {
                language_code: "en-US",
                name: "en-US-Neural2-A",
                ssml_gender: "MALE"
            },
            questioner: {
                language_code: "en-US",
                name: "en-US-Neural2-E",
                ssml_gender: "FEMALE"
            }
        };
    }
    async generateAudio(text, speaker = "host", outputPath) {
        try {
            const voiceConfig = this.voiceSettings[speaker] || this.voiceSettings.host;
            const request = {
                input: { text },
                voice: {
                    languageCode: voiceConfig.language_code,
                    name: voiceConfig.name,
                    ssmlGender: voiceConfig.ssml_gender
                },
                audioConfig: {
                    audioEncoding: text_to_speech_1.protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
                    speakingRate: 1.0,
                    pitch: 0.0
                }
            };
            const [response] = await this.ttsClient.synthesizeSpeech(request);
            if (!response.audioContent) {
                throw new Error('No audio content received from Google TTS');
            }
            // Convert to AudioSegment
            const audioSegment = {
                duration: 0, // This would need to be calculated from the audio content
                export: (path, format) => {
                    // Implementation would depend on your audio processing library
                    // For now, we'll just save the raw audio content
                    const bucket = this.storage.bucket('audio-temp');
                    const blob = bucket.file(path);
                    blob.save(response.audioContent);
                }
            };
            if (outputPath) {
                audioSegment.export(outputPath, 'mp3');
            }
            return audioSegment;
        }
        catch (error) {
            throw new Error(`Error generating Google TTS audio: ${error instanceof Error ? error.message : String(error)}`);
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
exports.GoogleTTSService = GoogleTTSService;
//# sourceMappingURL=GoogleTTSService.js.map