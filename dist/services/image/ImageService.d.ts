import { IImageService, ImageGenerationOptions, GeneratedImage } from './IImageService';
export declare class ImageService implements IImageService {
    private openai;
    constructor(apiKey: string);
    generateThumbnail(options: ImageGenerationOptions): Promise<GeneratedImage>;
    generateEpisodeImage(episodeTitle: string, description: string): Promise<GeneratedImage>;
    generateNewsImage(category: string, headline: string): Promise<GeneratedImage>;
}
