"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockResponse = createMockResponse;
const node_fetch_1 = require("node-fetch");
function createMockResponse(init) {
    const response = {
        ok: init.ok ?? true,
        status: init.status ?? 200,
        statusText: init.statusText ?? 'OK',
        headers: new node_fetch_1.Headers(),
        url: 'test-url',
        redirected: false,
        type: 'default',
        body: null,
        bodyUsed: false,
        bytes: () => Promise.resolve(new Uint8Array()),
        clone: function () { return this; },
        arrayBuffer: init.arrayBuffer ?? (() => Promise.resolve(new ArrayBuffer(0))),
        blob: () => Promise.resolve(new Blob()),
        formData: () => Promise.resolve(new FormData()),
        json: init.json ?? (() => Promise.resolve({})),
        text: init.text ?? (() => Promise.resolve(''))
    };
    return response;
}
//# sourceMappingURL=mockTypes.js.map