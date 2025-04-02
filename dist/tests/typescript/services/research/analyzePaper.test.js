"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/tests/analyzePaper.test.ts
const globals_1 = require("@jest/globals");
const analyzePaper_1 = require("../actions/analyzePaper");
const core_1 = require("@elizaos/core");
const paperProcessor_1 = require("../services/paperProcessor");
const paperAnalyzer_1 = require("../services/paperAnalyzer");
// Remove the inline mock since we're using the mock module
// jest.mock('@elizaos/core', () => ({...}));
// Mock paperProcessor
globals_1.jest.mock('../services/paperProcessor');
const mockProcessPaper = globals_1.jest.fn();
(0, globals_1.describe)('analyzePaperAction', () => {
    const mockApiKey = 'test-api-key';
    const mockRuntime = {
        character: {
            name: 'MockAgent',
            modelProvider: core_1.ModelProviderName.OPENROUTER,
            bio: ['A test character'],
            lore: [],
            messageExamples: [],
            postExamples: [],
            topics: [],
            adjectives: [],
            style: {
                all: [],
                chat: [],
                post: [],
            },
            clients: [],
            plugins: [],
            settings: {
                secrets: {
                    OPENROUTER_API_KEY: mockApiKey,
                },
            },
        },
    };
    const mockPaper = {
        title: 'Mock Title',
        authors: ['Mock Author'],
        content: 'Mock content for testing.'
    };
    const mockMemory = {
        userId: '00000000-0000-0000-0000-000000000000',
        agentId: '00000000-0000-0000-0000-000000000001',
        roomId: '00000000-0000-0000-0000-000000000002',
        content: mockPaper
    };
    const mockAnalysis = {
        summary: 'Test summary',
        keyPoints: ['Point 1']
    };
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
        mockProcessPaper.mockResolvedValue(mockAnalysis);
    });
    (0, globals_1.describe)('successful execution', () => {
        (0, globals_1.test)('processes paper with valid inputs', async () => {
            const options = {
                depth: 'quick',
                outputFormat: 'summary'
            };
            const callback = globals_1.jest.fn();
            await analyzePaper_1.analyzePaperAction.handler(mockRuntime, mockMemory, {}, options, callback);
            (0, globals_1.expect)(paperProcessor_1.processPaper).toHaveBeenCalledWith(mockPaper, options, mockApiKey);
            (0, globals_1.expect)(callback).toHaveBeenCalledWith({
                success: true,
                analysis: mockAnalysis,
                citation: globals_1.expect.any(String)
            });
        });
    });
    (0, globals_1.describe)('error handling', () => {
        (0, globals_1.test)('handles missing API key', async () => {
            const runtimeWithoutApiKey = {
                ...mockRuntime,
                character: {
                    ...mockRuntime.character,
                    settings: { secrets: {} },
                },
            };
            const callback = globals_1.jest.fn();
            await analyzePaper_1.analyzePaperAction.handler(runtimeWithoutApiKey, mockMemory, {}, {}, callback);
            (0, globals_1.expect)(callback).toHaveBeenCalledWith({
                error: 'Missing API key for analysis service.'
            });
            (0, globals_1.expect)(paperProcessor_1.processPaper).not.toHaveBeenCalled();
        });
        (0, globals_1.test)('handles processing errors', async () => {
            mockProcessPaper.mockRejectedValue(new Error('Processing failed'));
            const callback = globals_1.jest.fn();
            await analyzePaper_1.analyzePaperAction.handler(mockRuntime, mockMemory, {}, {}, callback);
            (0, globals_1.expect)(callback).toHaveBeenCalledWith({
                success: false,
                error: 'Failed to analyze the paper.'
            });
        });
    });
});
(0, globals_1.describe)('analyzePaper', () => {
    const mockPaper = {
        title: 'Test Paper',
        authors: ['Test Author'],
        content: 'Test content'
    };
    const mockAnalysis = {
        summary: 'Test summary',
        keyPoints: ['Point 1', 'Point 2']
    };
    (0, globals_1.beforeEach)(() => {
        process.env.OPENROUTER_API_KEY = 'test-key';
    });
    afterEach(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.test)('analyzes paper successfully', async () => {
        const result = await (0, paperAnalyzer_1.analyzePaper)(mockPaper);
        (0, globals_1.expect)(result).toBeDefined();
        (0, globals_1.expect)(result.summary).toBeTruthy();
        (0, globals_1.expect)(Array.isArray(result.keyPoints)).toBe(true);
    });
    (0, globals_1.test)('handles missing API key', async () => {
        delete process.env.OPENROUTER_API_KEY;
        await (0, globals_1.expect)((0, paperAnalyzer_1.analyzePaper)(mockPaper))
            .rejects.toThrow('OpenRouter API key not found');
    });
    (0, globals_1.test)('handles analysis options', async () => {
        const result = await (0, paperAnalyzer_1.analyzePaper)(mockPaper, {
            depth: 'detailed',
            outputFormat: 'structured'
        });
        (0, globals_1.expect)(result).toBeDefined();
    });
});
//# sourceMappingURL=analyzePaper.test.js.map