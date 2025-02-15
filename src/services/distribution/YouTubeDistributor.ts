import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import type { Podcast } from '../../types/podcast';
import fs from 'fs';
import path from 'path';

interface OAuthCredentials {
  client_id: string;
  client_secret: string;
  redirect_uris: string[];
}

export class YouTubeDistributor {
  private youtube;
  private oauth2Client: OAuth2Client;

  constructor(credentials: OAuthCredentials) {
    this.oauth2Client = new google.auth.OAuth2(
      credentials.client_id,
      credentials.client_secret,
      credentials.redirect_uris[0]
    );

    this.youtube = google.youtube({
      version: 'v3',
      auth: this.oauth2Client
    });
  }

  async uploadPodcast(podcast: Podcast): Promise<string> {
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
          body: fs.createReadStream(podcast.audioUrl)
        }
      });

      const videoId = videoResponse.data.id;
      if (!videoId) {
        throw new Error('Failed to get video ID from upload response');
      }

      const videoUrl = `https://youtube.com/watch?v=${videoId}`;
      console.log(`Successfully uploaded video: ${videoUrl}`);
      
      return videoUrl;
    } catch (error) {
      console.error('Failed to upload podcast to YouTube:', error);
      throw new Error(`YouTube upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private generateDescription(podcast: Podcast): string {
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