import { LogLevel, LogEntry } from '../types/logging';
declare class Logger {
    private static instance;
    private logLevel;
    private entries;
    private constructor();
    static getInstance(): Logger;
    setLogLevel(level: LogLevel): void;
    private shouldLog;
    private createEntry;
    debug(message: string, context?: Record<string, any>): void;
    info(message: string, context?: Record<string, any>): void;
    warn(message: string, context?: Record<string, any>): void;
    error(message: string, error?: Error, context?: Record<string, any>): void;
    getEntries(level?: LogLevel, startTime?: Date, endTime?: Date): LogEntry[];
    clear(): void;
}
export declare const logger: Logger;
export {};
