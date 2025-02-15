import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { ArxivService } from '../../services/arxiv/ArxivService';
import type { ArxivSearchParams } from '../../types/arxiv';
import { MockHeaders } from '../mocks/mockHeaders';

jest.mock('node-fetch', () => ({
  default: jest.fn()
}));

describe('ArxivService', () => {
  let service: ArxivService;
  let mockFetch: jest.SpyInstance;

  const mockXmlResponse = `
    <?xml version="1.0" encoding="UTF-8"?>
    <feed>
      <entry>
        <title>Test Paper</title>
        <author><name>Test Author</name></author>
        <published>2024-01-01T00:00:00Z</published>
        <summary>Test summary</summary>
        <id>http://arxiv.org/abs/1234.5678</id>
      </entry>
    </feed>
  `;

  beforeEach(() => {
    service = new ArxivService();
    mockFetch = jest.spyOn(global, 'fetch').mockImplementation(async () => ({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: async () => mockXmlResponse,
      headers: new MockHeaders(),
      url: 'test-url',
      redirected: false,
      type: 'default' as ResponseType,
      body: null,
      bodyUsed: false,
      bytes: () => Promise.resolve(new Uint8Array()),
      clone: function() { return this; },
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
      json: async () => ({})
    }));
  });

  test('parses XML response correctly', async () => {
    const result = await service.searchPapers({ search_query: 'test' });

    expect(result.success).toBe(true);
    expect(result.papers).toBeDefined();
    expect(result.papers![0].title).toBe('Test Paper');
  });

  test('handles API errors', async () => {
    mockFetch.mockImplementationOnce(async () => ({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      text: async () => 'Error',
      headers: new MockHeaders(),
      url: 'test-url',
      redirected: false,
      type: 'default' as ResponseType,
      body: null,
      bodyUsed: false,
      bytes: () => Promise.resolve(new Uint8Array()),
      clone: function() { return this; },
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
      json: async () => ({})
    }));

    const result = await service.searchPapers({ search_query: 'test' });
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
}); 