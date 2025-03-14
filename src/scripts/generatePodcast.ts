import { PodcastGenerator } from '../services/podcast/PodcastGenerator';
import { TextToSpeechService } from '../services/voice/TextToSpeechService';
import { PodcastScript } from '../types/podcast';
import fs from 'fs/promises';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables
config();

async function generatePodcast() {
  try {
    // Get podcast name from command line args
    const podcastName = process.argv[2] || 'poincare-conjecture';
    
    // Dynamically import the podcast script
    const podcastPath = `../data/podcasts/${podcastName}.json`;
    const rawPodcastScript = require(podcastPath);
    
    // Type assertion for the podcast script
    const podcastScript = rawPodcastScript as PodcastScript;

    const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;

    if (!elevenLabsApiKey) {
      throw new Error('ELEVENLABS_API_KEY is required');
    }

    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'output');
    await fs.mkdir(outputDir, { recursive: true });

    // Initialize services
    const ttsService = new TextToSpeechService(elevenLabsApiKey);
    const generator = new PodcastGenerator(ttsService);

    // Generate the podcast
    console.log('Generating podcast:', podcastScript.title);
    const audioBuffer = await generator.generatePodcast(podcastScript);

    // Save the audio file
    const outputPath = path.join(outputDir, `${podcastName}.wav`);
    await fs.writeFile(outputPath, audioBuffer);
    
    console.log('Podcast generated successfully!');
    console.log('Output saved to:', outputPath);
    console.log('You can now import this WAV file into Descript for post-processing.');
  } catch (error) {
    console.error('Error generating podcast:', error);
    process.exit(1);
  }
}

generatePodcast(); 