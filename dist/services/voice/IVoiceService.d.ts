import { AudioSegment, AudioResult, VoiceSettings } from '../../types/voice';
export interface IVoiceService {
    generateAudio(text: string, speaker?: keyof VoiceSettings): Promise<AudioResult>;
    combineAudioSegments(segments: AudioSegment[], outputPath?: string, pauseDuration?: number): Promise<AudioResult>;
}
