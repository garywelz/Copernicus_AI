"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockStorageService = void 0;
class MockStorageService {
    constructor() {
        this.files = new Map();
        this.directories = new Set();
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
    async uploadFile(filePath, content, options) {
        const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content);
        const metadata = {
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
    async downloadFile(filePath) {
        const file = this.files.get(filePath);
        if (!file) {
            throw new Error('File not found');
        }
        return file.content;
    }
    async deleteFile(filePath) {
        this.files.delete(filePath);
    }
    async listFiles(directory) {
        const files = [];
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
    async getFileMetadata(filePath) {
        const file = this.files.get(filePath);
        if (!file) {
            throw new Error('File not found');
        }
        return file.metadata;
    }
    async moveFile(sourcePath, destinationPath) {
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
    async copyFile(sourcePath, destinationPath) {
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
    getFileContent(filePath) {
        return this.files.get(filePath)?.content;
    }
    getFileMetadataInternal(filePath) {
        return this.files.get(filePath)?.metadata;
    }
}
exports.MockStorageService = MockStorageService;
//# sourceMappingURL=MockStorageService.js.map