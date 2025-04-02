"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const ArxivService_1 = require("../../services/arxiv/ArxivService");
const mockHeaders_1 = require("../mocks/mockHeaders");
globals_1.jest.mock('node-fetch', () => ({
    default: globals_1.jest.fn()
}));
(0, globals_1.describe)('ArxivService', () => {
    let service;
    let mockFetch;
    const mockXmlResponse = `
    <?xml version="1.0" encoding="UTF-8"?>
    <feed>
      <entry>
        <title>Test Paper</title>
        <author><name>Test Author</name></author>
        <published>2024-01-01T00:00:00Z</published>
        <summary>Test summary</summary>
        <id>http://arxiv.org/abs/1234.5678</id>
      </entry>
    </feed>
  `;
    (0, globals_1.beforeEach)(() => {
        service = new ArxivService_1.ArxivService();
        mockFetch = globals_1.jest.spyOn(global, 'fetch').mockImplementation(async () => ({
            ok: true,
            status: 200,
            statusText: 'OK',
            text: async () => mockXmlResponse,
            headers: new mockHeaders_1.MockHeaders(),
            url: 'test-url',
            redirected: false,
            type: 'default',
            body: null,
            bodyUsed: false,
            bytes: () => Promise.resolve(new Uint8Array()),
            clone: function () { return this; },
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
            blob: () => Promise.resolve(new Blob()),
            formData: () => Promise.resolve(new FormData()),
            json: async () => ({})
        }));
    });
    (0, globals_1.test)('parses XML response correctly', async () => {
        const result = await service.searchPapers({ search_query: 'test' });
        (0, globals_1.expect)(result.success).toBe(true);
        (0, globals_1.expect)(result.papers).toBeDefined();
        (0, globals_1.expect)(result.papers[0].title).toBe('Test Paper');
    });
    (0, globals_1.test)('handles API errors', async () => {
        mockFetch.mockImplementationOnce(async () => ({
            ok: false,
            status: 400,
            statusText: 'Bad Request',
            text: async () => 'Error',
            headers: new mockHeaders_1.MockHeaders(),
            url: 'test-url',
            redirected: false,
            type: 'default',
            body: null,
            bodyUsed: false,
            bytes: () => Promise.resolve(new Uint8Array()),
            clone: function () { return this; },
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
            blob: () => Promise.resolve(new Blob()),
            formData: () => Promise.resolve(new FormData()),
            json: async () => ({})
        }));
        const result = await service.searchPapers({ search_query: 'test' });
        (0, globals_1.expect)(result.success).toBe(false);
        (0, globals_1.expect)(result.error).toBeDefined();
    });
});
//# sourceMappingURL=ArxivService.test.js.map