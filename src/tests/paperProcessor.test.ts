import { describe, expect, test, beforeEach } from '@jest/globals';
import { processPaper, cleanupCache } from '../services/paperProcessor';
import type { ResearchPaper, AnalyzeOptions } from '../types/paper';

jest.mock('../services/llm/OpenRouterService');

describe('paperProcessor', () => {
  const mockPaper: ResearchPaper = {
    title: 'Test Paper',
    content: 'Test content',
    authors: ['Test Author']
  };

  const mockOptions: AnalyzeOptions = {
    depth: 'quick',
    outputFormat: 'summary'
  };

  beforeEach(() => {
    cleanupCache();
  });

  test('processes paper successfully', async () => {
    const result = await processPaper(mockPaper, mockOptions, 'test-api-key');
    expect(result).toBeDefined();
    expect(result.summary).toBeDefined();
    expect(result.keyPoints).toBeDefined();
  });

  test('handles missing API key', async () => {
    await expect(processPaper(mockPaper, {}, '')).rejects.toThrow('API key is required');
  });
}); 