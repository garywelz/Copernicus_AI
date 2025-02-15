// src/tests/services/OpenRouterService.test.ts
import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { OpenRouterService } from '../../services/llm/OpenRouterService';
import type { CompletionOptions } from '../../services/interfaces/ILLMService';
import type { ResearchPaper, AnalyzeOptions } from '../../types/paper';
import { Response } from 'node-fetch';
import { MockHeaders } from '../mocks/mockHeaders';

jest.mock('node-fetch', () => ({
  default: jest.fn()
}));

describe('OpenRouterService', () => {
  let service: OpenRouterService;
  let mockFetch: jest.SpyInstance;

  const mockApiKey = 'test-api-key';
  const mockResponse = {
    choices: [{
      message: {
        content: 'Test response'
      }
    }]
  };

  beforeEach(() => {
    service = new OpenRouterService(mockApiKey);
    const mockResponseObj = new Response(
      JSON.stringify(mockResponse),
      {
        status: 200,
        statusText: 'OK',
        headers: new MockHeaders()
      }
    );

    mockFetch = jest.spyOn(global, 'fetch')
      .mockResolvedValue(mockResponseObj);
  });

  afterEach(() => {
    mockFetch.mockRestore();
  });

  test('generates completion successfully', async () => {
    const result = await service.generateCompletion('Test prompt');
    expect(result.text).toBe('Test response');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/chat/completions'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': `Bearer ${mockApiKey}`
        })
      })
    );
  });

  test('generates structured output successfully', async () => {
    const schema = {
      type: 'object',
      properties: {
        test: { type: 'string' }
      }
    };

    const result = await service.generateStructuredOutput('Test prompt', schema);
    expect(result).toBeDefined();
  });

  test('handles API errors', async () => {
    const errorResponseObj = new Response(
      JSON.stringify({ error: 'Test error' }),
      {
        status: 400,
        statusText: 'Bad Request',
        headers: new MockHeaders()
      }
    );
    mockFetch.mockResolvedValueOnce(errorResponseObj);

    await expect(
      service.generateCompletion('Test prompt')
    ).rejects.toThrow('OpenRouter API request failed: Bad Request');
  });

  describe('analyzePaper', () => {
    const mockPaper: ResearchPaper = {
      title: 'Test Paper',
      authors: ['Test Author'],
      content: 'Test content'
    };

    const mockOptions: AnalyzeOptions = {
      depth: 'quick' as const,
      outputFormat: 'summary' as const
    };

    const mockAnalysisResponse = {
      summary: 'Test summary',
      keyPoints: ['Point 1', 'Point 2']
    };

    beforeEach(() => {
      const analysisResponseObj = new Response(
        JSON.stringify(mockAnalysisResponse),
        {
          status: 200,
          statusText: 'OK',
          headers: new MockHeaders()
        }
      );
      mockFetch.mockResolvedValue(analysisResponseObj);
    });

    test('should make correct API call', async () => {
      await service.analyzePaper(mockPaper, mockOptions);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.openrouter.ai/api/v1/analyze',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${mockApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ paper: mockPaper, options: mockOptions })
        })
      );
    });

    test('should return analysis response', async () => {
      const result = await service.analyzePaper(mockPaper, mockOptions);
      expect(result).toEqual(mockAnalysisResponse);
    });

    test('handles API errors', async () => {
      const errorResponseObj = new Response(
        JSON.stringify({ error: 'Analysis Failed' }),
        {
          status: 400,
          statusText: 'Analysis Failed',
          headers: new MockHeaders()
        }
      );
      mockFetch.mockResolvedValueOnce(errorResponseObj);

      await expect(
        service.analyzePaper(mockPaper, mockOptions)
      ).rejects.toThrow('API request failed: Analysis Failed');
    });
  });

  describe('generateStructuredOutput', () => {
    const mockPrompt = 'Test prompt';
    const mockSchema = { type: 'object', properties: { test: { type: 'string' } } };
    const mockStructuredResponse = { test: 'structured output' };

    test('should make correct API call', async () => {
      const structuredResponseObj = new Response(
        JSON.stringify(mockStructuredResponse),
        {
          status: 200,
          statusText: 'OK',
          headers: new MockHeaders()
        }
      );
      mockFetch.mockResolvedValueOnce(structuredResponseObj);

      await service.generateStructuredOutput(mockPrompt, mockSchema);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.openrouter.ai/api/v1/structured',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining(mockPrompt)
        })
      );
    });

    test('should handle API errors', async () => {
      const errorResponseObj = new Response(
        JSON.stringify({ error: 'Structured Output Failed' }),
        {
          status: 400,
          statusText: 'Structured Output Failed',
          headers: new MockHeaders()
        }
      );
      mockFetch.mockResolvedValueOnce(errorResponseObj);

      await expect(
        service.generateStructuredOutput(mockPrompt, mockSchema)
      ).rejects.toThrow('API request failed: Structured Output Failed');
    });
  });
});
