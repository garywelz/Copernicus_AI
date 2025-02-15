import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { PodcastGenerationService } from '../../../services/podcast/PodcastGenerationService';
import type { CompletionResponse, CompletionOptions } from '../../../services/interfaces/ILLMService';
import type { AudioSegment, VoiceSynthesisOptions } from '../../../services/interfaces/IVoiceService';
import type { MockedLLMService, MockedVoiceService } from '../../mocks/mockTypes';
import type { PaperAnalysis } from '../../../types/paper';
import type { PodcastOptions } from '../../../types/podcast';

describe('PodcastGenerationService', () => {
  let service: PodcastGenerationService;
  let mockLlmService: MockedLLMService;
  let mockTtsService: MockedVoiceService;

  const mockAudioSegment: AudioSegment = {
    audioData: Buffer.from('test audio'),
    duration: 5,
    speaker: 'en_US-male-medium'
  };

  const mockAnalysis: PaperAnalysis = {
    summary: 'Test summary',
    keyPoints: ['Point 1', 'Point 2']
  };

  const mockCompletionResponse: CompletionResponse = {
    text: 'Test response'
  };

  beforeEach(() => {
    mockLlmService = {
      generateCompletion: jest.fn<(prompt: string, options?: CompletionOptions) => Promise<CompletionResponse>>()
        .mockResolvedValue(mockCompletionResponse),
      generateStructuredOutput: jest.fn<(prompt: string, schema: any, options?: CompletionOptions) => Promise<any>>()
        .mockResolvedValue({
          sections: [{ text: 'Test content' }]
        })
    };

    mockTtsService = {
      synthesize: jest.fn<(text: string, options: VoiceSynthesisOptions) => Promise<AudioSegment>>()
        .mockResolvedValue(mockAudioSegment),
      setBackgroundMusic: jest.fn<(audioData: Buffer) => Promise<void>>()
        .mockResolvedValue(undefined),
      combineAudio: jest.fn<(segments: AudioSegment[]) => Promise<Buffer>>()
        .mockResolvedValue(Buffer.from('combined audio'))
    };

    service = new PodcastGenerationService(mockLlmService, mockTtsService);
  });

  test('generates podcast successfully', async () => {
    const result = await service.generatePodcast('Test topic');
    expect(result).toBeDefined();
    expect(mockLlmService.generateStructuredOutput).toHaveBeenCalled();
    expect(mockTtsService.synthesize).toHaveBeenCalled();
  });

  test('handles generation errors', async () => {
    mockLlmService.generateStructuredOutput.mockRejectedValue(new Error('LLM error'));
    await expect(service.generatePodcast('Test topic'))
      .rejects.toThrow('LLM error');
  });
}); 