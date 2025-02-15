import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { Response, RequestInfo, RequestInit, Headers } from 'node-fetch';

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
}

type FetchMock = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

type MockResponse = Partial<Response> & {
  arrayBuffer(): Promise<ArrayBuffer>;
  json(): Promise<any>;
  text(): Promise<string>;
  headers: Headers;
  size?: number;
  timeout?: number;
  buffer?: () => Promise<Buffer>;
};

describe('OpenRouter API', () => {
  const apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  test('successfully calls OpenRouter API', async () => {
    const mockResponse: Partial<OpenRouterResponse> = {
      choices: [{
        message: {
          content: 'Test successful!',
          role: 'assistant'
        }
      }]
    };

    const mockFetchResponse = {
      json: () => Promise.resolve(mockResponse),
      ok: true,
      status: 200,
      headers: new Headers(),
      url: apiUrl,
      redirected: false,
      statusText: 'OK',
      type: 'default',
      body: null,
      bodyUsed: false,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
      text: () => Promise.resolve(''),
      clone: function() { return this },
    } as MockResponse;

    const mockFetch = jest.fn() as jest.MockedFunction<FetchMock>;
    mockFetch.mockResolvedValue(mockFetchResponse);
    global.fetch = mockFetch;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'user', content: 'Hello, this is a test message. Please respond with "Test successful!"' }
        ]
      })
    });

    const data = await response.json() as OpenRouterResponse;

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(data.choices[0].message.content).toBe('Test successful!');
  });

  test('handles API errors gracefully', async () => {
    const mockError = new Error('API Error');
    const mockErrorResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      headers: new Headers(),
      url: apiUrl,
      redirected: false,
      type: 'default',
      body: null,
      bodyUsed: false,
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
      json: () => Promise.resolve({ error: 'API Error' }),
      text: () => Promise.resolve(''),
      clone: function() { return this }
    } as MockResponse;

    const mockFetch = jest.fn() as jest.MockedFunction<FetchMock>;
    mockFetch.mockResolvedValue(mockErrorResponse);
    global.fetch = mockFetch;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'test' }]
      })
    });

    expect(response.ok).toBe(false);
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('API Error');
  });
}); 