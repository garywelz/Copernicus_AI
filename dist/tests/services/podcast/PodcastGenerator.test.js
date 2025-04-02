"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PodcastGenerator_1 = require("../../../services/podcast/PodcastGenerator");
const promises_1 = __importDefault(require("fs/promises"));
const globals_1 = require("@jest/globals");
globals_1.jest.mock('fs/promises');
globals_1.jest.mock('../../../services/voice/TextToSpeechService');
(0, globals_1.describe)('PodcastGenerator', () => {
    let generator;
    let mockTtsService;
    const mockAudioSegment = {
        audioData: Buffer.from('test audio'),
        duration: 5,
        speaker: 'en_US-male-medium'
    };
    const mockScript = {
        title: 'Test Podcast',
        introduction: 'Welcome to the show',
        segments: [
            {
                title: 'Main Point',
                content: 'First main point',
                speaker: 'en_US-male-medium'
            }
        ],
        conclusion: 'Thanks for listening',
        targetDuration: 10,
        complexity: 'intermediate'
    };
    (0, globals_1.beforeEach)(() => {
        mockTtsService = {
            synthesize: globals_1.jest.fn().mockResolvedValue(mockAudioSegment),
            setBackgroundMusic: globals_1.jest.fn().mockResolvedValue(undefined),
            combineAudio: globals_1.jest.fn().mockResolvedValue(Buffer.from('combined audio'))
        };
        generator = new PodcastGenerator_1.PodcastGenerator(mockTtsService);
    });
    (0, globals_1.test)('generates complete podcast audio', async () => {
        const result = await generator.generatePodcast(mockScript);
        (0, globals_1.expect)(result).toBeDefined();
        (0, globals_1.expect)(mockTtsService.synthesize).toHaveBeenCalledTimes(3); // intro + segment + conclusion
    });
    (0, globals_1.test)('handles file system errors', async () => {
        const mockReadFile = globals_1.jest.spyOn(promises_1.default, 'readFile')
            .mockRejectedValue(new Error('File not found'));
        await (0, globals_1.expect)(generator.generatePodcast(mockScript))
            .rejects.toThrow('Failed to generate podcast audio');
    });
    (0, globals_1.test)('handles TTS service errors', async () => {
        mockTtsService.synthesize.mockRejectedValue(new Error('TTS failed'));
        await (0, globals_1.expect)(generator.generatePodcast(mockScript))
            .rejects.toThrow('Failed to generate podcast audio');
    });
});
//# sourceMappingURL=PodcastGenerator.test.js.map