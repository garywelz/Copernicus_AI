export interface Episode {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
  date: string;
  url: string;
  audioUrl?: string;
  isFeatured: boolean;
  subject?: string;
  spotifyUrl: string;
  spotifyUri: string;
  spotifyShowUrl?: string;
  spotifyEmbedUrl?: string;
}

export type EpisodeList = Episode[]; 