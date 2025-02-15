import { PodcastGenerator } from '../../../services/podcast/PodcastGenerator';
import type { AudioSegment } from '../../../services/interfaces/IVoiceService';
import type { PodcastScript } from '../../../types/podcast';
import type { MockedVoiceService } from '../../mocks/mockTypes';
import fs from 'fs/promises';
import { jest, describe, test, expect, beforeEach } from '@jest/globals';

jest.mock('fs/promises');
jest.mock('../../../services/voice/TextToSpeechService');

describe('PodcastGenerator', () => {
  let generator: PodcastGenerator;
  let mockTtsService: MockedVoiceService;

  const mockAudioSegment: AudioSegment = {
    audioData: Buffer.from('test audio'),
    duration: 5,
    speaker: 'en_US-male-medium'
  };

  const mockScript: PodcastScript = {
    title: 'Test Podcast',
    introduction: 'Welcome to the show',
    segments: [
      {
        title: 'Main Point',
        content: 'First main point',
        speaker: 'en_US-male-medium'
      }
    ],
    conclusion: 'Thanks for listening',
    targetDuration: 10,
    complexity: 'intermediate'
  };

  beforeEach(() => {
    mockTtsService = {
      synthesize: jest.fn().mockResolvedValue(mockAudioSegment),
      setBackgroundMusic: jest.fn().mockResolvedValue(undefined),
      combineAudio: jest.fn().mockResolvedValue(Buffer.from('combined audio'))
    };

    generator = new PodcastGenerator(mockTtsService);
  });

  test('generates complete podcast audio', async () => {
    const result = await generator.generatePodcast(mockScript);
    expect(result).toBeDefined();
    expect(mockTtsService.synthesize).toHaveBeenCalledTimes(3); // intro + segment + conclusion
  });

  test('handles file system errors', async () => {
    const mockReadFile = jest.spyOn(fs, 'readFile')
      .mockRejectedValue(new Error('File not found'));

    await expect(generator.generatePodcast(mockScript))
      .rejects.toThrow('Failed to generate podcast audio');
  });

  test('handles TTS service errors', async () => {
    mockTtsService.synthesize.mockRejectedValue(new Error('TTS failed'));
    await expect(generator.generatePodcast(mockScript))
      .rejects.toThrow('Failed to generate podcast audio');
  });
}); 