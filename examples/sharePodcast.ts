import type { ApiResponse, SharePodcastResponse, SharePodcastRequest } from '../src/types/api';

export async function sharePodcast(podcast: SharePodcastRequest['podcast']): Promise<SharePodcastResponse> {
  const response = await fetch('/api/podcasts/share', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ podcast })
  });

  const result = await response.json() as ApiResponse<SharePodcastResponse>;

  if (!result.success) {
    throw new Error(result.error || result.message);
  }

  return result.data!;
}

// Make this file a module
export {};

// Usage example:
async function main() {
  try {
    const result = await sharePodcast({
      title: "Understanding AI Research",
      url: "https://example.com/podcasts/123",
      audioUrl: "https://example.com/audio/123.mp3",
      duration: 1800 // 30 minutes
    });
    
    console.log('Podcast shared successfully');
    console.log('Tweet URL:', result.tweetUrl);
  } catch (error) {
    console.error('Error sharing podcast:', error);
  }
}

// Only run if this file is being executed directly
if (require.main === module) {
  main();
} 