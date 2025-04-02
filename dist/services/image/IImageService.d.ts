import { ImageGenerationOptions, ImageProcessingOptions, ThumbnailOptions, GeneratedImage, ImageValidationResult } from '../../types/image';
export interface IImageService {
    generateImage(prompt: string, options: ImageGenerationOptions): Promise<GeneratedImage>;
    optimizeImage(imageUrl: string, options: ImageProcessingOptions): Promise<GeneratedImage>;
    generateThumbnail(imageUrl: string, options: ThumbnailOptions): Promise<GeneratedImage>;
    validateImage(imageUrl: string): Promise<boolean>;
    validateImageDimensions(imageUrl: string, minWidth: number, minHeight: number): Promise<ImageValidationResult>;
}
