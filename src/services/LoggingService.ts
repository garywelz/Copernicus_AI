import { AbstractBaseService } from './BaseService';
import { ServiceConfig, ServiceOptions, ServiceResult } from '../types/service';
import { ConfigurationError } from '../utils/errors';
import fs from 'fs';
import path from 'path';

/**
 * Log entry interface
 */
export interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
}

/**
 * Logging service configuration
 */
export interface LoggingServiceConfig extends ServiceConfig {
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    format: 'json' | 'text';
    destination: 'console' | 'file';
    filePath?: string;
  };
}

/**
 * Logging service implementation
 */
export class LoggingService extends AbstractBaseService {
  private logFile: fs.WriteStream | null = null;
  private logLevels: Record<LogEntry['level'], number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
  };

  constructor(options: ServiceOptions) {
    super(options);
  }

  /**
   * Initialize logging service
   */
  async initialize(): Promise<void> {
    await super.initialize();

    const config = this.getConfig() as LoggingServiceConfig;
    if (config.logging.destination === 'file' && config.logging.filePath) {
      const logDir = path.dirname(config.logging.filePath);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }

      this.logFile = fs.createWriteStream(config.logging.filePath, { flags: 'a' });
    }
  }

  /**
   * Clean up logging resources
   */
  async cleanup(): Promise<void> {
    if (this.logFile) {
      this.logFile.end();
      this.logFile = null;
    }
    await super.cleanup();
  }

  /**
   * Log a debug message
   */
  debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, context);
  }

  /**
   * Log an info message
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.log('error', message, context, error);
  }

  /**
   * Internal logging method
   */
  private log(
    level: LogEntry['level'],
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): void {
    const config = this.getConfig() as LoggingServiceConfig;
    const currentLevel = this.logLevels[level];
    const configuredLevel = this.logLevels[config.logging.level];

    if (currentLevel < configuredLevel) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error
    };

    const formattedLog = this.formatLogEntry(entry, config.logging.format);
    this.writeLog(formattedLog);
  }

  /**
   * Format log entry based on configured format
   */
  private formatLogEntry(entry: LogEntry, format: 'json' | 'text'): string {
    if (format === 'json') {
      return JSON.stringify(entry) + '\n';
    }

    const contextStr = entry.context
      ? ` ${JSON.stringify(entry.context)}`
      : '';
    const errorStr = entry.error
      ? `\nError: ${entry.error.message}\nStack: ${entry.error.stack}`
      : '';

    return `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}${contextStr}${errorStr}\n`;
  }

  /**
   * Write log entry to configured destination
   */
  private writeLog(log: string): void {
    const config = this.getConfig() as LoggingServiceConfig;

    if (config.logging.destination === 'file' && this.logFile) {
      this.logFile.write(log);
    } else {
      process.stdout.write(log);
    }
  }

  /**
   * Get service configuration
   */
  private getConfig(): ServiceConfig {
    return this.config;
  }
} 