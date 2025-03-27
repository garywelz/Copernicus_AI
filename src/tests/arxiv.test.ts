import { jest, describe, test, expect } from '@jest/globals';
import { ArxivService } from '../services/arxiv/ArxivService';
import type { Response, RequestInfo, RequestInit } from 'node-fetch';
import { Headers } from 'node-fetch';

// First install @types/jest
// npm install --save-dev @types/jest

interface MockResponse extends Partial<Response> {
  ok: boolean;
  status: number;
  text: () => Promise<string>;
  statusText: string;
  headers: Headers;
  url: string;
  redirected: boolean;
  type: ResponseType;
  bodyUsed: boolean;
  bytes?: () => Promise<Uint8Array>;  // Make bytes optional
  clone: () => Response;
}

describe('ArxivService', () => {
  const mockXmlResponse = `
    <?xml version="1.0" encoding="UTF-8"?>
    <feed>
      <entry>
        <title>Test Paper</title>
        <author><name>Test Author</name></author>
        <published>2024-01-01T00:00:00Z</published>
        <summary>Test summary</summary>
        <id>image.pnghttp://arxiv.org/abs/1234.5678</id>
      </entry>
    </feed>
  `;

  test('parses XML response correctly', async () => {
    const mockFetchResponse: MockResponse = {
      ok: true,
      status: 200,
      text: async () => mockXmlResponse,
      statusText: 'OK',
      headers: new Headers(),
      url: 'test-url',
      redirected: false,
      type: 'default' as ResponseType,
      bodyUsed: false,
      clone: function() { return this as unknown as Response }
    };

    const mockFetch = jest.spyOn(global, 'fetch')
      .mockImplementation(async () => mockFetchResponse as unknown as globalThis.Response);

    const service = new ArxivService();
    const result = await service.searchPapers({ search_query: 'test' });

    expect(result.success).toBe(true);
    expect(result.papers).toBeDefined();
    expect(result.papers![0].title).toBe('Test Paper');

    mockFetch.mockRestore();
  });

  test('handles API errors', async () => {
    const mockFetch = jest.spyOn(global, 'fetch')
      .mockRejectedValue(new Error('API Error'));

    const service = new ArxivService();
    const result = await service.searchPapers({ search_query: 'test' });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();

    mockFetch.mockRestore();
  });
}); 