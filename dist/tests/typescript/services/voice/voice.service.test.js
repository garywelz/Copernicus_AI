"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const GoogleTTSService_1 = require("../../../../services/voice/GoogleTTSService");
const OpenAITTSService_1 = require("../../../../services/voice/OpenAITTSService");
const VoiceServiceFactory_1 = require("../../../../services/voice/VoiceServiceFactory");
(0, globals_1.describe)('Voice Service', () => {
    let googleService;
    let openaiService;
    (0, globals_1.beforeEach)(() => {
        googleService = VoiceServiceFactory_1.VoiceServiceFactory.createService('google', 'test-project');
        openaiService = VoiceServiceFactory_1.VoiceServiceFactory.createService('openai', 'test-project', 'test-api-key');
    });
    (0, globals_1.describe)('Google TTS Service', () => {
        (0, globals_1.test)('generates audio with valid inputs', async () => {
            const text = 'Test audio generation';
            const speaker = 'host';
            const result = await googleService.generateAudio(text, speaker);
            (0, globals_1.expect)(result).toBeDefined();
            (0, globals_1.expect)(result.duration).toBeGreaterThan(0);
        });
        (0, globals_1.test)('combines audio segments', async () => {
            const segments = [
                await googleService.generateAudio('First segment'),
                await googleService.generateAudio('Second segment')
            ];
            const result = await googleService.combineAudioSegments(segments);
            (0, globals_1.expect)(result).toBeDefined();
        });
    });
    (0, globals_1.describe)('OpenAI TTS Service', () => {
        (0, globals_1.test)('generates audio with valid inputs', async () => {
            const text = 'Test audio generation';
            const speaker = 'host';
            const result = await openaiService.generateAudio(text, speaker);
            (0, globals_1.expect)(result).toBeDefined();
            (0, globals_1.expect)(result.duration).toBeGreaterThan(0);
        });
        (0, globals_1.test)('combines audio segments', async () => {
            const segments = [
                await openaiService.generateAudio('First segment'),
                await openaiService.generateAudio('Second segment')
            ];
            const result = await openaiService.combineAudioSegments(segments);
            (0, globals_1.expect)(result).toBeDefined();
        });
    });
    (0, globals_1.describe)('Voice Service Factory', () => {
        (0, globals_1.test)('creates Google TTS service', () => {
            const service = VoiceServiceFactory_1.VoiceServiceFactory.createService('google', 'test-project');
            (0, globals_1.expect)(service).toBeInstanceOf(GoogleTTSService_1.GoogleTTSService);
        });
        (0, globals_1.test)('creates OpenAI TTS service', () => {
            const service = VoiceServiceFactory_1.VoiceServiceFactory.createService('openai', 'test-project', 'test-api-key');
            (0, globals_1.expect)(service).toBeInstanceOf(OpenAITTSService_1.OpenAITTSService);
        });
        (0, globals_1.test)('throws error for invalid provider', () => {
            (0, globals_1.expect)(() => {
                VoiceServiceFactory_1.VoiceServiceFactory.createService('invalid', 'test-project');
            }).toThrow('Unsupported voice provider');
        });
        (0, globals_1.test)('throws error for OpenAI without API key', () => {
            (0, globals_1.expect)(() => {
                VoiceServiceFactory_1.VoiceServiceFactory.createService('openai', 'test-project');
            }).toThrow('API key is required for OpenAI TTS');
        });
    });
});
//# sourceMappingURL=voice.service.test.js.map