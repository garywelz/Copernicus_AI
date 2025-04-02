import type { IVoiceService, VoiceSynthesisOptions, AudioSegment } from '../interfaces/IVoiceService';
import { AudioProcessingOptions } from '../../utils/audio';
import { AudioEnhancementOptions } from '../../utils/audioEffects';
export interface VoiceConfig {
    voiceId: string;
    name: string;
    style?: number;
    stability?: number;
    similarity_boost?: number;
    speaking_rate?: number;
    description?: string;
}
export declare class ElevenLabsService implements IVoiceService {
    private apiKey;
    private processingOptions;
    private enhancementOptions;
    private readonly audioProcessor;
    private readonly audioEnhancer;
    private backgroundMusic?;
    private voiceMap;
    constructor(apiKey: string, processingOptions?: AudioProcessingOptions, enhancementOptions?: AudioEnhancementOptions);
    private convertToMp3;
    synthesize(text: string, options: VoiceSynthesisOptions): Promise<AudioSegment>;
    private processAudioSegment;
    setBackgroundMusic(musicBuffer: Buffer): Promise<void>;
    combineAudio(segments: AudioSegment[]): Promise<Buffer>;
    private getAudioDuration;
    private getVoiceSettings;
    setVoice(key: string, config: VoiceConfig): void;
    getAvailableVoices(): Map<string, VoiceConfig>;
    generatePodcastEpisode(topic: string, outline: string): Promise<Buffer<ArrayBufferLike>>;
    private generateScript;
    private generateAudioSegments;
}
