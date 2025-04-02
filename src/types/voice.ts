import type { AudioSegment, AudioResult, AudioProcessingOptions } from './audio';

export type VoiceProvider = 'google' | 'openai';

export interface VoiceSettings {
  language_code?: string;
  name?: string;
  ssml_gender?: 'MALE' | 'FEMALE' | 'NEUTRAL';
  model?: string;
  voice?: string;
  pitch?: number;
  rate?: number;
  volume?: number;
  language?: string;
  gender?: 'male' | 'female';
}

export interface VoiceConfig {
  host: VoiceSettings;
  expert: VoiceSettings;
  questioner: VoiceSettings;
  voiceId: string;
  settings: VoiceSettings;
  processingOptions?: AudioProcessingOptions;
}

export interface AudioSegment {
  duration: number;
  export(outputPath: string): Promise<void>;
}

export interface AudioResult {
  duration: number;
  url: string;
  metadata?: Record<string, any>;
}

export interface VoiceSynthesisOptions {
  text: string;
  voiceConfig: VoiceConfig;
  format?: string;
  sampleRate?: number;
  channels?: number;
}

export interface IVoiceService {
  synthesize(text: string, options: VoiceSynthesisOptions): Promise<AudioSegment>;
  combineAudioSegments(segments: AudioSegment[], outputPath?: string, pauseDuration?: number): Promise<AudioResult>;
} 