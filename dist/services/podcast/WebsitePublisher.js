"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsitePublisher = void 0;
class WebsitePublisher {
    constructor(config) {
        this.config = config;
    }
    async publishToWebsite(podcast) {
        // Implementation for publishing to your website
        // Could use Next.js API routes
        const response = await fetch(`${this.config.baseUrl}/api/podcasts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(podcast)
        });
        if (!response.ok) {
            throw new Error('Failed to publish to website');
        }
        const { url } = await response.json();
        return url;
    }
}
exports.WebsitePublisher = WebsitePublisher;
//# sourceMappingURL=WebsitePublisher.js.map