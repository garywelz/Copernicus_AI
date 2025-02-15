type LogLevel = 'error' | 'warn' | 'info' | 'debug';

class Logger {
  private logLevel: LogLevel = 'info';

  error(message: string, ...args: any[]) {
    console.error(message, ...args);
  }

  warn(message: string, ...args: any[]) {
    if (this.logLevel === 'error') return;
    console.warn(message, ...args);
  }

  info(message: string, ...args: any[]) {
    if (this.logLevel === 'error' || this.logLevel === 'warn') return;
    console.info(message, ...args);
  }

  debug(message: string, ...args: any[]) {
    if (this.logLevel !== 'debug') return;
    console.debug(message, ...args);
  }

  setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }
}

export const logger = new Logger(); 