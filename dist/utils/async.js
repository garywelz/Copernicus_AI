"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttle = exports.debounce = exports.parallel = exports.timeout = exports.retry = exports.sleep = exports.execAsync = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
exports.execAsync = (0, util_1.promisify)(child_process_1.exec);
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
exports.sleep = sleep;
const retry = async (operation, maxRetries = 3, delay = 1000) => {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        }
        catch (error) {
            lastError = error;
            if (i < maxRetries - 1) {
                await (0, exports.sleep)(delay * Math.pow(2, i));
                continue;
            }
            throw error;
        }
    }
    throw lastError || new Error('Operation failed after retries');
};
exports.retry = retry;
const timeout = async (promise, ms, errorMessage = 'Operation timed out') => {
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(errorMessage)), ms);
    });
    return Promise.race([promise, timeoutPromise]);
};
exports.timeout = timeout;
const parallel = async (operations, maxConcurrent = 3) => {
    const results = [];
    const chunks = [];
    for (let i = 0; i < operations.length; i += maxConcurrent) {
        chunks.push(operations.slice(i, i + maxConcurrent));
    }
    for (const chunk of chunks) {
        const chunkResults = await Promise.all(chunk.map(op => op()));
        results.push(...chunkResults);
    }
    return results;
};
exports.parallel = parallel;
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};
exports.debounce = debounce;
const throttle = (func, limit) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};
exports.throttle = throttle;
//# sourceMappingURL=async.js.map