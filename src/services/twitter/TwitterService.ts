import { TwitterApi } from 'twitter-api-v2';
import type { ITwitterService, TweetOptions, TweetResponse } from '../interfaces/ITwitterService';
import { logger } from '../../utils/logger';
import { sleep } from '../../utils/async';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_TWEETS_PER_WINDOW = 300;

export class TwitterService implements ITwitterService {
  private client: TwitterApi;
  private tweetCount: number = 0;
  private windowStart: number = Date.now();

  constructor(
    apiKey: string,
    apiSecret: string,
    accessToken: string,
    accessSecret: string
  ) {
    this.client = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken: accessToken,
      accessSecret: accessSecret,
    });
  }

  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    if (now - this.windowStart >= RATE_LIMIT_WINDOW) {
      // Reset window
      this.windowStart = now;
      this.tweetCount = 0;
    } else if (this.tweetCount >= MAX_TWEETS_PER_WINDOW) {
      const waitTime = RATE_LIMIT_WINDOW - (now - this.windowStart);
      logger.warn(`Rate limit reached, waiting ${waitTime}ms`);
      await sleep(waitTime);
      this.windowStart = Date.now();
      this.tweetCount = 0;
    }
  }

  private async retryOperation<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error | undefined;
    
    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        if (error instanceof Error && error.message.includes('Rate limit')) {
          await sleep(RETRY_DELAY * Math.pow(2, i));
          continue;
        }
        throw error;
      }
    }
    
    throw lastError || new Error('Operation failed after retries');
  }

  async postTweet(options: TweetOptions): Promise<TweetResponse> {
    await this.checkRateLimit();
    
    try {
      let mediaIds: string[] = [];

      if (options.media?.imageData) {
        const mediaId = await this.retryOperation(() => 
          this.client.v1.uploadMedia(
            options.media!.imageData,
            { mimeType: options.media!.mimeType }
          )
        );
        mediaIds.push(mediaId);
        logger.info('Media uploaded successfully');
      }

      const tweet = await this.retryOperation(() =>
        this.client.v2.tweet({
          text: options.text,
          ...(mediaIds.length > 0 && { media: { media_ids: mediaIds } })
        })
      );

      this.tweetCount++;
      
      return {
        id: tweet.data.id,
        text: tweet.data.text,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Failed to post tweet:', error);
      throw new Error(`Failed to post tweet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async uploadMedia(imageData: Buffer, mimeType: string): Promise<string> {
    const media = await this.client.v1.uploadMedia(imageData, { mimeType });
    return media;
  }

  async threadTweets(tweets: string[]): Promise<TweetResponse[]> {
    const responses: TweetResponse[] = [];
    let lastTweetId: string | undefined;

    for (const tweetText of tweets) {
      const response = await this.postTweet({
        text: tweetText,
        ...(lastTweetId && { replyToTweetId: lastTweetId })
      });
      
      responses.push(response);
      lastTweetId = response.id;
    }

    return responses;
  }
} 