"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingService = void 0;
const ILoggingService_1 = require("./ILoggingService");
const storage_1 = require("@google-cloud/storage");
class LoggingService {
    constructor(projectId, bucketName, prefix = 'logs') {
        this.storage = new storage_1.Storage({ projectId });
        this.bucket = bucketName;
        this.prefix = prefix;
    }
    async writeLog(entry) {
        const bucket = this.storage.bucket(this.bucket);
        const filename = `${this.prefix}/${entry.timestamp}/${entry.level}.json`;
        const blob = bucket.file(filename);
        await blob.save(JSON.stringify(entry), {
            contentType: 'application/json',
            metadata: {
                level: entry.level,
                timestamp: entry.timestamp
            }
        });
    }
    debug(message, context) {
        this.writeLog({
            level: ILoggingService_1.LogLevel.DEBUG,
            message,
            timestamp: new Date().toISOString(),
            context
        });
    }
    info(message, context) {
        this.writeLog({
            level: ILoggingService_1.LogLevel.INFO,
            message,
            timestamp: new Date().toISOString(),
            context
        });
    }
    warn(message, context) {
        this.writeLog({
            level: ILoggingService_1.LogLevel.WARN,
            message,
            timestamp: new Date().toISOString(),
            context
        });
    }
    error(message, error, context) {
        this.writeLog({
            level: ILoggingService_1.LogLevel.ERROR,
            message,
            timestamp: new Date().toISOString(),
            context: {
                ...context,
                error: error ? {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                } : undefined
            },
            error
        });
    }
    async getLogs(level, startTime, endTime) {
        const bucket = this.storage.bucket(this.bucket);
        const prefix = this.prefix;
        const [files] = await bucket.getFiles({ prefix });
        const logs = [];
        for (const file of files) {
            const [buffer] = await file.download();
            const entry = JSON.parse(buffer.toString());
            if (level && entry.level !== level)
                continue;
            if (startTime && new Date(entry.timestamp) < startTime)
                continue;
            if (endTime && new Date(entry.timestamp) > endTime)
                continue;
            logs.push(entry);
        }
        return logs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
    async clearLogs(before) {
        const bucket = this.storage.bucket(this.bucket);
        const prefix = this.prefix;
        const [files] = await bucket.getFiles({ prefix });
        for (const file of files) {
            const [metadata] = await file.getMetadata();
            const timestamp = new Date(metadata.metadata?.timestamp || '');
            if (!before || timestamp < before) {
                await file.delete();
            }
        }
    }
}
exports.LoggingService = LoggingService;
//# sourceMappingURL=LoggingService.js.map