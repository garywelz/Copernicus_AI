import { YouTubeDistributor } from '../dist/services/distribution/YouTubeDistributor.js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import ffmpeg from 'fluent-ffmpeg';

dotenv.config();

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createTestVideo() {
  // Create a test directory if it doesn't exist
  const testDir = path.join(__dirname, '../test/fixtures');
  await fs.mkdir(testDir, { recursive: true });

  // Create a simple test video file (5 seconds of black)
  const testVideoPath = path.join(testDir, 'test-video.mp4');
  
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input('color=c=black:s=1280x720:d=5') // 5 seconds of black screen
      .inputFormat('lavfi')
      .outputOptions('-c:v libx264')
      .save(testVideoPath)
      .on('end', () => resolve(testVideoPath))
      .on('error', reject);
  });
}

async function testYouTubeUpload() {
  try {
    // Read OAuth credentials and tokens
    const credentialsPath = path.join(__dirname, '../client_secret.json');
    const tokensPath = path.join(__dirname, '../youtube_tokens.json');
    
    const credentials = JSON.parse(await fs.readFile(credentialsPath, 'utf8'));
    const tokens = JSON.parse(await fs.readFile(tokensPath, 'utf8'));

    const distributor = new YouTubeDistributor({
      client_id: credentials.installed.client_id,
      client_secret: credentials.installed.client_secret,
      redirect_uris: credentials.installed.redirect_uris,
      tokens // Add the tokens
    });

    console.log('Creating test video...');
    const videoPath = await createTestVideo();

    // Verify video file exists
    const stats = await fs.stat(videoPath);
    console.log('Test video created:', {
      path: videoPath,
      size: stats.size,
      exists: true
    });

    // Add debug logging
    console.log('Using credentials:', {
      client_id: credentials.installed.client_id,
      hasClientSecret: !!credentials.installed.client_secret,
      redirect_uris: credentials.installed.redirect_uris
    });

    const testPodcast = {
      title: "Test Upload - Copernicus AI",
      url: "https://copernicus.ai/test",
      audioUrl: videoPath,
      duration: 5
    };

    console.log('Starting YouTube upload...');
    const videoUrl = await distributor.uploadPodcast(testPodcast);
    console.log('Upload successful!');
    console.log('Video URL:', videoUrl);
  } catch (error) {
    console.error('Upload failed:', error);
  }
}

testYouTubeUpload(); 