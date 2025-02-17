import { ITwitterService } from '../interfaces/ITwitterService';
import { AudioProcessor } from '../../utils/audio';
import type { Podcast } from '../../types/podcast';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import type { TweetResponse } from '@/types/twitter';

const execAsync = promisify(exec);

export class PodcastDistributor {
  constructor(
    private twitterService: ITwitterService,
    private audioProcessor: AudioProcessor
  ) {}

  async shareToTwitter(podcast: Podcast): Promise<TweetResponse> {
    try {
      // Create a short preview clip
      const previewClip = await this.createPreviewClip(podcast.audioUrl, 60);
      
      // Post to Twitter with preview
      const tweetResponse = await this.twitterService.postTweet({
        text: `🎙️ New Episode: ${podcast.title}\n\nListen to the full episode here: ${podcast.url}\n\n#AIResearch #Podcast`,
        media: {
          imageData: previewClip,
          mimeType: 'video/mp4'
        }
      });
      return tweetResponse;
    } catch (error) {
      throw new Error(`Failed to share podcast to Twitter: ${error}`);
    }
  }

  private async createPreviewClip(audioUrl: string, duration: number): Promise<Buffer> {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'podcast-preview-'));
    const outputPath = path.join(tempDir, 'preview.mp4');

    try {
      // Download audio file if it's a URL
      const inputPath = audioUrl.startsWith('http') 
        ? await this.downloadAudio(audioUrl, tempDir)
        : audioUrl;

      // Create video from audio with waveform visualization
      await execAsync(`ffmpeg -i "${inputPath}" -t ${duration} \
        -filter_complex "[0:a]showwaves=s=1280x720:mode=line:rate=25,format=yuv420p[v]" \
        -map "[v]" -map 0:a \
        -c:v libx264 -c:a aac \
        -shortest "${outputPath}"`);

      // Read the generated video file
      const videoBuffer = await fs.readFile(outputPath);
      return videoBuffer;

    } catch (error) {
      throw new Error(`Failed to create preview clip: ${error}`);
    } finally {
      // Cleanup temp directory
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  }

  private async downloadAudio(url: string, tempDir: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download audio: ${response.statusText}`);
    }

    const audioPath = path.join(tempDir, 'input.mp3');
    const buffer = await response.arrayBuffer();
    await fs.writeFile(audioPath, Buffer.from(buffer));
    return audioPath;
  }
} 