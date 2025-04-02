"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockHeaders = void 0;
const node_fetch_1 = require("node-fetch");
class MockHeaders extends node_fetch_1.Headers {
    getSetCookie() {
        return [];
    }
}
exports.MockHeaders = MockHeaders;
//# sourceMappingURL=mockHeaders.js.map