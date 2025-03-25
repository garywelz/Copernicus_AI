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
  role: string;
  model: 'tts-1' | 'tts-1-hd';
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  speed: number;
}

export interface VoiceOptions {
  host: VoiceConfig;
  expert: VoiceConfig;
  questioner: VoiceConfig;
  correspondent: VoiceConfig;
}

export const DEFAULT_VOICES: VoiceOptions = {
  host: {
    role: 'Main host and narrator',
    model: 'tts-1-hd',
    voice: 'nova',
    speed: 1.0
  },
  expert: {
    role: 'Subject matter expert',
    model: 'tts-1',
    voice: 'onyx',
    speed: 0.95
  },
  questioner: {
    role: 'Asks clarifying questions',
    model: 'tts-1',
    voice: 'echo',
    speed: 0.98
  },
  correspondent: {
    role: 'News correspondent',
    model: 'tts-1',
    voice: 'shimmer',
    speed: 1.0
  }
}; 