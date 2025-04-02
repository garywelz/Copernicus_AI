import { IStorageService } from '../../../../../services/storage/IStorageService';
import { StorageOptions, StorageResult, FileMetadata, FileInfo } from '../../../../../types/storage';

export class MockStorageService implements IStorageService {
  private files: Map<string, { content: Buffer; metadata: FileMetadata }> = new Map();
  private directories: Set<string> = new Set();

  constructor() {
    // Initialize with some mock data
    this.files.set('test/file.txt', {
      content: Buffer.from('test content'),
      metadata: {
        contentType: 'text/plain',
        size: 12,
        lastModified: new Date(),
        metadata: { test: 'value' }
      }
    });
  }

  async uploadFile(
    filePath: string,
    content: string | Buffer,
    options: StorageOptions
  ): Promise<StorageResult> {
    const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content);
    const metadata: FileMetadata = {
      contentType: options.contentType,
      size: buffer.length,
      lastModified: new Date(),
      metadata: options.metadata
    };

    this.files.set(filePath, { content: buffer, metadata });
    
    return {
      url: `https://example.com/${filePath}`,
      size: buffer.length,
      metadata: options.metadata
    };
  }

  async downloadFile(filePath: string): Promise<Buffer> {
    const file = this.files.get(filePath);
    if (!file) {
      throw new Error('File not found');
    }
    return file.content;
  }

  async deleteFile(filePath: string): Promise<void> {
    this.files.delete(filePath);
  }

  async listFiles(directory: string): Promise<FileInfo[]> {
    const files: FileInfo[] = [];
    Array.from(this.files.entries()).forEach(([path, file]) => {
      if (path.startsWith(directory)) {
        files.push({
          name: path,
          size: file.metadata.size,
          lastModified: file.metadata.lastModified,
          isDirectory: false
        });
      }
    });
    return files;
  }

  async getFileMetadata(filePath: string): Promise<FileMetadata> {
    const file = this.files.get(filePath);
    if (!file) {
      throw new Error('File not found');
    }
    return file.metadata;
  }

  async moveFile(sourcePath: string, destinationPath: string): Promise<StorageResult> {
    const file = this.files.get(sourcePath);
    if (!file) {
      throw new Error('Source file not found');
    }

    this.files.set(destinationPath, file);
    this.files.delete(sourcePath);

    return {
      url: `https://example.com/${destinationPath}`,
      size: file.metadata.size,
      metadata: file.metadata.metadata
    };
  }

  async copyFile(sourcePath: string, destinationPath: string): Promise<StorageResult> {
    const file = this.files.get(sourcePath);
    if (!file) {
      throw new Error('Source file not found');
    }

    this.files.set(destinationPath, file);

    return {
      url: `https://example.com/${destinationPath}`,
      size: file.metadata.size,
      metadata: file.metadata.metadata
    };
  }

  // Helper methods for testing
  getFileContent(filePath: string): Buffer | undefined {
    return this.files.get(filePath)?.content;
  }

  getFileMetadataInternal(filePath: string): FileMetadata | undefined {
    return this.files.get(filePath)?.metadata;
  }
} 