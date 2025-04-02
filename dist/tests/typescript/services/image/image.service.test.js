"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const ImageService_1 = require("../../../../services/image/ImageService");
(0, globals_1.describe)('Image Service', () => {
    let imageService;
    (0, globals_1.beforeEach)(() => {
        imageService = new ImageService_1.ImageService('test-project');
    });
    (0, globals_1.describe)('Image Generation', () => {
        (0, globals_1.test)('generates image with valid prompt', async () => {
            const prompt = 'A beautiful sunset over mountains';
            const options = {
                size: '1024x1024',
                quality: 'standard',
                style: 'natural'
            };
            const result = await imageService.generateImage(prompt, options);
            (0, globals_1.expect)(result).toBeDefined();
            (0, globals_1.expect)(result.url).toBeTruthy();
            (0, globals_1.expect)(result.metadata).toBeDefined();
        });
        (0, globals_1.test)('handles invalid prompts', async () => {
            const prompt = '';
            const options = {
                size: '1024x1024',
                quality: 'standard',
                style: 'natural'
            };
            await (0, globals_1.expect)(imageService.generateImage(prompt, options))
                .rejects.toThrow('Invalid prompt');
        });
        (0, globals_1.test)('handles API errors', async () => {
            const prompt = 'Test prompt';
            const options = {
                size: '1024x1024',
                quality: 'standard',
                style: 'natural'
            };
            // Mock API error
            globals_1.jest.spyOn(imageService, 'callImageAPI')
                .mockRejectedValueOnce(new Error('API Error'));
            await (0, globals_1.expect)(imageService.generateImage(prompt, options))
                .rejects.toThrow('API Error');
        });
    });
    (0, globals_1.describe)('Image Processing', () => {
        (0, globals_1.test)('optimizes image', async () => {
            const imageUrl = 'https://example.com/test.jpg';
            const options = {
                quality: 80,
                format: 'webp'
            };
            const result = await imageService.optimizeImage(imageUrl, options);
            (0, globals_1.expect)(result).toBeDefined();
            (0, globals_1.expect)(result.url).toBeTruthy();
            (0, globals_1.expect)(result.size).toBeLessThan(1024 * 1024); // Less than 1MB
        });
        (0, globals_1.test)('generates thumbnail', async () => {
            const imageUrl = 'https://example.com/test.jpg';
            const options = {
                width: 200,
                height: 200,
                crop: 'center'
            };
            const result = await imageService.generateThumbnail(imageUrl, options);
            (0, globals_1.expect)(result).toBeDefined();
            (0, globals_1.expect)(result.url).toBeTruthy();
            (0, globals_1.expect)(result.width).toBe(200);
            (0, globals_1.expect)(result.height).toBe(200);
        });
    });
    (0, globals_1.describe)('Image Validation', () => {
        (0, globals_1.test)('validates image format', async () => {
            const validUrl = 'https://example.com/test.jpg';
            const invalidUrl = 'https://example.com/test.txt';
            await (0, globals_1.expect)(imageService.validateImage(validUrl))
                .resolves.toBe(true);
            await (0, globals_1.expect)(imageService.validateImage(invalidUrl))
                .resolves.toBe(false);
        });
        (0, globals_1.test)('validates image dimensions', async () => {
            const imageUrl = 'https://example.com/test.jpg';
            const minWidth = 800;
            const minHeight = 600;
            const result = await imageService.validateImageDimensions(imageUrl, minWidth, minHeight);
            (0, globals_1.expect)(result).toBeDefined();
            (0, globals_1.expect)(result.isValid).toBe(true);
            (0, globals_1.expect)(result.width).toBeGreaterThanOrEqual(minWidth);
            (0, globals_1.expect)(result.height).toBeGreaterThanOrEqual(minHeight);
        });
    });
});
//# sourceMappingURL=image.service.test.js.map