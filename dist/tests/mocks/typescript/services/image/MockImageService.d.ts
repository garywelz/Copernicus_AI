import { IImageService } from '../../../../../services/image/IImageService';
import { ImageGenerationOptions, ImageProcessingOptions, ThumbnailOptions, GeneratedImage, ImageValidationResult } from '../../../../../types/image';
export declare class MockImageService implements IImageService {
    private mockImages;
    private mockValidationResults;
    constructor();
    generateImage(prompt: string, options: ImageGenerationOptions): Promise<GeneratedImage>;
    optimizeImage(imageUrl: string, options: ImageProcessingOptions): Promise<GeneratedImage>;
    generateThumbnail(imageUrl: string, options: ThumbnailOptions): Promise<GeneratedImage>;
    validateImage(imageUrl: string): Promise<boolean>;
    validateImageDimensions(imageUrl: string, minWidth: number, minHeight: number): Promise<ImageValidationResult>;
    setMockImage(prompt: string, image: GeneratedImage): void;
    setMockValidationResult(imageUrl: string, result: ImageValidationResult): void;
}
