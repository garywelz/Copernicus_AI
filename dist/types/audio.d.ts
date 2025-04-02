export type AudioFormat = 'mp3' | 'wav' | 'ogg' | 'm4a';
export interface AudioSegment {
    buffer: Buffer;
    duration: number;
    format: AudioFormat;
    sampleRate: number;
    channels: number;
}
export interface AudioResult {
    buffer: Buffer;
    duration: number;
    format: string;
    sampleRate: number;
    channels: number;
    metadata?: Record<string, any>;
}
export interface AudioProcessingOptions {
    format?: AudioFormat;
    sampleRate?: number;
    channels?: number;
    volume?: number;
    fadeIn?: number;
    fadeOut?: number;
    trim?: {
        start: number;
        end: number;
    };
    normalize?: boolean;
    metadata?: Record<string, unknown>;
}
export interface AudioEnhancementOptions {
    noiseReduction?: boolean;
    echoReduction?: boolean;
    bassBoost?: number;
    trebleBoost?: number;
    reverb?: number;
}
export interface AudioValidationResult {
    isValid: boolean;
    errors?: string[];
    metadata?: {
        duration: number;
        format: AudioFormat;
        sampleRate: number;
        channels: number;
        bitrate?: number;
    };
}
