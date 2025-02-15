import { PodcastGenerator } from '../services/podcast/PodcastGenerator.js';
import { ElevenLabsService } from '../services/voice/ElevenLabsService.js';
import { shortSamplePodcastTemplate } from '../config/podcastTemplates.js';
import fs from 'fs/promises';
import path from 'path';

async function generateBlackHolesPodcast() {
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error('Please set ELEVENLABS_API_KEY environment variable');
  }

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