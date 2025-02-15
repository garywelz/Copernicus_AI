import type { ITwitterService, TweetOptions } from '../interfaces/ITwitterService';
import type { Podcast } from '../../types/podcast';
import { Logger } from '../../utils/logger';

export class PodcastAnnouncer {
  private twitter: ITwitterService;
  private logger: Logger;

  constructor(twitterService: ITwitterService) {
    this.twitter = twitterService;
    this.logger = new Logger('PodcastAnnouncer');
  }

  async announcePodcast(podcast: Podcast, thumbnailImage?: Buffer): Promise<void> {
    try {
      const tweetText = this.createAnnouncementText(podcast);
      
      const tweetOptions: TweetOptions = {
        text: tweetText,
        ...(thumbnailImage && {
          media: {
            imageData: thumbnailImage,
            mimeType: 'image/jpeg'
          }
        })
      };

      await this.twitter.postTweet(tweetOptions);
      this.logger.info(`Successfully announced podcast: ${podcast.title}`);
    } catch (error) {
      this.logger.error('Failed to announce podcast:', error);
      throw new Error(`Failed to announce podcast: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private createAnnouncementText(podcast: Podcast): string {
    return `🎙️ New AI Research Podcast!

${podcast.title}

Listen now: ${podcast.url}

#AI #Research #Podcast`;
  }
} 