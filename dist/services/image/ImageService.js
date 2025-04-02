"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
const openai_1 = require("openai");
class ImageService {
    constructor(apiKey) {
        this.openai = new openai_1.OpenAI({ apiKey });
    }
    async generateThumbnail(options) {
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
    async generateEpisodeImage(episodeTitle, description) {
        const prompt = `Create a professional podcast thumbnail for an episode titled "${episodeTitle}". 
                       The episode is about: ${description}. 
                       Use a modern, clean design with bold typography and relevant imagery.`;
        return this.generateThumbnail({
            prompt,
            style: 'artistic',
            size: '1024x1024'
        });
    }
    async generateNewsImage(category, headline) {
        const prompt = `Create a news-style thumbnail for a ${category} news story: "${headline}". 
                       Use a professional, journalistic style with clear typography and relevant imagery.`;
        return this.generateThumbnail({
            prompt,
            style: 'realistic',
            size: '1024x1024'
        });
    }
}
exports.ImageService = ImageService;
//# sourceMappingURL=ImageService.js.map