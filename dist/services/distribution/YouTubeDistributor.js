"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouTubeDistributor = void 0;
const googleapis_1 = require("googleapis");
const fs_1 = __importDefault(require("fs"));
class YouTubeDistributor {
    constructor(credentials) {
        this.oauth2Client = new googleapis_1.google.auth.OAuth2(credentials.client_id, credentials.client_secret, credentials.redirect_uris[0]);
        this.youtube = googleapis_1.google.youtube({
            version: 'v3',
            auth: this.oauth2Client
        });
    }
    async uploadPodcast(podcast) {
        try {
            console.log(`Starting upload for podcast: ${podcast.title}`);
            // Force token refresh before upload
            const token = await this.oauth2Client.getToken(this.oauth2Client.credentials);
            console.log('Auth details:', {
                hasToken: !!token.access_token,
                tokenType: token.token_type,
                scope: token.scope,
                subject: this.oauth2Client.credentials.email
            });
            const videoMetadata = {
                snippet: {
                    title: podcast.title,
                    description: this.generateDescription(podcast),
                    tags: ['AI Research', 'Podcast', 'Science', 'Technology'],
                    categoryId: '28' // Science & Technology category
                },
                status: {
                    privacyStatus: 'private', // Start as private for testing
                    selfDeclaredMadeForKids: false
                }
            };
            // Upload the video
            const videoResponse = await this.youtube.videos.insert({
                part: ['snippet', 'status'],
                requestBody: videoMetadata,
                media: {
                    body: fs_1.default.createReadStream(podcast.audioUrl)
                }
            });
            const videoId = videoResponse.data.id;
            if (!videoId) {
                throw new Error('Failed to get video ID from upload response');
            }
            const videoUrl = `https://youtube.com/watch?v=${videoId}`;
            console.log(`Successfully uploaded video: ${videoUrl}`);
            return videoUrl;
        }
        catch (error) {
            console.error('Failed to upload podcast to YouTube:', error);
            throw new Error(`YouTube upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    generateDescription(podcast) {
        return `
🎙️ AI Research Podcast

${podcast.title}

Listen to the full episode on our website:
${podcast.url}

#AIResearch #Podcast #Science #Technology

© ${new Date().getFullYear()} Copernicus AI
    `.trim();
    }
}
exports.YouTubeDistributor = YouTubeDistributor;
//# sourceMappingURL=YouTubeDistributor.js.map