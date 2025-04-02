import { StorageOptions, StorageResult, FileMetadata, FileInfo } from '../../types/storage';
export interface IStorageService {
    uploadFile(filePath: string, content: string | Buffer, options: StorageOptions): Promise<StorageResult>;
    downloadFile(filePath: string): Promise<Buffer>;
    deleteFile(filePath: string): Promise<void>;
    listFiles(directory: string): Promise<FileInfo[]>;
    getFileMetadata(filePath: string): Promise<FileMetadata>;
    moveFile(sourcePath: string, destinationPath: string): Promise<StorageResult>;
    copyFile(sourcePath: string, destinationPath: string): Promise<StorageResult>;
}
