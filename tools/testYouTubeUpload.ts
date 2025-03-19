import { YouTubeService } from '../src/services/youtube/YouTubeService';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

async function testUpload() {
  const youtubeService = new YouTubeService({
    clientId: process.env.YOUTUBE_CLIENT_ID!,
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET!,
    refreshToken: process.env.YOUTUBE_REFRESH_TOKEN!
  });

  // Use an existing video from your project
  const videoPath = path.join(__dirname, '../public/videos/sample.mp4');
  // or specify a direct path to your video
  // const videoPath = '/path/to/your/video.mp4';

  try {
    const result = await youtubeService.uploadVideo({
      title: 'Test Upload from Copernicus AI',
      description: 'This is a test upload from our podcast automation system',
      videoPath,
      privacyStatus: 'private'
    });

    console.log('Upload successful:', result);
  } catch (error) {
    console.error('Upload failed:', error);
  }
}

testUpload(); 