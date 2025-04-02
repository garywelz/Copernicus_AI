import { ILoggingService, LogLevel, LogEntry } from './ILoggingService';
export declare class LoggingService implements ILoggingService {
    private storage;
    private bucket;
    private prefix;
    constructor(projectId: string, bucketName: string, prefix?: string);
    private writeLog;
    debug(message: string, context?: Record<string, any>): void;
    info(message: string, context?: Record<string, any>): void;
    warn(message: string, context?: Record<string, any>): void;
    error(message: string, error?: Error, context?: Record<string, any>): void;
    getLogs(level?: LogLevel, startTime?: Date, endTime?: Date): Promise<LogEntry[]>;
    clearLogs(before?: Date): Promise<void>;
}
