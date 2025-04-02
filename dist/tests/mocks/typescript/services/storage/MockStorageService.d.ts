import { IStorageService } from '../../../../../services/storage/IStorageService';
import { StorageOptions, StorageResult, FileMetadata, FileInfo } from '../../../../../types/storage';
export declare class MockStorageService implements IStorageService {
    private files;
    private directories;
    constructor();
    uploadFile(filePath: string, content: string | Buffer, options: StorageOptions): Promise<StorageResult>;
    downloadFile(filePath: string): Promise<Buffer>;
    deleteFile(filePath: string): Promise<void>;
    listFiles(directory: string): Promise<FileInfo[]>;
    getFileMetadata(filePath: string): Promise<FileMetadata>;
    moveFile(sourcePath: string, destinationPath: string): Promise<StorageResult>;
    copyFile(sourcePath: string, destinationPath: string): Promise<StorageResult>;
    getFileContent(filePath: string): Buffer | undefined;
    getFileMetadataInternal(filePath: string): FileMetadata | undefined;
}
