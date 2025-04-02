import { IStorageService, StorageOptions, StorageResult } from './IStorageService';
export declare class GoogleCloudStorageService implements IStorageService {
    private storage;
    private bucket;
    constructor(projectId: string, bucketName: string);
    uploadFile(file: Buffer | string, options: StorageOptions): Promise<StorageResult>;
    downloadFile(path: string): Promise<Buffer>;
    deleteFile(path: string): Promise<void>;
    listFiles(prefix: string): Promise<string[]>;
    getFileMetadata(path: string): Promise<Record<string, string>>;
}
