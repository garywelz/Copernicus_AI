import { LogLevel, LogEntry } from '../types/logging';

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = 'info';
  private entries: LogEntry[] = [];

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
    return levels[level] >= levels[this.logLevel];
  }

  private createEntry(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): LogEntry {
    return {
      timestamp: new Date(),
      level,
      message,
      context,
      error
    };
  }

  debug(message: string, context?: Record<string, any>): void {
    if (this.shouldLog('debug')) {
      const entry = this.createEntry('debug', message, context);
      this.entries.push(entry);
      console.debug(message, context);
    }
  }

  info(message: string, context?: Record<string, any>): void {
    if (this.shouldLog('info')) {
      const entry = this.createEntry('info', message, context);
      this.entries.push(entry);
      console.info(message, context);
    }
  }

  warn(message: string, context?: Record<string, any>): void {
    if (this.shouldLog('warn')) {
      const entry = this.createEntry('warn', message, context);
      this.entries.push(entry);
      console.warn(message, context);
    }
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    if (this.shouldLog('error')) {
      const entry = this.createEntry('error', message, context, error);
      this.entries.push(entry);
      console.error(message, error, context);
    }
  }

  getEntries(level?: LogLevel, startTime?: Date, endTime?: Date): LogEntry[] {
    return this.entries.filter(entry => {
      if (level && entry.level !== level) return false;
      if (startTime && entry.timestamp < startTime) return false;
      if (endTime && entry.timestamp > endTime) return false;
      return true;
    });
  }

  clear(): void {
    this.entries = [];
  }
}

export const logger = Logger.getInstance(); 