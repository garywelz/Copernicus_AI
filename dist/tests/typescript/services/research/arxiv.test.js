"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const ArxivService_1 = require("../services/arxiv/ArxivService");
const node_fetch_1 = require("node-fetch");
(0, globals_1.describe)('ArxivService', () => {
    const mockXmlResponse = `
    <?xml version="1.0" encoding="UTF-8"?>
    <feed>
      <entry>
        <title>Test Paper</title>
        <author><name>Test Author</name></author>
        <published>2024-01-01T00:00:00Z</published>
        <summary>Test summary</summary>
        <id>image.pnghttp://arxiv.org/abs/1234.5678</id>
      </entry>
    </feed>
  `;
    (0, globals_1.test)('parses XML response correctly', async () => {
        const mockFetchResponse = {
            ok: true,
            status: 200,
            text: async () => mockXmlResponse,
            statusText: 'OK',
            headers: new node_fetch_1.Headers(),
            url: 'test-url',
            redirected: false,
            type: 'default',
            bodyUsed: false,
            clone: function () { return this; }
        };
        const mockFetch = globals_1.jest.spyOn(global, 'fetch')
            .mockImplementation(async () => mockFetchResponse);
        const service = new ArxivService_1.ArxivService();
        const result = await service.searchPapers({ search_query: 'test' });
        (0, globals_1.expect)(result.success).toBe(true);
        (0, globals_1.expect)(result.papers).toBeDefined();
        (0, globals_1.expect)(result.papers[0].title).toBe('Test Paper');
        mockFetch.mockRestore();
    });
    (0, globals_1.test)('handles API errors', async () => {
        const mockFetch = globals_1.jest.spyOn(global, 'fetch')
            .mockRejectedValue(new Error('API Error'));
        const service = new ArxivService_1.ArxivService();
        const result = await service.searchPapers({ search_query: 'test' });
        (0, globals_1.expect)(result.success).toBe(false);
        (0, globals_1.expect)(result.error).toBeDefined();
        mockFetch.mockRestore();
    });
});
//# sourceMappingURL=arxiv.test.js.map