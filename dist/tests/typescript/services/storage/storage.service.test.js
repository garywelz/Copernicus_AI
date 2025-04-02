"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const StorageService_1 = require("../../../../services/storage/StorageService");
(0, globals_1.describe)('Storage Service', () => {
    let storageService;
    (0, globals_1.beforeEach)(() => {
        storageService = new StorageService_1.StorageService('test-project', 'test-bucket');
    });
    (0, globals_1.describe)('File Operations', () => {
        (0, globals_1.test)('uploads file successfully', async () => {
            const filePath = 'test/file.txt';
            const content = 'Test content';
            const options = {
                contentType: 'text/plain',
                metadata: { test: 'value' }
            };
            const result = await storageService.uploadFile(filePath, content, options);
            (0, globals_1.expect)(result).toBeDefined();
            (0, globals_1.expect)(result.url).toBeTruthy();
            (0, globals_1.expect)(result.size).toBeGreaterThan(0);
        });
        (0, globals_1.test)('downloads file successfully', async () => {
            const filePath = 'test/file.txt';
            const result = await storageService.downloadFile(filePath);
            (0, globals_1.expect)(result).toBeDefined();
            (0, globals_1.expect)(result.content).toBeTruthy();
            (0, globals_1.expect)(result.metadata).toBeDefined();
        });
        (0, globals_1.test)('deletes file successfully', async () => {
            const filePath = 'test/file.txt';
            await (0, globals_1.expect)(storageService.deleteFile(filePath))
                .resolves.not.toThrow();
        });
    });
    (0, globals_1.describe)('Directory Operations', () => {
        (0, globals_1.test)('lists files in directory', async () => {
            const directory = 'test/';
            const result = await storageService.listFiles(directory);
            (0, globals_1.expect)(Array.isArray(result)).toBe(true);
            (0, globals_1.expect)(result[0]).toHaveProperty('name');
            (0, globals_1.expect)(result[0]).toHaveProperty('size');
        });
        (0, globals_1.test)('creates directory', async () => {
            const directory = 'test/new-dir/';
            await (0, globals_1.expect)(storageService.createDirectory(directory))
                .resolves.not.toThrow();
        });
        (0, globals_1.test)('deletes directory', async () => {
            const directory = 'test/';
            await (0, globals_1.expect)(storageService.deleteDirectory(directory))
                .resolves.not.toThrow();
        });
    });
    (0, globals_1.describe)('File Management', () => {
        (0, globals_1.test)('moves file', async () => {
            const sourcePath = 'test/file.txt';
            const destinationPath = 'test/moved/file.txt';
            const result = await storageService.moveFile(sourcePath, destinationPath);
            (0, globals_1.expect)(result).toBeDefined();
            (0, globals_1.expect)(result.url).toBeTruthy();
        });
        (0, globals_1.test)('copies file', async () => {
            const sourcePath = 'test/file.txt';
            const destinationPath = 'test/copied/file.txt';
            const result = await storageService.copyFile(sourcePath, destinationPath);
            (0, globals_1.expect)(result).toBeDefined();
            (0, globals_1.expect)(result.url).toBeTruthy();
        });
        (0, globals_1.test)('gets file metadata', async () => {
            const filePath = 'test/file.txt';
            const result = await storageService.getFileMetadata(filePath);
            (0, globals_1.expect)(result).toBeDefined();
            (0, globals_1.expect)(result.contentType).toBeTruthy();
            (0, globals_1.expect)(result.size).toBeGreaterThan(0);
        });
    });
    (0, globals_1.describe)('Error Handling', () => {
        (0, globals_1.test)('handles non-existent file', async () => {
            const filePath = 'test/nonexistent.txt';
            await (0, globals_1.expect)(storageService.downloadFile(filePath))
                .rejects.toThrow('File not found');
        });
        (0, globals_1.test)('handles invalid file path', async () => {
            const filePath = '';
            await (0, globals_1.expect)(storageService.uploadFile(filePath, 'content'))
                .rejects.toThrow('Invalid file path');
        });
        (0, globals_1.test)('handles permission errors', async () => {
            const filePath = 'test/file.txt';
            // Mock permission error
            globals_1.jest.spyOn(storageService, 'uploadToStorage')
                .mockRejectedValueOnce(new Error('Permission denied'));
            await (0, globals_1.expect)(storageService.uploadFile(filePath, 'content'))
                .rejects.toThrow('Permission denied');
        });
    });
});
//# sourceMappingURL=storage.service.test.js.map