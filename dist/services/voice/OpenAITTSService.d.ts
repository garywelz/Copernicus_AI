import { IVoiceService, AudioSegment } from './IVoiceService';
export declare class OpenAITTSService implements IVoiceService {
    private openai;
    private storage;
    private voiceSettings;
    constructor(apiKey: string, projectId: string);
    generateAudio(text: string, speaker?: string, outputPath?: string): Promise<AudioSegment>;
    combineAudioSegments(segments: AudioSegment[], outputPath: string, pauseDuration?: number): Promise<string>;
}
