"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockImageService = void 0;
class MockImageService {
    constructor() {
        this.mockImages = new Map();
        this.mockValidationResults = new Map();
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
    async generateImage(prompt, options) {
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
    async optimizeImage(imageUrl, options) {
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
    async generateThumbnail(imageUrl, options) {
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
    async validateImage(imageUrl) {
        return imageUrl.endsWith('.jpg') || imageUrl.endsWith('.png') || imageUrl.endsWith('.webp');
    }
    async validateImageDimensions(imageUrl, minWidth, minHeight) {
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
    setMockImage(prompt, image) {
        this.mockImages.set(prompt, image);
    }
    setMockValidationResult(imageUrl, result) {
        this.mockValidationResults.set(imageUrl, result);
    }
}
exports.MockImageService = MockImageService;
//# sourceMappingURL=MockImageService.js.map