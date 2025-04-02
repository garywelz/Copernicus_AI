import { AudioSegment } from './audio';

export type PodcastType = 'research' | 'news' | 'educational' | 'entertainment';

export interface PodcastSegment {
  id: string;
  content: string;
  speaker: string;
  duration: string;
  tone: string;
  pauseAfter?: boolean;
}

export interface PodcastScript {
  id: string;
  title: string;
  type: PodcastType;
  introduction: string;
  segments: PodcastSegment[];
  conclusion: string;
  totalDuration: string;
  voices: {
    host: string;
    expert: string;
    questioner: string;
  };
  metadata?: Record<string, any>;
}

export interface PodcastOptions {
  type: PodcastType;
  title: string;
  introduction?: string;
  conclusion?: string;
  voices?: {
    host: string;
    expert: string;
    questioner: string;
  };
  metadata?: Record<string, any>;
}

export type PodcastStatus = 'draft' | 'processing' | 'ready' | 'published' | 'failed';

export interface PodcastMetadata {
  title: string;
  description: string;
  author: string;
  language: string;
  subjects: string[];
  keywords: string[];
  license: string;
  createdAt: Date;
  updatedAt: Date;
  duration: number;
  episodeNumber?: number;
  seasonNumber?: number;
  imageUrl?: string;
  transcript?: string;
  chapters?: PodcastChapter[];
  customFields?: Record<string, unknown>;
}

export interface PodcastChapter {
  title: string;
  startTime: number;
  endTime: number;
  description?: string;
  imageUrl?: string;
  url?: string;
}

export interface Podcast {
  id: string;
  userId: string;
  status: PodcastStatus;
  metadata: PodcastMetadata;
  audio: AudioSegment;
  script: string;
  references: Reference[];
  feedback?: PodcastFeedback[];
  analytics?: PodcastAnalytics;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reference {
  id: string;
  title: string;
  authors: string[];
  year: number;
  url: string;
  doi?: string;
  abstract?: string;
  citation?: string;
  relevance?: number;
}

export interface PodcastFeedback {
  id: string;
  userId: string;
  rating: number;
  comment?: string;
  timestamp: Date;
  helpful?: boolean;
}

export interface PodcastAnalytics {
  views: number;
  listens: number;
  downloads: number;
  averageRating: number;
  feedbackCount: number;
  lastUpdated: Date;
} 