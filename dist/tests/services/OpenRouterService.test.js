"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/tests/services/OpenRouterService.test.ts
const globals_1 = require("@jest/globals");
const OpenRouterService_1 = require("../../services/llm/OpenRouterService");
const node_fetch_1 = require("node-fetch");
const mockHeaders_1 = require("../mocks/mockHeaders");
globals_1.jest.mock('node-fetch', () => ({
    default: globals_1.jest.fn()
}));
(0, globals_1.describe)('OpenRouterService', () => {
    let service;
    let mockFetch;
    const mockApiKey = 'test-api-key';
    const mockResponse = {
        choices: [{
                message: {
                    content: 'Test response'
                }
            }]
    };
    (0, globals_1.beforeEach)(() => {
        service = new OpenRouterService_1.OpenRouterService(mockApiKey);
        const mockResponseObj = new node_fetch_1.Response(JSON.stringify(mockResponse), {
            status: 200,
            statusText: 'OK',
            headers: new mockHeaders_1.MockHeaders()
        });
        mockFetch = globals_1.jest.spyOn(global, 'fetch')
            .mockResolvedValue(mockResponseObj);
    });
    (0, globals_1.afterEach)(() => {
        mockFetch.mockRestore();
    });
    (0, globals_1.test)('generates completion successfully', async () => {
        const result = await service.generateCompletion('Test prompt');
        (0, globals_1.expect)(result.text).toBe('Test response');
        (0, globals_1.expect)(mockFetch).toHaveBeenCalledWith(globals_1.expect.stringContaining('/api/v1/chat/completions'), globals_1.expect.objectContaining({
            method: 'POST',
            headers: globals_1.expect.objectContaining({
                'Authorization': `Bearer ${mockApiKey}`
            })
        }));
    });
    (0, globals_1.test)('generates structured output successfully', async () => {
        const schema = {
            type: 'object',
            properties: {
                test: { type: 'string' }
            }
        };
        const result = await service.generateStructuredOutput('Test prompt', schema);
        (0, globals_1.expect)(result).toBeDefined();
    });
    (0, globals_1.test)('handles API errors', async () => {
        const errorResponseObj = new node_fetch_1.Response(JSON.stringify({ error: 'Test error' }), {
            status: 400,
            statusText: 'Bad Request',
            headers: new mockHeaders_1.MockHeaders()
        });
        mockFetch.mockResolvedValueOnce(errorResponseObj);
        await (0, globals_1.expect)(service.generateCompletion('Test prompt')).rejects.toThrow('OpenRouter API request failed: Bad Request');
    });
    (0, globals_1.describe)('analyzePaper', () => {
        const mockPaper = {
            title: 'Test Paper',
            authors: ['Test Author'],
            content: 'Test content'
        };
        const mockOptions = {
            depth: 'quick',
            outputFormat: 'summary'
        };
        const mockAnalysisResponse = {
            summary: 'Test summary',
            keyPoints: ['Point 1', 'Point 2']
        };
        (0, globals_1.beforeEach)(() => {
            const analysisResponseObj = new node_fetch_1.Response(JSON.stringify(mockAnalysisResponse), {
                status: 200,
                statusText: 'OK',
                headers: new mockHeaders_1.MockHeaders()
            });
            mockFetch.mockResolvedValue(analysisResponseObj);
        });
        (0, globals_1.test)('should make correct API call', async () => {
            await service.analyzePaper(mockPaper, mockOptions);
            (0, globals_1.expect)(mockFetch).toHaveBeenCalledWith('https://api.openrouter.ai/api/v1/analyze', globals_1.expect.objectContaining({
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${mockApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ paper: mockPaper, options: mockOptions })
            }));
        });
        (0, globals_1.test)('should return analysis response', async () => {
            const result = await service.analyzePaper(mockPaper, mockOptions);
            (0, globals_1.expect)(result).toEqual(mockAnalysisResponse);
        });
        (0, globals_1.test)('handles API errors', async () => {
            const errorResponseObj = new node_fetch_1.Response(JSON.stringify({ error: 'Analysis Failed' }), {
                status: 400,
                statusText: 'Analysis Failed',
                headers: new mockHeaders_1.MockHeaders()
            });
            mockFetch.mockResolvedValueOnce(errorResponseObj);
            await (0, globals_1.expect)(service.analyzePaper(mockPaper, mockOptions)).rejects.toThrow('API request failed: Analysis Failed');
        });
    });
    (0, globals_1.describe)('generateStructuredOutput', () => {
        const mockPrompt = 'Test prompt';
        const mockSchema = { type: 'object', properties: { test: { type: 'string' } } };
        const mockStructuredResponse = { test: 'structured output' };
        (0, globals_1.test)('should make correct API call', async () => {
            const structuredResponseObj = new node_fetch_1.Response(JSON.stringify(mockStructuredResponse), {
                status: 200,
                statusText: 'OK',
                headers: new mockHeaders_1.MockHeaders()
            });
            mockFetch.mockResolvedValueOnce(structuredResponseObj);
            await service.generateStructuredOutput(mockPrompt, mockSchema);
            (0, globals_1.expect)(mockFetch).toHaveBeenCalledWith('https://api.openrouter.ai/api/v1/structured', globals_1.expect.objectContaining({
                method: 'POST',
                body: globals_1.expect.stringContaining(mockPrompt)
            }));
        });
        (0, globals_1.test)('should handle API errors', async () => {
            const errorResponseObj = new node_fetch_1.Response(JSON.stringify({ error: 'Structured Output Failed' }), {
                status: 400,
                statusText: 'Structured Output Failed',
                headers: new mockHeaders_1.MockHeaders()
            });
            mockFetch.mockResolvedValueOnce(errorResponseObj);
            await (0, globals_1.expect)(service.generateStructuredOutput(mockPrompt, mockSchema)).rejects.toThrow('API request failed: Structured Output Failed');
        });
    });
});
//# sourceMappingURL=OpenRouterService.test.js.map