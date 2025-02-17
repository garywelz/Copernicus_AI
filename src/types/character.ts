export interface VoiceConfig {
  model: string;
  role: string;
}

export interface CharacterVoices {
  host: VoiceConfig;
  expert: VoiceConfig;
  questioner: VoiceConfig;
  [key: string]: VoiceConfig;  // Index signature for other roles
}

export interface CharacterSettings {
  secrets: Record<string, unknown>;
  voice: {
    model: string;
  };
}

export interface CharacterData {
  name: string;
  clients: string[];
  modelProvider: string;
  settings: CharacterSettings;
  plugins: string[];
  bio: string[];
  voices: CharacterVoices;
  podcastStyle: Record<string, unknown>;
} 