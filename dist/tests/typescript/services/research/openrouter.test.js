"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const node_fetch_1 = require("node-fetch");
(0, globals_1.describe)('OpenRouter API', () => {
    const apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    (0, globals_1.beforeEach)(() => {
        // Reset all mocks before each test
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.test)('successfully calls OpenRouter API', async () => {
        const mockResponse = {
            choices: [{
                    message: {
                        content: 'Test successful!',
                        role: 'assistant'
                    }
                }]
        };
        const mockFetchResponse = {
            json: () => Promise.resolve(mockResponse),
            ok: true,
            status: 200,
            headers: new node_fetch_1.Headers(),
            url: apiUrl,
            redirected: false,
            statusText: 'OK',
            type: 'default',
            body: null,
            bodyUsed: false,
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
            blob: () => Promise.resolve(new Blob()),
            formData: () => Promise.resolve(new FormData()),
            text: () => Promise.resolve(''),
            clone: function () { return this; },
        };
        const mockFetch = globals_1.jest.fn();
        mockFetch.mockResolvedValue(mockFetchResponse);
        global.fetch = mockFetch;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'openai/gpt-3.5-turbo',
                messages: [
                    { role: 'user', content: 'Hello, this is a test message. Please respond with "Test successful!"' }
                ]
            })
        });
        const data = await response.json();
        (0, globals_1.expect)(mockFetch).toHaveBeenCalledTimes(1);
        (0, globals_1.expect)(data.choices[0].message.content).toBe('Test successful!');
    });
    (0, globals_1.test)('handles API errors gracefully', async () => {
        const mockError = new Error('API Error');
        const mockErrorResponse = {
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
            headers: new node_fetch_1.Headers(),
            url: apiUrl,
            redirected: false,
            type: 'default',
            body: null,
            bodyUsed: false,
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
            blob: () => Promise.resolve(new Blob()),
            formData: () => Promise.resolve(new FormData()),
            json: () => Promise.resolve({ error: 'API Error' }),
            text: () => Promise.resolve(''),
            clone: function () { return this; }
        };
        const mockFetch = globals_1.jest.fn();
        mockFetch.mockResolvedValue(mockErrorResponse);
        global.fetch = mockFetch;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'openai/gpt-3.5-turbo',
                messages: [{ role: 'user', content: 'test' }]
            })
        });
        (0, globals_1.expect)(response.ok).toBe(false);
        (0, globals_1.expect)(response.status).toBe(500);
        const data = await response.json();
        (0, globals_1.expect)(data.error).toBe('API Error');
    });
});
//# sourceMappingURL=openrouter.test.js.map