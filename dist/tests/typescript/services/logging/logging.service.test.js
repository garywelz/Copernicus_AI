"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const LoggingService_1 = require("../../../../services/logging/LoggingService");
(0, globals_1.describe)('Logging Service', () => {
    let loggingService;
    (0, globals_1.beforeEach)(() => {
        loggingService = new LoggingService_1.LoggingService('test-project', 'test-bucket');
    });
    (0, globals_1.describe)('Log Levels', () => {
        (0, globals_1.test)('logs debug message', async () => {
            const message = 'Debug message';
            const context = { test: 'value' };
            await (0, globals_1.expect)(loggingService.debug(message, context))
                .resolves.not.toThrow();
        });
        (0, globals_1.test)('logs info message', async () => {
            const message = 'Info message';
            const context = { test: 'value' };
            await (0, globals_1.expect)(loggingService.info(message, context))
                .resolves.not.toThrow();
        });
        (0, globals_1.test)('logs warning message', async () => {
            const message = 'Warning message';
            const context = { test: 'value' };
            await (0, globals_1.expect)(loggingService.warn(message, context))
                .resolves.not.toThrow();
        });
        (0, globals_1.test)('logs error message', async () => {
            const message = 'Error message';
            const error = new Error('Test error');
            const context = { test: 'value' };
            await (0, globals_1.expect)(loggingService.error(message, error, context))
                .resolves.not.toThrow();
        });
    });
    (0, globals_1.describe)('Log Retrieval', () => {
        (0, globals_1.test)('gets logs with level filter', async () => {
            const level = logging_1.LogLevel.INFO;
            const logs = await loggingService.getLogs({ level });
            (0, globals_1.expect)(Array.isArray(logs)).toBe(true);
            logs.forEach(log => {
                (0, globals_1.expect)(log.level).toBe(level);
            });
        });
        (0, globals_1.test)('gets logs with time range', async () => {
            const startTime = new Date(Date.now() - 3600000); // 1 hour ago
            const endTime = new Date();
            const logs = await loggingService.getLogs({ startTime, endTime });
            (0, globals_1.expect)(Array.isArray(logs)).toBe(true);
            logs.forEach(log => {
                const logTime = new Date(log.timestamp);
                (0, globals_1.expect)(logTime >= startTime && logTime <= endTime).toBe(true);
            });
        });
        (0, globals_1.test)('gets logs with context filter', async () => {
            const context = { test: 'value' };
            const logs = await loggingService.getLogs({ context });
            (0, globals_1.expect)(Array.isArray(logs)).toBe(true);
            logs.forEach(log => {
                (0, globals_1.expect)(log.context).toMatchObject(context);
            });
        });
    });
    (0, globals_1.describe)('Log Management', () => {
        (0, globals_1.test)('clears logs before date', async () => {
            const beforeDate = new Date();
            await (0, globals_1.expect)(loggingService.clearLogs(beforeDate))
                .resolves.not.toThrow();
        });
        (0, globals_1.test)('clears logs with level filter', async () => {
            const level = logging_1.LogLevel.DEBUG;
            const beforeDate = new Date();
            await (0, globals_1.expect)(loggingService.clearLogs(beforeDate, level))
                .resolves.not.toThrow();
        });
    });
    (0, globals_1.describe)('Error Handling', () => {
        (0, globals_1.test)('handles storage errors', async () => {
            const message = 'Test message';
            // Mock storage error
            globals_1.jest.spyOn(loggingService, 'writeToStorage')
                .mockRejectedValueOnce(new Error('Storage error'));
            await (0, globals_1.expect)(loggingService.info(message))
                .rejects.toThrow('Storage error');
        });
        (0, globals_1.test)('handles invalid log level', async () => {
            const message = 'Test message';
            const invalidLevel = 'INVALID';
            await (0, globals_1.expect)(loggingService.getLogs({ level: invalidLevel }))
                .rejects.toThrow('Invalid log level');
        });
        (0, globals_1.test)('handles invalid time range', async () => {
            const endTime = new Date(Date.now() - 3600000); // 1 hour ago
            const startTime = new Date();
            await (0, globals_1.expect)(loggingService.getLogs({ startTime, endTime }))
                .rejects.toThrow('Invalid time range');
        });
    });
});
//# sourceMappingURL=logging.service.test.js.map