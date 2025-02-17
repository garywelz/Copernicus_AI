export interface Episode {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
  date: string;
  url: string;
  audioUrl: string;
  isFeatured?: boolean;
}

export type EpisodeList = Episode[]; 