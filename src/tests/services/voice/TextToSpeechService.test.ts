import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { TextToSpeechService } from '../../../services/voice/TextToSpeechService';
import type { VoiceSynthesisOptions } from '../../../services/interfaces/IVoiceService';
import { MockHeaders } from '../../mocks/mockHeaders';

jest.mock('node-fetch', () => ({
  default: jest.fn()
}));

describe('TextToSpeechService', () => {
  let service: TextToSpeechService;
  let mockFetch: jest.SpyInstance;

  const mockOptions: VoiceSynthesisOptions = {
    voice: 'en_US-male-medium',
    speed: 1.0,
    pitch: 1.0
  };

  const mockAudioData = new ArrayBuffer(8);

  beforeEach(() => {
    service = new TextToSpeechService('test-api-key');
    mockFetch = jest.spyOn(global, 'fetch').mockImplementation(async () => ({
      ok: true,
      status: 200,
      statusText: 'OK',
      arrayBuffer: async () => mockAudioData,
      headers: new MockHeaders(),
      url: 'test-url',
      redirected: false,
      type: 'default' as ResponseType,
      body: null,
      bodyUsed: false,
      bytes: () => Promise.resolve(new Uint8Array()),
      clone: function() { return this; },
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
      json: async () => ({}),
      text: () => Promise.resolve('')
    }));
  });

  test('synthesizes text successfully', async () => {
    const result = await service.synthesize('Hello world', mockOptions);
    
    expect(result).toEqual({
      audioData: expect.any(Buffer),
      duration: expect.any(Number),
      voice: mockOptions.voice
    });
  });

  test('handles API errors', async () => {
    mockFetch.mockImplementationOnce(async () => ({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      arrayBuffer: async () => new ArrayBuffer(0),
      headers: new MockHeaders(),
      url: 'test-url',
      redirected: false,
      type: 'default' as ResponseType,
      body: null,
      bodyUsed: false,
      bytes: () => Promise.resolve(new Uint8Array()),
      clone: function() { return this; },
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
      json: async () => ({}),
      text: () => Promise.resolve('')
    }));

    await expect(
      service.synthesize('Test text', mockOptions)
    ).rejects.toThrow('TTS API request failed: Bad Request');
  });
}); 