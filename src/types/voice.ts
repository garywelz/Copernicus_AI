export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
  volume: number;
}

export interface VoiceSynthesisOptions {
  model: string;
  speed?: number;
  settings?: VoiceSettings;
}

export interface VoiceConfig {
  id: string;
  settings?: VoiceSettings;
} 