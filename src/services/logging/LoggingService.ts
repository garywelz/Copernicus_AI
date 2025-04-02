import { ILoggingService, LogLevel, LogEntry } from './ILoggingService';
import { Storage } from '@google-cloud/storage';

export class LoggingService implements ILoggingService {
    private storage: Storage;
    private bucket: string;
    private prefix: string;

    constructor(projectId: string, bucketName: string, prefix: string = 'logs') {
        this.storage = new Storage({ projectId });
        this.bucket = bucketName;
        this.prefix = prefix;
    }

    private async writeLog(entry: LogEntry): Promise<void> {
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

    debug(message: string, context?: Record<string, any>): void {
        this.writeLog({
            level: LogLevel.DEBUG,
            message,
            timestamp: new Date().toISOString(),
            context
        });
    }

    info(message: string, context?: Record<string, any>): void {
        this.writeLog({
            level: LogLevel.INFO,
            message,
            timestamp: new Date().toISOString(),
            context
        });
    }

    warn(message: string, context?: Record<string, any>): void {
        this.writeLog({
            level: LogLevel.WARN,
            message,
            timestamp: new Date().toISOString(),
            context
        });
    }

    error(message: string, error?: Error, context?: Record<string, any>): void {
        this.writeLog({
            level: LogLevel.ERROR,
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

    async getLogs(level?: LogLevel, startTime?: Date, endTime?: Date): Promise<LogEntry[]> {
        const bucket = this.storage.bucket(this.bucket);
        const prefix = this.prefix;
        
        const [files] = await bucket.getFiles({ prefix });
        const logs: LogEntry[] = [];

        for (const file of files) {
            const [buffer] = await file.download();
            const entry: LogEntry = JSON.parse(buffer.toString());
            
            if (level && entry.level !== level) continue;
            if (startTime && new Date(entry.timestamp) < startTime) continue;
            if (endTime && new Date(entry.timestamp) > endTime) continue;

            logs.push(entry);
        }

        return logs.sort((a, b) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
    }

    async clearLogs(before?: Date): Promise<void> {
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