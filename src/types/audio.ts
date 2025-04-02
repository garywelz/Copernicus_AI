import { ServiceConfig } from './service';

/**
 * Audio service configuration
 */
export interface AudioServiceConfig extends ServiceConfig {
  audio: {
    sampleRate: number;
    bitDepth: number;
    channels: number;
    format: 'mp3' | 'wav';
    quality: number;
    outputDir: string;
    tempDir: string;
  };
  elevenLabs: {
    apiKey: string;
    baseUrl: string;
    voiceId: string;
    modelId: string;
  };
}

/**
 * Audio generation options
 */
export interface AudioGenerationOptions {
  text: string;
  voiceId?: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

/**
 * Audio processing options
 */
export interface AudioProcessingOptions {
  normalize?: boolean;
  trim?: boolean;
  fadeIn?: number;
  fadeOut?: number;
  volume?: number;
  effects?: AudioEffect[];
}

/**
 * Audio effect types
 */
export type AudioEffect = {
  type: 'reverb' | 'echo' | 'compression' | 'equalizer';
  params: Record<string, number>;
};

/**
 * Audio file metadata
 */
export interface AudioMetadata {
  duration: number;
  sampleRate: number;
  bitDepth: number;
  channels: number;
  format: string;
  size: number;
  bitrate: number;
}

/**
 * Audio generation result
 */
export interface AudioGenerationResult {
  filePath: string;
  metadata: AudioMetadata;
  processingTime: number;
  cost: number;
}

/**
 * Audio processing result
 */
export interface AudioProcessingResult {
  filePath: string;
  metadata: AudioMetadata;
  processingTime: number;
  effects: AudioEffect[];
}

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