import { Storage } from '@google-cloud/storage';
import { IStorageService, StorageOptions, StorageResult } from './IStorageService';

export class GoogleCloudStorageService implements IStorageService {
    private storage: Storage;
    private bucket: string;

    constructor(projectId: string, bucketName: string) {
        this.storage = new Storage({ projectId });
        this.bucket = bucketName;
    }

    async uploadFile(file: Buffer | string, options: StorageOptions): Promise<StorageResult> {
        const bucket = this.storage.bucket(this.bucket);
        const blob = bucket.file(options.path);
        
        const metadata = {
            contentType: options.contentType || 'application/octet-stream',
            metadata: options.metadata || {}
        };

        await blob.save(file, metadata);

        const [url] = await blob.getSignedUrl({
            action: 'read',
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        const [metadataResult] = await blob.getMetadata();

        return {
            url,
            path: options.path,
            size: metadataResult.size,
            contentType: metadataResult.contentType,
            metadata: metadataResult.metadata || {},
            uploadedAt: metadataResult.timeCreated
        };
    }

    async downloadFile(path: string): Promise<Buffer> {
        const bucket = this.storage.bucket(this.bucket);
        const blob = bucket.file(path);
        const [buffer] = await blob.download();
        return buffer;
    }

    async deleteFile(path: string): Promise<void> {
        const bucket = this.storage.bucket(this.bucket);
        const blob = bucket.file(path);
        await blob.delete();
    }

    async listFiles(prefix: string): Promise<string[]> {
        const bucket = this.storage.bucket(this.bucket);
        const [files] = await bucket.getFiles({ prefix });
        return files.map(file => file.name);
    }

    async getFileMetadata(path: string): Promise<Record<string, string>> {
        const bucket = this.storage.bucket(this.bucket);
        const blob = bucket.file(path);
        const [metadata] = await blob.getMetadata();
        return metadata.metadata || {};
    }
} 