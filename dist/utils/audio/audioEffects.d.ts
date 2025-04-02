export interface AudioEffect {
    type: 'eq' | 'compress' | 'normalize' | 'reverb';
    params: Record<string, number>;
}
export interface AudioEnhancementOptions {
    normalize?: boolean;
    compression?: {
        threshold: number;
        ratio: number;
    };
    equalization?: {
        bass: number;
        mid: number;
        treble: number;
    };
}
export declare class AudioEnhancer {
    private options;
    constructor(options?: AudioEnhancementOptions);
    /**
     * Enhance audio quality for podcast
     */
    enhance(audioBuffer: Buffer): Promise<Buffer>;
    private normalizeAudio;
    private applyCompression;
    private applyEQ;
}
