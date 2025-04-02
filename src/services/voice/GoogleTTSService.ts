import { TextToSpeechClient, protos } from '@google-cloud/text-to-speech';
import { IVoiceService, VoiceConfig, AudioSegment } from './IVoiceService';
import { Storage } from '@google-cloud/storage';

export class GoogleTTSService implements IVoiceService {
    private ttsClient: TextToSpeechClient;
    private storage: Storage;
    private voiceSettings: VoiceConfig;

    constructor(projectId: string) {
        this.ttsClient = new TextToSpeechClient({ projectId });
        this.storage = new Storage({ projectId });
        
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

    async generateAudio(
        text: string,
        speaker: string = "host",
        outputPath?: string
    ): Promise<AudioSegment> {
        try {
            const voiceConfig = this.voiceSettings[speaker as keyof VoiceConfig] || this.voiceSettings.host;
            
            const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
                input: { text },
                voice: {
                    languageCode: voiceConfig.language_code,
                    name: voiceConfig.name,
                    ssmlGender: voiceConfig.ssml_gender
                },
                audioConfig: {
                    audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
                    speakingRate: 1.0,
                    pitch: 0.0
                }
            };

            const [response] = await this.ttsClient.synthesizeSpeech(request);
            
            if (!response.audioContent) {
                throw new Error('No audio content received from Google TTS');
            }

            // Convert to AudioSegment
            const audioSegment: AudioSegment = {
                duration: 0, // This would need to be calculated from the audio content
                export: (path: string, format: string) => {
                    // Implementation would depend on your audio processing library
                    // For now, we'll just save the raw audio content
                    const bucket = this.storage.bucket('audio-temp');
                    const blob = bucket.file(path);
                    blob.save(response.audioContent as Buffer);
                }
            };

            if (outputPath) {
                audioSegment.export(outputPath, 'mp3');
            }

            return audioSegment;

        } catch (error) {
            throw new Error(`Error generating Google TTS audio: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async combineAudioSegments(
        segments: AudioSegment[],
        outputPath: string,
        pauseDuration: number = 500
    ): Promise<string> {
        try {
            // Implementation would depend on your audio processing library
            // For now, we'll just concatenate the segments
            const bucket = this.storage.bucket('audio-temp');
            const blob = bucket.file(outputPath);
            
            // This is a placeholder - actual implementation would need to handle audio concatenation
            await blob.save(Buffer.from([]));
            
            return outputPath;
            
        } catch (error) {
            throw new Error(`Error combining audio segments: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
} 