import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { IImageService } from '../../../../services/image/IImageService';
import { ImageService } from '../../../../services/image/ImageService';
import { ImageGenerationOptions } from '../../../../types/image';

describe('Image Service', () => {
  let imageService: IImageService;

  beforeEach(() => {
    imageService = new ImageService('test-project');
  });

  describe('Image Generation', () => {
    test('generates image with valid prompt', async () => {
      const prompt = 'A beautiful sunset over mountains';
      const options: ImageGenerationOptions = {
        size: '1024x1024',
        quality: 'standard',
        style: 'natural'
      };

      const result = await imageService.generateImage(prompt, options);
      
      expect(result).toBeDefined();
      expect(result.url).toBeTruthy();
      expect(result.metadata).toBeDefined();
    });

    test('handles invalid prompts', async () => {
      const prompt = '';
      const options: ImageGenerationOptions = {
        size: '1024x1024',
        quality: 'standard',
        style: 'natural'
      };

      await expect(imageService.generateImage(prompt, options))
        .rejects.toThrow('Invalid prompt');
    });

    test('handles API errors', async () => {
      const prompt = 'Test prompt';
      const options: ImageGenerationOptions = {
        size: '1024x1024',
        quality: 'standard',
        style: 'natural'
      };

      // Mock API error
      jest.spyOn(imageService as any, 'callImageAPI')
        .mockRejectedValueOnce(new Error('API Error'));

      await expect(imageService.generateImage(prompt, options))
        .rejects.toThrow('API Error');
    });
  });

  describe('Image Processing', () => {
    test('optimizes image', async () => {
      const imageUrl = 'https://example.com/test.jpg';
      const options = {
        quality: 80,
        format: 'webp'
      };

      const result = await imageService.optimizeImage(imageUrl, options);
      
      expect(result).toBeDefined();
      expect(result.url).toBeTruthy();
      expect(result.size).toBeLessThan(1024 * 1024); // Less than 1MB
    });

    test('generates thumbnail', async () => {
      const imageUrl = 'https://example.com/test.jpg';
      const options = {
        width: 200,
        height: 200,
        crop: 'center'
      };

      const result = await imageService.generateThumbnail(imageUrl, options);
      
      expect(result).toBeDefined();
      expect(result.url).toBeTruthy();
      expect(result.width).toBe(200);
      expect(result.height).toBe(200);
    });
  });

  describe('Image Validation', () => {
    test('validates image format', async () => {
      const validUrl = 'https://example.com/test.jpg';
      const invalidUrl = 'https://example.com/test.txt';

      await expect(imageService.validateImage(validUrl))
        .resolves.toBe(true);

      await expect(imageService.validateImage(invalidUrl))
        .resolves.toBe(false);
    });

    test('validates image dimensions', async () => {
      const imageUrl = 'https://example.com/test.jpg';
      const minWidth = 800;
      const minHeight = 600;

      const result = await imageService.validateImageDimensions(
        imageUrl,
        minWidth,
        minHeight
      );

      expect(result).toBeDefined();
      expect(result.isValid).toBe(true);
      expect(result.width).toBeGreaterThanOrEqual(minWidth);
      expect(result.height).toBeGreaterThanOrEqual(minHeight);
    });
  });
}); 