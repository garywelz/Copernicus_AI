export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export interface LogEntry {
    timestamp: Date;
    level: LogLevel;
    message: string;
    context?: Record<string, any>;
    error?: Error;
}
export interface LogFilter {
    level?: LogLevel;
    startTime?: Date;
    endTime?: Date;
    search?: string;
    context?: Record<string, any>;
}
export interface LogResult {
    entries: LogEntry[];
    total: number;
    filtered: number;
    metadata?: Record<string, any>;
}
export interface LoggingError extends Error {
    code: string;
    context?: Record<string, any>;
}
