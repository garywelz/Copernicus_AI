// src/tests/analyzePaper.test.ts
import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { analyzePaperAction } from '../actions/analyzePaper';
import { IAgentRuntime, ModelProviderName } from '@elizaos/core';
import { processPaper } from '../services/paperProcessor';
import { ResearchPaper, AnalyzeOptions, PaperAnalysis } from '../types/paper';
import { SpyInstance } from 'jest-mock';
import { analyzePaper } from '../services/paperAnalyzer';

type CallbackFunction = (response: {
  success?: boolean;
  error?: string;
  analysis?: PaperAnalysis;
  citation?: string;
}) => void;

// Remove the inline mock since we're using the mock module
// jest.mock('@elizaos/core', () => ({...}));

// Mock paperProcessor
jest.mock('../services/paperProcessor');
const mockProcessPaper = jest.fn() as jest.MockedFunction<typeof processPaper>;

describe('analyzePaperAction', () => {
  const mockApiKey = 'test-api-key';
  
  const mockRuntime: Partial<IAgentRuntime> = {
    character: {
      name: 'MockAgent',
      modelProvider: ModelProviderName.OPENROUTER as const,
      bio: ['A test character'],
      lore: [],
      messageExamples: [],
      postExamples: [],
      topics: [],
      adjectives: [],
      style: {
        all: [],
        chat: [],
        post: [],
      },
      clients: [],
      plugins: [],
      settings: {
        secrets: {
          OPENROUTER_API_KEY: mockApiKey,
        },
      },
    },
  };

  const mockPaper: ResearchPaper = {
    title: 'Mock Title',
    authors: ['Mock Author'],
    content: 'Mock content for testing.'
  };

  const mockMemory = {
    userId: '00000000-0000-0000-0000-000000000000',
    agentId: '00000000-0000-0000-0000-000000000001',
    roomId: '00000000-0000-0000-0000-000000000002',
    content: mockPaper
  };

  const mockAnalysis: PaperAnalysis = {
    summary: 'Test summary',
    keyPoints: ['Point 1']
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockProcessPaper.mockResolvedValue(mockAnalysis);
  });

  describe('successful execution', () => {
    test('processes paper with valid inputs', async () => {
      const options: AnalyzeOptions = {
        depth: 'quick' as const,
        outputFormat: 'summary' as const
      };
      
      const callback = jest.fn() as jest.MockedFunction<CallbackFunction>;
      
      await analyzePaperAction.handler(
        mockRuntime as IAgentRuntime,
        mockMemory,
        {},
        options,
        callback
      );

      expect(processPaper).toHaveBeenCalledWith(
        mockPaper,
        options,
        mockApiKey
      );

      expect(callback).toHaveBeenCalledWith({
        success: true,
        analysis: mockAnalysis,
        citation: expect.any(String)
      });
    });
  });

  describe('error handling', () => {
    test('handles missing API key', async () => {
      const runtimeWithoutApiKey = {
        ...mockRuntime,
        character: {
          ...mockRuntime.character,
          settings: { secrets: {} },
        },
      };
      
      const callback = jest.fn() as jest.MockedFunction<CallbackFunction>;
      
      await analyzePaperAction.handler(
        runtimeWithoutApiKey as IAgentRuntime,
        mockMemory,
        {},
        {},
        callback
      );
      
      expect(callback).toHaveBeenCalledWith({
        error: 'Missing API key for analysis service.'
      });
      expect(processPaper).not.toHaveBeenCalled();
    });

    test('handles processing errors', async () => {
      mockProcessPaper.mockRejectedValue(new Error('Processing failed'));
      
      const callback = jest.fn() as jest.MockedFunction<CallbackFunction>;
      
      await analyzePaperAction.handler(
        mockRuntime as IAgentRuntime,
        mockMemory,
        {},
        {},
        callback
      );
      
      expect(callback).toHaveBeenCalledWith({
        success: false,
        error: 'Failed to analyze the paper.'
      });
    });
  });
});

describe('analyzePaper', () => {
  const mockPaper: ResearchPaper = {
    title: 'Test Paper',
    authors: ['Test Author'],
    content: 'Test content'
  };

  const mockAnalysis: PaperAnalysis = {
    summary: 'Test summary',
    keyPoints: ['Point 1', 'Point 2']
  };

  beforeEach(() => {
    process.env.OPENROUTER_API_KEY = 'test-key';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('analyzes paper successfully', async () => {
    const result = await analyzePaper(mockPaper);
    expect(result).toBeDefined();
    expect(result.summary).toBeTruthy();
    expect(Array.isArray(result.keyPoints)).toBe(true);
  });

  test('handles missing API key', async () => {
    delete process.env.OPENROUTER_API_KEY;
    await expect(analyzePaper(mockPaper))
      .rejects.toThrow('OpenRouter API key not found');
  });

  test('handles analysis options', async () => {
    const result = await analyzePaper(mockPaper, {
      depth: 'detailed',
      outputFormat: 'structured'
    });
    expect(result).toBeDefined();
  });
});
