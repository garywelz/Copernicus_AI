"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const TextToSpeechService_1 = require("../../../services/voice/TextToSpeechService");
const mockHeaders_1 = require("../../mocks/mockHeaders");
globals_1.jest.mock('node-fetch', () => ({
    default: globals_1.jest.fn()
}));
(0, globals_1.describe)('TextToSpeechService', () => {
    let service;
    let mockFetch;
    const mockOptions = {
        voice: 'en_US-male-medium',
        speed: 1.0,
        pitch: 1.0
    };
    const mockAudioData = new ArrayBuffer(8);
    (0, globals_1.beforeEach)(() => {
        service = new TextToSpeechService_1.TextToSpeechService('test-api-key');
        mockFetch = globals_1.jest.spyOn(global, 'fetch').mockImplementation(async () => ({
            ok: true,
            status: 200,
            statusText: 'OK',
            arrayBuffer: async () => mockAudioData,
            headers: new mockHeaders_1.MockHeaders(),
            url: 'test-url',
            redirected: false,
            type: 'default',
            body: null,
            bodyUsed: false,
            bytes: () => Promise.resolve(new Uint8Array()),
            clone: function () { return this; },
            blob: () => Promise.resolve(new Blob()),
            formData: () => Promise.resolve(new FormData()),
            json: async () => ({}),
            text: () => Promise.resolve('')
        }));
    });
    (0, globals_1.test)('synthesizes text successfully', async () => {
        const result = await service.synthesize('Hello world', mockOptions);
        (0, globals_1.expect)(result).toEqual({
            audioData: globals_1.expect.any(Buffer),
            duration: globals_1.expect.any(Number),
            voice: mockOptions.voice
        });
    });
    (0, globals_1.test)('handles API errors', async () => {
        mockFetch.mockImplementationOnce(async () => ({
            ok: false,
            status: 400,
            statusText: 'Bad Request',
            arrayBuffer: async () => new ArrayBuffer(0),
            headers: new mockHeaders_1.MockHeaders(),
            url: 'test-url',
            redirected: false,
            type: 'default',
            body: null,
            bodyUsed: false,
            bytes: () => Promise.resolve(new Uint8Array()),
            clone: function () { return this; },
            blob: () => Promise.resolve(new Blob()),
            formData: () => Promise.resolve(new FormData()),
            json: async () => ({}),
            text: () => Promise.resolve('')
        }));
        await (0, globals_1.expect)(service.synthesize('Test text', mockOptions)).rejects.toThrow('TTS API request failed: Bad Request');
    });
});
//# sourceMappingURL=TextToSpeechService.test.js.map