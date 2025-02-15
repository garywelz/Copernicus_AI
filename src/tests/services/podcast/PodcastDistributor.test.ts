import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { PodcastDistributor } from '../../../services/podcast/PodcastDistributor';
import type { ITwitterService } from '../../../services/interfaces/ITwitterService';
import { AudioProcessor } from '../../../utils/audio';
import { exec } from 'child_process';
import fs from 'fs/promises';

jest.mock('child_process');
jest.mock('fs/promises');

describe('PodcastDistributor', () => {
  let distributor: PodcastDistributor;
  let mockTwitterService: jest.Mocked<ITwitterService>;
  let mockAudioProcessor: jest.Mocked<AudioProcessor>;

  const mockPodcast = {
    title: 'Test Podcast',
    url: 'https://example.com/podcast/123',
    audioUrl: 'https://example.com/audio/123.mp3',
    duration: 300
  };

  beforeEach(() => {
    mockTwitterService = {
      postTweet: jest.fn().mockResolvedValue({ id: '123', text: 'Test', createdAt: new Date().toISOString() })
    };

    mockAudioProcessor = {
      normalizeAudio: jest.fn().mockReturnValue(Buffer.from('test')),
      addPause: jest.fn().mockReturnValue(Buffer.from('test')),
      concatenateAudio: jest.fn().mockResolvedValue(Buffer.from('test'))
    } as any;

    distributor = new PodcastDistributor(mockTwitterService, mockAudioProcessor);
  });

  test('shares podcast to Twitter successfully', async () => {
    const mockExec = exec as jest.MockedFunction<typeof exec>;
    mockExec.mockImplementation((cmd, callback) => {
      callback?.(null, { stdout: '', stderr: '' });
      return {} as any;
    });

    await distributor.shareToTwitter(mockPodcast);

    expect(mockTwitterService.postTweet).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining(mockPodcast.title),
        media: expect.objectContaining({
          mimeType: 'video/mp4'
        })
      })
    );
  });

  test('handles errors gracefully', async () => {
    mockTwitterService.postTweet.mockRejectedValue(new Error('Tweet failed'));

    await expect(distributor.shareToTwitter(mockPodcast))
      .rejects.toThrow('Failed to share podcast to Twitter');
  });
}); 