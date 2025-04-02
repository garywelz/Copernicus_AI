import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { ILoggingService } from '../../../../services/logging/ILoggingService';
import { LoggingService } from '../../../../services/logging/LoggingService';
import { LogLevel } from '../../../../types/logging';

describe('Logging Service', () => {
  let loggingService: ILoggingService;

  beforeEach(() => {
    loggingService = new LoggingService('test-project', 'test-bucket');
  });

  describe('Log Levels', () => {
    test('logs debug message', async () => {
      const message = 'Debug message';
      const context = { test: 'value' };
      
      await expect(loggingService.debug(message, context))
        .resolves.not.toThrow();
    });

    test('logs info message', async () => {
      const message = 'Info message';
      const context = { test: 'value' };
      
      await expect(loggingService.info(message, context))
        .resolves.not.toThrow();
    });

    test('logs warning message', async () => {
      const message = 'Warning message';
      const context = { test: 'value' };
      
      await expect(loggingService.warn(message, context))
        .resolves.not.toThrow();
    });

    test('logs error message', async () => {
      const message = 'Error message';
      const error = new Error('Test error');
      const context = { test: 'value' };
      
      await expect(loggingService.error(message, error, context))
        .resolves.not.toThrow();
    });
  });

  describe('Log Retrieval', () => {
    test('gets logs with level filter', async () => {
      const level = LogLevel.INFO;
      const logs = await loggingService.getLogs({ level });
      
      expect(Array.isArray(logs)).toBe(true);
      logs.forEach(log => {
        expect(log.level).toBe(level);
      });
    });

    test('gets logs with time range', async () => {
      const startTime = new Date(Date.now() - 3600000); // 1 hour ago
      const endTime = new Date();
      const logs = await loggingService.getLogs({ startTime, endTime });
      
      expect(Array.isArray(logs)).toBe(true);
      logs.forEach(log => {
        const logTime = new Date(log.timestamp);
        expect(logTime >= startTime && logTime <= endTime).toBe(true);
      });
    });

    test('gets logs with context filter', async () => {
      const context = { test: 'value' };
      const logs = await loggingService.getLogs({ context });
      
      expect(Array.isArray(logs)).toBe(true);
      logs.forEach(log => {
        expect(log.context).toMatchObject(context);
      });
    });
  });

  describe('Log Management', () => {
    test('clears logs before date', async () => {
      const beforeDate = new Date();
      await expect(loggingService.clearLogs(beforeDate))
        .resolves.not.toThrow();
    });

    test('clears logs with level filter', async () => {
      const level = LogLevel.DEBUG;
      const beforeDate = new Date();
      await expect(loggingService.clearLogs(beforeDate, level))
        .resolves.not.toThrow();
    });
  });

  describe('Error Handling', () => {
    test('handles storage errors', async () => {
      const message = 'Test message';
      
      // Mock storage error
      jest.spyOn(loggingService as any, 'writeToStorage')
        .mockRejectedValueOnce(new Error('Storage error'));
      
      await expect(loggingService.info(message))
        .rejects.toThrow('Storage error');
    });

    test('handles invalid log level', async () => {
      const message = 'Test message';
      const invalidLevel = 'INVALID' as LogLevel;
      
      await expect(loggingService.getLogs({ level: invalidLevel }))
        .rejects.toThrow('Invalid log level');
    });

    test('handles invalid time range', async () => {
      const endTime = new Date(Date.now() - 3600000); // 1 hour ago
      const startTime = new Date();
      
      await expect(loggingService.getLogs({ startTime, endTime }))
        .rejects.toThrow('Invalid time range');
    });
  });
}); 