import { OpenAI } from 'openai';
import { IImageService, ImageGenerationOptions, GeneratedImage } from './IImageService';

export class ImageService implements IImageService {
    private openai: OpenAI;

    constructor(apiKey: string) {
        this.openai = new OpenAI({ apiKey });
    }

    async generateThumbnail(options: ImageGenerationOptions): Promise<GeneratedImage> {
        const response = await this.openai.images.generate({
            model: "dall-e-3",
            prompt: options.prompt,
            size: options.size || "1024x1024",
            quality: "standard",
            style: options.style || "natural",
            response_format: "url"
        });

        return {
            url: response.data[0].url || '',
            metadata: {
                prompt: options.prompt,
                size: options.size || "1024x1024",
                style: options.style || "natural",
                format: options.format || "png",
                generatedAt: new Date().toISOString()
            }
        };
    }

    async generateEpisodeImage(episodeTitle: string, description: string): Promise<GeneratedImage> {
        const prompt = `Create a professional podcast thumbnail for an episode titled "${episodeTitle}". 
                       The episode is about: ${description}. 
                       Use a modern, clean design with bold typography and relevant imagery.`;

        return this.generateThumbnail({
            prompt,
            style: 'artistic',
            size: '1024x1024'
        });
    }

    async generateNewsImage(category: string, headline: string): Promise<GeneratedImage> {
        const prompt = `Create a news-style thumbnail for a ${category} news story: "${headline}". 
                       Use a professional, journalistic style with clear typography and relevant imagery.`;

        return this.generateThumbnail({
            prompt,
            style: 'realistic',
            size: '1024x1024'
        });
    }
} 