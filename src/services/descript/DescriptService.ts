import { logger } from '../../utils/logger';
import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';

interface DescriptConfig {
  apiKey: string;
  baseUrl?: string;
}

interface DescriptEpisode {
  id: string;
  name: string;
  status: string;
  url?: string;
}

export class DescriptService {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(private config: DescriptConfig) {
    this.baseUrl = config.baseUrl || 'https://api.descript.com/v2';
    this.headers = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Accept': 'application/json',
      'User-Agent': 'CopernicusAI/1.0'
    };
  }

  async uploadPodcastAudio(audioPath: string, metadata: {
    name: string;
    speaker_name?: string;
  }): Promise<string> {
    try {
      const formData = new FormData();
      
      const stats = await fs.stat(audioPath);
      logger.info('File details:', {
        size: stats.size,
        path: audioPath
      });

      const fileBuffer = await fs.readFile(audioPath);
      formData.append('file', fileBuffer, {
        filename: path.basename(audioPath),
        contentType: 'audio/wav',
        knownLength: stats.size
      });

      formData.append('name', metadata.name);
      if (metadata.speaker_name) {
        formData.append('speaker_name', metadata.speaker_name);
      }

      const maskedHeaders = {
        ...this.headers,
        ...formData.getHeaders(),
        'Authorization': 'Bearer xxxxx...xxxxx'
      };

      logger.info('Making upload request:', {
        url: `${this.baseUrl}/projects/upload`,
        headers: maskedHeaders
      });

      const response = await fetch(`${this.baseUrl}/projects/upload`, {
        method: 'POST',
        headers: {
          ...this.headers,
          ...formData.getHeaders()
        },
        body: formData
      });

      logger.info('Response details:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('Error response body:', errorText);
        throw new Error(`Failed to upload audio: ${response.statusText} - ${errorText}`);
      }

      const { project_id } = await response.json();
      logger.info('Audio uploaded to Descript:', project_id);

      return project_id;
    } catch (error) {
      logger.error('Error uploading to Descript:', error);
      throw error;
    }
  }

  async createPodcastEpisode(projectId: string, metadata: {
    name: string;
    description?: string;
  }): Promise<DescriptEpisode> {
    try {
      const response = await fetch(`${this.baseUrl}/projects/${projectId}/publish`, {
        method: 'POST',
        headers: {
          ...this.headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: metadata.name,
          description: metadata.description,
          publish_type: 'podcast'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create podcast episode: ${response.statusText} - ${errorText}`);
      }

      const episode = await response.json();
      logger.info('Podcast episode created in Descript:', episode.id);

      return episode;
    } catch (error) {
      logger.error('Error creating podcast episode:', error);
      throw error;
    }
  }
} 