import { IVoiceService } from '../../../../../services/voice/IVoiceService';
import { AudioResult, AudioSegment } from '../../../../../types/voice';
export declare class MockVoiceService implements IVoiceService {
    private mockResults;
    private mockSegments;
    constructor();
    generateAudio(text: string, speaker?: string): Promise<AudioResult>;
    combineAudioSegments(segments: AudioSegment[], outputPath?: string, pauseDuration?: number): Promise<AudioResult>;
    setMockResult(text: string, result: AudioResult): void;
    getMockSegments(): AudioSegment[];
}
