import { VoiceConfig } from './voice';

export interface PodcastSegment {
  title: string;
  speaker: 'host' | 'expert' | 'questioner';
  text: string;
  duration: number;
}

export interface PodcastScript {
  title: string;
  description: string;
  duration: number;
  style: string;
  complexity: string;
  voices: {
    host: VoiceConfig;
    expert: VoiceConfig;
    questioner: VoiceConfig;
  };
  segments: PodcastSegment[];
  references: Reference[];
}

export interface Reference {
  title: string;
  authors: string[];
  journal: string;
  date: string;
  publisher?: string;
  volume?: string;
  pages?: string;
}

export interface PodcastOptions {
  style: 'conversational' | 'narrative' | 'educational';
  targetDuration: number; // in minutes
  complexity: 'beginner' | 'intermediate' | 'expert';
}

export interface Podcast {
  title: string;
  url: string;
  audioUrl: string;
  duration: number;
}

export interface PodcastFeed {
  title: string;
  description: string;
  language: string;
  episodes: PodcastEpisode[];
}

export interface PodcastEpisode {
  id?: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  duration?: string;
  date?: string;
  url: string;
  audioUrl: string;
} 