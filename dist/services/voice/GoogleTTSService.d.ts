import { IVoiceService, AudioSegment } from './IVoiceService';
export declare class GoogleTTSService implements IVoiceService {
    private ttsClient;
    private storage;
    private voiceSettings;
    constructor(projectId: string);
    generateAudio(text: string, speaker?: string, outputPath?: string): Promise<AudioSegment>;
    combineAudioSegments(segments: AudioSegment[], outputPath: string, pauseDuration?: number): Promise<string>;
}
