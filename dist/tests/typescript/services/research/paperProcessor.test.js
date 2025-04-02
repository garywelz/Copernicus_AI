"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const paperProcessor_1 = require("../services/paperProcessor");
jest.mock('../services/llm/OpenRouterService');
(0, globals_1.describe)('paperProcessor', () => {
    const mockPaper = {
        title: 'Test Paper',
        content: 'Test content',
        authors: ['Test Author']
    };
    const mockOptions = {
        depth: 'quick',
        outputFormat: 'summary'
    };
    (0, globals_1.beforeEach)(() => {
        (0, paperProcessor_1.cleanupCache)();
    });
    (0, globals_1.test)('processes paper successfully', async () => {
        const result = await (0, paperProcessor_1.processPaper)(mockPaper, mockOptions, 'test-api-key');
        (0, globals_1.expect)(result).toBeDefined();
        (0, globals_1.expect)(result.summary).toBeDefined();
        (0, globals_1.expect)(result.keyPoints).toBeDefined();
    });
    (0, globals_1.test)('handles missing API key', async () => {
        await (0, globals_1.expect)((0, paperProcessor_1.processPaper)(mockPaper, {}, '')).rejects.toThrow('API key is required');
    });
});
//# sourceMappingURL=paperProcessor.test.js.map