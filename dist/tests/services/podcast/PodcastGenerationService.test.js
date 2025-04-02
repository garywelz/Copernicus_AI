"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const PodcastGenerationService_1 = require("../../../services/podcast/PodcastGenerationService");
(0, globals_1.describe)('PodcastGenerationService', () => {
    let service;
    let mockLlmService;
    let mockTtsService;
    const mockAudioSegment = {
        audioData: Buffer.from('test audio'),
        duration: 5,
        speaker: 'en_US-male-medium'
    };
    const mockAnalysis = {
        summary: 'Test summary',
        keyPoints: ['Point 1', 'Point 2']
    };
    const mockCompletionResponse = {
        text: 'Test response'
    };
    (0, globals_1.beforeEach)(() => {
        mockLlmService = {
            generateCompletion: globals_1.jest.fn()
                .mockResolvedValue(mockCompletionResponse),
            generateStructuredOutput: globals_1.jest.fn()
                .mockResolvedValue({
                sections: [{ text: 'Test content' }]
            })
        };
        mockTtsService = {
            synthesize: globals_1.jest.fn()
                .mockResolvedValue(mockAudioSegment),
            setBackgroundMusic: globals_1.jest.fn()
                .mockResolvedValue(undefined),
            combineAudio: globals_1.jest.fn()
                .mockResolvedValue(Buffer.from('combined audio'))
        };
        service = new PodcastGenerationService_1.PodcastGenerationService(mockLlmService, mockTtsService);
    });
    (0, globals_1.test)('generates podcast successfully', async () => {
        const result = await service.generatePodcast('Test topic');
        (0, globals_1.expect)(result).toBeDefined();
        (0, globals_1.expect)(mockLlmService.generateStructuredOutput).toHaveBeenCalled();
        (0, globals_1.expect)(mockTtsService.synthesize).toHaveBeenCalled();
    });
    (0, globals_1.test)('handles generation errors', async () => {
        mockLlmService.generateStructuredOutput.mockRejectedValue(new Error('LLM error'));
        await (0, globals_1.expect)(service.generatePodcast('Test topic'))
            .rejects.toThrow('LLM error');
    });
});
//# sourceMappingURL=PodcastGenerationService.test.js.map