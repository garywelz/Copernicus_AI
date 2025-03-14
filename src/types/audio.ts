export interface AudioSegment {
  audioData: Buffer;
  duration: number;
  speaker: string;
}

export interface AudioProcessingOptions {
  fadeInDuration?: number;
  fadeOutDuration?: number;
  pauseDuration?: number;
  backgroundVolume?: number;
  sampleRate?: number;
  bitDepth?: number;
  channels?: number;
  volume?: number;
} 