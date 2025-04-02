import { PodcastGenerator } from '../../src/services/podcast/PodcastGenerator';
import { ElevenLabsService } from '../../src/services/voice/ElevenLabsService';
import { shortSamplePodcastTemplate } from '../../src/config/podcastTemplates';
import fs from 'fs/promises';
import path from 'path';

async function generateBlackHolesPodcast() {
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error('Please set ELEVENLABS_API_KEY environment variable');
  }

  // Add logging to verify the key
  console.log('API Key loaded:', process.env.ELEVENLABS_API_KEY?.substring(0, 5) + '...');

  // Initialize services
  const ttsService = new ElevenLabsService(
    process.env.ELEVENLABS_API_KEY,
    {
      fadeInDuration: 0.5,
      fadeOutDuration: 0.5,
      pauseDuration: 0.3
    }
  );

  const generator = new PodcastGenerator(ttsService);

  try {
    // Generate the podcast audio
    const podcastAudio = await generator.generatePodcast(shortSamplePodcastTemplate);

    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'output');
    await fs.mkdir(outputDir, { recursive: true });

    // Save with a unique name
    const outputPath = path.join(outputDir, 'black-holes-podcast.mp3');
    await fs.writeFile(outputPath, podcastAudio);

    console.log(`Black Holes podcast generated successfully! Saved to: ${outputPath}`);
  } catch (error) {
    console.error('Failed to generate podcast:', error);
  }
}

generateBlackHolesPodcast();
