"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockResponse = createMockResponse;
const mockHeaders_1 = require("./mockHeaders");
function createMockResponse(init = {}) {
    return {
        ok: init.ok ?? true,
        status: init.status ?? 200,
        statusText: init.statusText ?? 'OK',
        json: init.json ?? (() => Promise.resolve({})),
        text: init.text ?? (() => Promise.resolve('')),
        arrayBuffer: init.arrayBuffer ?? (() => Promise.resolve(new ArrayBuffer(0))),
        headers: new mockHeaders_1.MockHeaders(),
        url: init.url ?? 'test-url',
        redirected: false,
        type: 'default',
        body: null,
        bodyUsed: false,
        bytes: () => Promise.resolve(new Uint8Array()),
        clone: function () { return this; }
    };
}
//# sourceMappingURL=mockResponse.js.map