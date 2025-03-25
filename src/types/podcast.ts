import { VoiceConfig } from './voice';

export type PodcastType = 'research' | 'news';

export type SpeakerRole = 'host' | 'expert' | 'questioner' | 'correspondent';

export interface PodcastSegment {
  title: string;
  content: string;
  speaker: SpeakerRole;
  duration?: number;
  pauseAfter?: boolean;
}

export interface PodcastScript {
  title: string;
  introduction: string;
  segments: PodcastSegment[];
  conclusion: string;
  references: string[];
  hashtags: string[];
  totalDuration?: number;
}

export interface PodcastOptions {
  type: PodcastType;
  subject: string;
  targetDuration: number;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  style?: 'conversational' | 'formal' | 'educational';
}

export interface PodcastMetadata {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
  date: string;
  url: string;
  audioUrl: string;
  subject: string;
  type: PodcastType;
  references: string[];
  hashtags: string[];
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