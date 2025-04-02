import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { IVoiceService } from '../../../../services/voice/IVoiceService';
import { GoogleTTSService } from '../../../../services/voice/GoogleTTSService';
import { OpenAITTSService } from '../../../../services/voice/OpenAITTSService';
import { VoiceServiceFactory } from '../../../../services/voice/VoiceServiceFactory';
import { VoiceProvider } from '../../../../types/voice';

describe('Voice Service', () => {
  let googleService: IVoiceService;
  let openaiService: IVoiceService;

  beforeEach(() => {
    googleService = VoiceServiceFactory.createService('google', 'test-project');
    openaiService = VoiceServiceFactory.createService('openai', 'test-project', 'test-api-key');
  });

  describe('Google TTS Service', () => {
    test('generates audio with valid inputs', async () => {
      const text = 'Test audio generation';
      const speaker = 'host';
      const result = await googleService.generateAudio(text, speaker);
      
      expect(result).toBeDefined();
      expect(result.duration).toBeGreaterThan(0);
    });

    test('combines audio segments', async () => {
      const segments = [
        await googleService.generateAudio('First segment'),
        await googleService.generateAudio('Second segment')
      ];
      
      const result = await googleService.combineAudioSegments(segments);
      expect(result).toBeDefined();
    });
  });

  describe('OpenAI TTS Service', () => {
    test('generates audio with valid inputs', async () => {
      const text = 'Test audio generation';
      const speaker = 'host';
      const result = await openaiService.generateAudio(text, speaker);
      
      expect(result).toBeDefined();
      expect(result.duration).toBeGreaterThan(0);
    });

    test('combines audio segments', async () => {
      const segments = [
        await openaiService.generateAudio('First segment'),
        await openaiService.generateAudio('Second segment')
      ];
      
      const result = await openaiService.combineAudioSegments(segments);
      expect(result).toBeDefined();
    });
  });

  describe('Voice Service Factory', () => {
    test('creates Google TTS service', () => {
      const service = VoiceServiceFactory.createService('google', 'test-project');
      expect(service).toBeInstanceOf(GoogleTTSService);
    });

    test('creates OpenAI TTS service', () => {
      const service = VoiceServiceFactory.createService('openai', 'test-project', 'test-api-key');
      expect(service).toBeInstanceOf(OpenAITTSService);
    });

    test('throws error for invalid provider', () => {
      expect(() => {
        VoiceServiceFactory.createService('invalid' as VoiceProvider, 'test-project');
      }).toThrow('Unsupported voice provider');
    });

    test('throws error for OpenAI without API key', () => {
      expect(() => {
        VoiceServiceFactory.createService('openai', 'test-project');
      }).toThrow('API key is required for OpenAI TTS');
    });
  });
}); 