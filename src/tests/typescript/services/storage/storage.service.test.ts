import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { IStorageService } from '../../../../services/storage/IStorageService';
import { StorageService } from '../../../../services/storage/StorageService';
import { StorageOptions } from '../../../../types/storage';

describe('Storage Service', () => {
  let storageService: IStorageService;

  beforeEach(() => {
    storageService = new StorageService('test-project', 'test-bucket');
  });

  describe('File Operations', () => {
    test('uploads file successfully', async () => {
      const filePath = 'test/file.txt';
      const content = 'Test content';
      const options: StorageOptions = {
        contentType: 'text/plain',
        metadata: { test: 'value' }
      };

      const result = await storageService.uploadFile(filePath, content, options);
      
      expect(result).toBeDefined();
      expect(result.url).toBeTruthy();
      expect(result.size).toBeGreaterThan(0);
    });

    test('downloads file successfully', async () => {
      const filePath = 'test/file.txt';
      const result = await storageService.downloadFile(filePath);
      
      expect(result).toBeDefined();
      expect(result.content).toBeTruthy();
      expect(result.metadata).toBeDefined();
    });

    test('deletes file successfully', async () => {
      const filePath = 'test/file.txt';
      await expect(storageService.deleteFile(filePath))
        .resolves.not.toThrow();
    });
  });

  describe('Directory Operations', () => {
    test('lists files in directory', async () => {
      const directory = 'test/';
      const result = await storageService.listFiles(directory);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('size');
    });

    test('creates directory', async () => {
      const directory = 'test/new-dir/';
      await expect(storageService.createDirectory(directory))
        .resolves.not.toThrow();
    });

    test('deletes directory', async () => {
      const directory = 'test/';
      await expect(storageService.deleteDirectory(directory))
        .resolves.not.toThrow();
    });
  });

  describe('File Management', () => {
    test('moves file', async () => {
      const sourcePath = 'test/file.txt';
      const destinationPath = 'test/moved/file.txt';
      
      const result = await storageService.moveFile(sourcePath, destinationPath);
      
      expect(result).toBeDefined();
      expect(result.url).toBeTruthy();
    });

    test('copies file', async () => {
      const sourcePath = 'test/file.txt';
      const destinationPath = 'test/copied/file.txt';
      
      const result = await storageService.copyFile(sourcePath, destinationPath);
      
      expect(result).toBeDefined();
      expect(result.url).toBeTruthy();
    });

    test('gets file metadata', async () => {
      const filePath = 'test/file.txt';
      const result = await storageService.getFileMetadata(filePath);
      
      expect(result).toBeDefined();
      expect(result.contentType).toBeTruthy();
      expect(result.size).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    test('handles non-existent file', async () => {
      const filePath = 'test/nonexistent.txt';
      
      await expect(storageService.downloadFile(filePath))
        .rejects.toThrow('File not found');
    });

    test('handles invalid file path', async () => {
      const filePath = '';
      
      await expect(storageService.uploadFile(filePath, 'content'))
        .rejects.toThrow('Invalid file path');
    });

    test('handles permission errors', async () => {
      const filePath = 'test/file.txt';
      
      // Mock permission error
      jest.spyOn(storageService as any, 'uploadToStorage')
        .mockRejectedValueOnce(new Error('Permission denied'));
      
      await expect(storageService.uploadFile(filePath, 'content'))
        .rejects.toThrow('Permission denied');
    });
  });
}); 