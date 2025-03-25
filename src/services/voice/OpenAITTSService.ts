import OpenAI from 'openai';
import { Readable } from 'stream';
import { VoiceConfig } from '../../types/voice';
import { logger } from '../../utils/logger.js';
import { AudioProcessor } from '../../utils/audio.js';

interface DialogueSegment {
    content: string;
    speaker: string;
    duration?: number;
    pauseAfter?: number;
}

interface PodcastScript {
    title: string;
    introduction: string;
    segments: DialogueSegment[];
    conclusion: string;
}

export class OpenAITTSService {
    private readonly openai: OpenAI;
    private readonly audioProcessor: AudioProcessor;
    private readonly defaultVoices: { [key: string]: VoiceConfig } = {
        host: {
            model: 'tts-1',
            voice: 'onyx',
            speed: 1.0
        },
        expert: {
            model: 'tts-1',
            voice: 'nova',
            speed: 0.95
        },
        questioner: {
            model: 'tts-1',
            voice: 'shimmer',
            speed: 1.0
        },
        correspondent: {
            model: 'tts-1',
            voice: 'echo',
            speed: 1.05
        }
    };

    constructor(apiKey: string) {
        this.openai = new OpenAI({ apiKey });
        this.audioProcessor = new AudioProcessor({
            sampleRate: 44100,
            bitDepth: 16,
            channels: 1
        });
    }

    /**
     * Generate audio for a complete podcast script
     * @param script The podcast script with segments
     * @returns Buffer containing the complete audio
     */
    async generateAudio(script: PodcastScript): Promise<Buffer> {
        try {
            const audioSegments: Buffer[] = [];

            // Generate audio for introduction
            const introAudio = await this.generateSpeech(
                script.introduction,
                this.defaultVoices.host
            );
            audioSegments.push(introAudio);

            // Generate audio for each segment
            for (const segment of script.segments) {
                const voiceConfig = this.defaultVoices[segment.speaker] || this.defaultVoices.host;
                const audio = await this.generateSpeech(segment.content, voiceConfig);
                audioSegments.push(audio);

                // Add pause if specified
                if (segment.pauseAfter) {
                    const pauseBuffer = Buffer.alloc(
                        Math.floor(segment.pauseAfter * 44100 * 2)  // 44.1kHz, 16-bit
                    );
                    audioSegments.push(pauseBuffer);
                }
            }

            // Generate audio for conclusion
            const outroAudio = await this.generateSpeech(
                script.conclusion,
                this.defaultVoices.host
            );
            audioSegments.push(outroAudio);

            // Combine all audio segments
            return Buffer.concat(audioSegments);
        } catch (error) {
            console.error('Error generating podcast audio:', error);
            throw new Error('Failed to generate podcast audio');
        }
    }

    /**
     * Generate speech for a single text segment
     * @param text Text to convert to speech
     * @param voiceConfig Voice configuration
     * @returns Buffer containing the audio
     */
    private async generateSpeech(text: string, voiceConfig: VoiceConfig): Promise<Buffer> {
        try {
            const response = await this.openai.audio.speech.create({
                model: voiceConfig.model,
                voice: voiceConfig.voice,
                input: text,
                speed: voiceConfig.speed
            });

            // Convert response to buffer
            const buffer = await this.streamToBuffer(response);
            return buffer;
        } catch (error) {
            console.error('Error generating speech:', error);
            throw new Error('Failed to generate speech');
        }
    }

    /**
     * Convert a readable stream to a buffer
     */
    private async streamToBuffer(stream: Readable): Promise<Buffer> {
        const chunks: Buffer[] = [];
        
        return new Promise((resolve, reject) => {
            stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            stream.on('error', (err) => reject(err));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
        });
    }

    async generatePause(durationSeconds: number): Promise<Buffer> {
        return this.audioProcessor.generateSilence(durationSeconds);
    }

    async combineAudioSegments(segments: Buffer[]): Promise<Buffer> {
        return this.audioProcessor.concatenateAudio(segments);
    }

    async addBackgroundMusic(speech: Buffer, music: Buffer, musicVolume = 0.1): Promise<Buffer> {
        return this.audioProcessor.mixWithBackground(speech, music, musicVolume);
    }
} 