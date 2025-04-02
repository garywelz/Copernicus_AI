import { AudioSegment, AudioProcessingOptions } from '../types/audio';
export declare class AudioProcessor {
    static processAudio(audio: AudioSegment, options: AudioProcessingOptions): Promise<AudioSegment>;
    static combineAudioSegments(segments: AudioSegment[]): Promise<AudioSegment>;
    static normalizeAudio(audio: AudioSegment): Promise<AudioSegment>;
}
