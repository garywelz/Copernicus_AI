import { LogFilter, LogResult } from '../../types/logging';
export interface ILoggingService {
    debug(message: string, context?: Record<string, any>): Promise<void>;
    info(message: string, context?: Record<string, any>): Promise<void>;
    warn(message: string, context?: Record<string, any>): Promise<void>;
    error(message: string, error?: Error, context?: Record<string, any>): Promise<void>;
    getLogs(filter?: LogFilter): Promise<LogResult>;
    clearLogs(beforeDate: Date): Promise<void>;
}
