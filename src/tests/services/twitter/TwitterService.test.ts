import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { TwitterService } from '../../../services/twitter/TwitterService';
import { TwitterApi } from 'twitter-api-v2';
import type { TweetV2PostTweetResult } from 'twitter-api-v2';

jest.mock('twitter-api-v2');

describe('TwitterService', () => {
  let service: TwitterService;
  const mockBearerToken = 'test-token';
  
  const mockTweet: TweetV2PostTweetResult = {
    data: {
      id: '123456',
      text: 'Test tweet'
    }
  };

  const mockTwitterApi = {
    v2: {
      tweet: jest.fn<(text: string | { text: string; media?: { media_ids: string[] } }) => Promise<TweetV2PostTweetResult>>()
    },
    v1: {
      uploadMedia: jest.fn<(buffer: Buffer, options: { mimeType: string }) => Promise<string>>()
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (TwitterApi as jest.MockedClass<typeof TwitterApi>)
      .mockImplementation(() => mockTwitterApi as unknown as TwitterApi);
    service = new TwitterService(mockBearerToken);
  });

  test('posts tweet successfully', async () => {
    mockTwitterApi.v2.tweet.mockResolvedValueOnce(mockTweet);

    const result = await service.postTweet({ text: 'Test tweet' });

    expect(result).toEqual({
      id: '123456',
      text: 'Test tweet',
      createdAt: expect.any(String)
    });
  });

  test('uploads media and posts tweet', async () => {
    mockTwitterApi.v1.uploadMedia.mockResolvedValueOnce('media123');
    mockTwitterApi.v2.tweet.mockResolvedValueOnce(mockTweet);

    const result = await service.postTweet({
      text: 'Test tweet with media',
      media: {
        imageData: Buffer.from('test'),
        mimeType: 'image/jpeg'
      }
    });

    expect(mockTwitterApi.v1.uploadMedia).toHaveBeenCalled();
    expect(mockTwitterApi.v2.tweet).toHaveBeenCalledWith({
      text: 'Test tweet with media',
      media: { media_ids: ['media123'] }
    });
  });

  test('handles tweet error', async () => {
    mockTwitterApi.v2.tweet.mockRejectedValueOnce(new Error('Tweet failed'));
    await expect(service.postTweet({ text: 'Test tweet' }))
      .rejects.toThrow('Failed to post tweet: Tweet failed');
  });

  test('continues with tweet when media upload fails', async () => {
    mockTwitterApi.v1.uploadMedia.mockRejectedValueOnce(new Error('Upload failed'));
    mockTwitterApi.v2.tweet.mockResolvedValueOnce(mockTweet);

    const result = await service.postTweet({
      text: 'Test tweet with media',
      media: {
        imageData: Buffer.from('test'),
        mimeType: 'image/jpeg'
      }
    });

    expect(mockTwitterApi.v1.uploadMedia).toHaveBeenCalled();
    expect(mockTwitterApi.v2.tweet).toHaveBeenCalledWith({
      text: 'Test tweet with media'
    });
    expect(result.text).toBe('Test tweet');
  });
}); 