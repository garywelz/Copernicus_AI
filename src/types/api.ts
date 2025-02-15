export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface SharePodcastResponse {
  tweetId: string;
  tweetUrl: string;
  mediaUrl?: string;
}

export interface SharePodcastRequest {
  podcast: {
    title: string;
    url: string;
    audioUrl: string;
    duration: number;
  };
} 