import { IImageService } from '../../../../../services/image/IImageService';
import { ImageGenerationOptions, ImageProcessingOptions, ThumbnailOptions, GeneratedImage, ImageValidationResult } from '../../../../../types/image';

export class MockImageService implements IImageService {
  private mockImages: Map<string, GeneratedImage> = new Map();
  private mockValidationResults: Map<string, ImageValidationResult> = new Map();

  constructor() {
    // Initialize with some mock data
    this.mockImages.set('test', {
      url: 'https://example.com/test.jpg',
      metadata: {
        width: 1024,
        height: 1024,
        format: 'jpeg',
        size: 1024 * 1024
      }
    });
  }

  async generateImage(prompt: string, options: ImageGenerationOptions): Promise<GeneratedImage> {
    const result = this.mockImages.get(prompt) || {
      url: `https://example.com/${prompt}.jpg`,
      metadata: {
        width: parseInt(options.size.split('x')[0]),
        height: parseInt(options.size.split('x')[1]),
        format: 'jpeg',
        size: 1024 * 1024,
        quality: options.quality,
        style: options.style
      }
    };
    return result;
  }

  async optimizeImage(imageUrl: string, options: ImageProcessingOptions): Promise<GeneratedImage> {
    return {
      url: imageUrl.replace('.jpg', '_optimized.webp'),
      metadata: {
        width: 1024,
        height: 1024,
        format: options.format,
        size: 512 * 512,
        quality: options.quality
      }
    };
  }

  async generateThumbnail(imageUrl: string, options: ThumbnailOptions): Promise<GeneratedImage> {
    return {
      url: imageUrl.replace('.jpg', '_thumb.jpg'),
      metadata: {
        width: options.width,
        height: options.height,
        format: 'jpeg',
        size: options.width * options.height,
        crop: options.crop
      }
    };
  }

  async validateImage(imageUrl: string): Promise<boolean> {
    return imageUrl.endsWith('.jpg') || imageUrl.endsWith('.png') || imageUrl.endsWith('.webp');
  }

  async validateImageDimensions(
    imageUrl: string,
    minWidth: number,
    minHeight: number
  ): Promise<ImageValidationResult> {
    const result = this.mockValidationResults.get(imageUrl) || {
      isValid: true,
      width: 1024,
      height: 1024,
      format: 'jpeg',
      size: 1024 * 1024
    };
    return result;
  }

  // Helper methods for testing
  setMockImage(prompt: string, image: GeneratedImage): void {
    this.mockImages.set(prompt, image);
  }

  setMockValidationResult(imageUrl: string, result: ImageValidationResult): void {
    this.mockValidationResults.set(imageUrl, result);
  }
} 