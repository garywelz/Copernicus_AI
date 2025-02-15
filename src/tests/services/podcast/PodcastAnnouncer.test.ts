import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { PodcastAnnouncer } from '../../../services/podcast/PodcastAnnouncer';
import type { ITwitterService, TweetOptions, TweetResponse } from '../../../services/interfaces/ITwitterService';
import type { Podcast } from '../../../types/podcast';

jest.mock('../../../utils/logger');

describe('PodcastAnnouncer', () => {
  let announcer: PodcastAnnouncer;
  let mockTwitterService: jest.Mocked<ITwitterService>;

  const mockPodcast: Podcast = {
    title: 'Test Podcast',
    url: 'https://example.com/podcast/123',
    duration: 300,
    audioUrl: 'https://example.com/audio/123.mp3'
  };

  const mockTweetResponse: TweetResponse = {
    id: '123456',
    text: 'Test tweet',
    createdAt: new Date().toISOString()
  };

  beforeEach(() => {
    mockTwitterService = {
      postTweet: jest.fn<(options: TweetOptions) => Promise<TweetResponse>>()
        .mockResolvedValue(mockTweetResponse)
    };

    announcer = new PodcastAnnouncer(mockTwitterService);
  });

  test('announces podcast successfully', async () => {
    await announcer.announcePodcast(mockPodcast);

    expect(mockTwitterService.postTweet).toHaveBeenCalledWith({
      text: expect.stringContaining(mockPodcast.title)
    });
  });

  test('announces podcast with thumbnail', async () => {
    const mockThumbnail = Buffer.from('test-image');

    await announcer.announcePodcast(mockPodcast, mockThumbnail);

    expect(mockTwitterService.postTweet).toHaveBeenCalledWith({
      text: expect.stringContaining(mockPodcast.title),
      media: {
        imageData: mockThumbnail,
        mimeType: 'image/jpeg'
      }
    });
  });

  test('handles announcement error', async () => {
    mockTwitterService.postTweet.mockRejectedValue(new Error('Tweet failed'));

    await expect(announcer.announcePodcast(mockPodcast))
      .rejects.toThrow('Failed to announce podcast: Tweet failed');
  });

  test('creates correct announcement text', async () => {
    await announcer.announcePodcast(mockPodcast);

    expect(mockTwitterService.postTweet).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringMatching(/🎙️ New AI Research Podcast!.*Test Podcast.*Listen now:.*#AI #Research #Podcast/s)
      })
    );
  });
}); 