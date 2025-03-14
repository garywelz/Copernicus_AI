import { google } from 'googleapis';
import { createReadStream } from 'fs';
import type { GaxiosResponse } from 'googleapis-common';
import type { youtube_v3 } from 'googleapis';

interface UploadOptions {
  title: string;
  description: string;
  tags?: string[];
  privacyStatus?: 'private' | 'unlisted' | 'public';
  videoPath: string;
}

export class YouTubeService {
  private youtube: youtube_v3.Youtube;
  
  constructor(credentials: {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
  }) {
    const oauth2Client = new google.auth.OAuth2(
      credentials.clientId,
      credentials.clientSecret
    );
    
    oauth2Client.setCredentials({
      refresh_token: credentials.refreshToken
    });

    this.youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client
    });
  }

  async uploadVideo(options: UploadOptions) {
    try {
      const response = await this.youtube.videos.insert({
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title: options.title,
            description: options.description,
            tags: options.tags
          },
          status: {
            privacyStatus: options.privacyStatus || 'private'
          }
        },
        media: {
          body: createReadStream(options.videoPath)
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  }
} 