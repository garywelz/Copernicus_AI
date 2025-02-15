export interface PodcastSegment {
  title: string;
  content: string;
  duration?: number;
  speaker: string;
  pauseAfter?: boolean;
}

export interface PodcastScript {
  title: string;
  introduction: string;
  segments: PodcastSegment[];
  conclusion: string;
  totalDuration?: number;
  targetDuration: number;
  complexity: 'beginner' | 'intermediate' | 'advanced';
}

export interface PodcastOptions {
  style: 'conversational' | 'narrative' | 'educational';
  targetDuration: number; // in minutes
  complexity: 'beginner' | 'intermediate' | 'advanced';
}

export interface Podcast {
  title: string;
  url: string;
  audioUrl: string;
  duration: number;
} 