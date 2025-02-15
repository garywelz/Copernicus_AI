export interface VoiceSynthesisOptions {
  model: string;
  speed?: number;
  pitch?: number;
  emphasis?: number;
}

export interface AudioSegment {
  audioData: Buffer;
  duration: number;
  speaker: string;
}

export interface IVoiceService {
  synthesize(
    text: string,
    options: VoiceSynthesisOptions
  ): Promise<AudioSegment>;
  
  combineAudio(
    segments: AudioSegment[]
  ): Promise<Buffer>;
} 