export interface Episode {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
  date: string;
  url: string;
  audioUrl: string;
  videoUrl?: string | null;
  descriptUrl?: string | null;
  isFeatured?: boolean;
  transcript?: string;
}

export type EpisodeList = Episode[]; 