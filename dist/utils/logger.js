"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
class Logger {
    constructor() {
        this.logLevel = 'info';
        this.entries = [];
    }
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    setLogLevel(level) {
        this.logLevel = level;
    }
    shouldLog(level) {
        const levels = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3
        };
        return levels[level] >= levels[this.logLevel];
    }
    createEntry(level, message, context, error) {
        return {
            timestamp: new Date(),
            level,
            message,
            context,
            error
        };
    }
    debug(message, context) {
        if (this.shouldLog('debug')) {
            const entry = this.createEntry('debug', message, context);
            this.entries.push(entry);
            console.debug(message, context);
        }
    }
    info(message, context) {
        if (this.shouldLog('info')) {
            const entry = this.createEntry('info', message, context);
            this.entries.push(entry);
            console.info(message, context);
        }
    }
    warn(message, context) {
        if (this.shouldLog('warn')) {
            const entry = this.createEntry('warn', message, context);
            this.entries.push(entry);
            console.warn(message, context);
        }
    }
    error(message, error, context) {
        if (this.shouldLog('error')) {
            const entry = this.createEntry('error', message, context, error);
            this.entries.push(entry);
            console.error(message, error, context);
        }
    }
    getEntries(level, startTime, endTime) {
        return this.entries.filter(entry => {
            if (level && entry.level !== level)
                return false;
            if (startTime && entry.timestamp < startTime)
                return false;
            if (endTime && entry.timestamp > endTime)
                return false;
            return true;
        });
    }
    clear() {
        this.entries = [];
    }
}
exports.logger = Logger.getInstance();
//# sourceMappingURL=logger.js.map