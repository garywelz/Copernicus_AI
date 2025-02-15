import type { Podcast } from '../../types/podcast';

export interface WebsiteConfig {
  baseUrl: string;
  apiKey: string;
  podcastPath: string;
}

export class WebsitePublisher {
  constructor(private config: WebsiteConfig) {}

  async publishToWebsite(podcast: Podcast): Promise<string> {
    // Implementation for publishing to your website
    // Could use Next.js API routes
    const response = await fetch(`${this.config.baseUrl}/api/podcasts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(podcast)
    });

    if (!response.ok) {
      throw new Error('Failed to publish to website');
    }

    const { url } = await response.json();
    return url;
  }
} 