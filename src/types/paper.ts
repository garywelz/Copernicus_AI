export interface ResearchPaper {
  title: string;
  authors: string[];
  content: string;
  doi?: string;
  publicationDate?: string;
  journal?: string;
}

export interface PaperAnalysis {
  summary: string;
  keyPoints: string[];
  paradigmShifts?: string[];
  connections?: {
    field: string;
    insight: string;
  }[];
  podcastRecommendations?: {
    title: string;
    angle: string;
    estimatedDuration: number;
  }[];
}

export interface AnalyzeOptions {
  focusAreas?: string[];
  depth?: 'quick' | 'detailed' | 'comprehensive';
  outputFormat?: 'podcast' | 'summary' | 'technical';
} 