import { PodcastGenerator } from '../services/podcast/PodcastGenerator.js';
import { ElevenLabsService } from '../services/voice/ElevenLabsService.js';
import { shortSamplePodcastTemplate } from '../config/podcastTemplates.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSamplePodcast() {
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error('Please set ELEVENLABS_API_KEY environment variable');
  }

  // Initialize services with ElevenLabs
  const ttsService = new ElevenLabsService(
    process.env.ELEVENLABS_API_KEY,
    {
      fadeInDuration: 0.5,
      fadeOutDuration: 0.5,
      pauseDuration: 0.3,
      backgroundVolume: 0.1
    },
    {
      normalize: true,
      compression: {
        threshold: 8192,
        ratio: 2
      },
      equalization: {
        bass: 1.2,
        mid: 1.0,
        treble: 0.8
      }
    }
  );

  const generator = new PodcastGenerator(ttsService);

  try {
    // Generate the podcast audio
    const podcastAudio = await generator.generatePodcast(shortSamplePodcastTemplate);

    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'output');
    await fs.mkdir(outputDir, { recursive: true });

    // Save the podcast audio
    const outputPath = path.join(outputDir, 'sample-podcast.mp3');
    await fs.writeFile(outputPath, podcastAudio);

    console.log(`Podcast generated successfully! Saved to: ${outputPath}`);
  } catch (error) {
    console.error('Failed to generate podcast:', error);
  }
}

generateSamplePodcast(); 