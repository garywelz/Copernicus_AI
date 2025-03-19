import { DescriptService } from '../../src/services/descript/DescriptService';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';

dotenv.config();

async function testDescriptUpload() {
  if (!process.env.DESCRIPT_API_KEY) {
    throw new Error('DESCRIPT_API_KEY is required in .env file');
  }

  console.log('Using API Key:', process.env.DESCRIPT_API_KEY.substring(0, 10) + '...');
  
  const descriptService = new DescriptService({
    apiKey: process.env.DESCRIPT_API_KEY
  });

  const audioPath = path.join(process.cwd(), 'assets/audio/exports/black-holes-podcast.wav');
  console.log('Audio file path:', audioPath);

  try {
    // Verify file exists
    await fs.access(audioPath);
    console.log('Audio file exists and is accessible');

    // Upload the audio file
    const projectId = await descriptService.uploadPodcastAudio(audioPath, {
      name: 'Black Holes Podcast',
      speaker_name: 'Copernicus AI'
    });

    console.log('Successfully uploaded to Descript, project ID:', projectId);

    // Create a podcast episode
    const episode = await descriptService.createPodcastEpisode(projectId, {
      name: 'Understanding Black Holes',
      description: 'A mathematical exploration of black holes and their properties.'
    });

    console.log('Successfully created podcast episode:', episode);
  } catch (error) {
    console.error('Failed to process with Descript:', error);
  }
}

testDescriptUpload(); 