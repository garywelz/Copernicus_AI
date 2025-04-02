import { AudioProcessingOptions as AudioOptions } from '../types/audio';
import { Buffer } from 'buffer';
export interface AudioProcessingOptions {
    sampleRate?: number;
    bitDepth?: number;
    channels?: number;
    fadeInDuration?: number;
    fadeOutDuration?: number;
    pauseDuration?: number;
    backgroundVolume?: number;
    volume?: number;
}
export declare class AudioProcessor {
    private sampleRate;
    private bitDepth;
    private channels;
    private bytesPerSample;
    constructor(options?: AudioOptions);
    /**
     * Add a pause between segments
     */
    addPause(duration: number): Buffer;
    /**
     * Add fade in/out effects to audio
     */
    applyFade(audio: Buffer, fadeInDuration?: number, fadeOutDuration?: number): Buffer;
    /**
     * Mix background music with speech
     */
    mixWithBackground(speech: Buffer, background: Buffer, backgroundVolume?: number): Buffer;
    private applyGainToFrame;
    private mixFrames;
    concatenateAudio(audioBuffers: Buffer[]): Promise<Buffer>;
    loadBackgroundTrack(trackPath: string): Promise<Buffer>;
    loopBackgroundTrack(track: Buffer, duration: number): Promise<Buffer>;
    /**
     * Normalize audio to a consistent volume level
     * @param audio Input audio buffer
     * @returns Normalized audio buffer
     */
    normalizeAudio(audio: Buffer): Buffer;
    processAudio(audioBuffer: Buffer): Promise<Buffer>;
}
/**
 * Combines multiple audio buffers into a single buffer
 */
export declare function combineAudioBuffers(buffers: Buffer[]): Buffer;
/**
 * Creates a silence buffer of specified duration
 * @param durationMs Duration in milliseconds
 * @param sampleRate Sample rate (default 44100)
 */
export declare function createSilence(durationMs: number, sampleRate?: number): Buffer;
/**
 * Normalizes audio levels across multiple segments
 */
export declare function normalizeAudio(buffer: Buffer): Buffer;
