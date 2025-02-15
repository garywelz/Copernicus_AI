import { ElevenLabsService } from '../services/voice/ElevenLabsService.js';
import { AudioProcessor } from '../utils/audio.js';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

interface VoiceConfig {
  voiceId: string;
  name: string;
  style: number;
  stability: number;
  speaking_rate: number;
}

interface VoiceMap {
  [key: string]: VoiceConfig;
}

async function generateTestEpisode() {
  console.log('Environment variables:', {
    ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY?.substring(0, 8) + '...',
    NODE_ENV: process.env.NODE_ENV
  });

  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY is not set in environment variables');
  }

  const ttsService = new ElevenLabsService(
    process.env.ELEVENLABS_API_KEY,
    { 
      sampleRate: 44100,
      bitDepth: 16,
      channels: 1
    },
    { 
      normalize: true,
      removeNoise: true
    }
  );

  const audioProcessor = new AudioProcessor({
    sampleRate: 44100,
    bitDepth: 16,
    channels: 1
  });

  try {
    // Configure voices with adjusted parameters
    const voices: VoiceMap = {
      host: {
        voiceId: '5KCLtmjBQSL8p6gtQvcj',  // Updated Gary hoarse voice ID
        name: 'Gary',
        style: 0.35,  // More natural, less stylized
        stability: 0.8,  // More consistent
        speaking_rate: 0.95  // Slightly slower
      },
      expert: {
        voiceId: '21m00Tcm4TlvDq8ikWAM',
        name: 'Charlotte',
        style: 0.25,  // More professional
        stability: 0.85,  // Very consistent
        speaking_rate: 0.9  // Clear and measured
      }
    };

    // Set up voices
    Object.entries(voices).forEach(([role, config]) => {
      console.log(`Configuring voice for ${role}: ${config.name}`);
      ttsService.setVoice(role, config);
    });

    // Generate each line separately
    const lines = [
      {
        speaker: 'host',
        text: 'Welcome to our podcast! Today we\'re discussing artificial intelligence.'
      },
      {
        speaker: 'expert',
        text: 'Thanks Gary. AI is transforming how we work and live.'
      },
      {
        speaker: 'host',
        text: 'Could you explain what AI actually is?'
      },
      {
        speaker: 'expert',
        text: 'Of course! AI refers to computer systems that can perform tasks that typically require human intelligence.'
      }
    ];

    console.log('\nGenerating conversation...');
    
    // Create output directory
    const outputDir = path.join(process.cwd(), 'output');
    await fs.mkdir(outputDir, { recursive: true });

    // Generate each line
    const audioSegments: Buffer[] = [];
    const pauseDuration = 0.5; // 0.5 second pause between lines
    
    for (const line of lines) {
      console.log(`\nGenerating line for ${voices[line.speaker].name}:`);
      console.log(line.text);
      
      const response = await ttsService.synthesize(line.text, {
        model: line.speaker,
        speed: 1.0
      });

      if (!response || !response.audioData) {
        throw new Error(`No audio data received for ${line.speaker}'s line`);
      }

      // Add the line
      audioSegments.push(response.audioData);
      
      // Add pause after each line except the last
      if (lines.indexOf(line) < lines.length - 1) {
        audioSegments.push(audioProcessor.addPause(pauseDuration));
      }

      // Save individual line for debugging
      const linePath = path.join(outputDir, `line-${voices[line.speaker].name.toLowerCase()}-${lines.indexOf(line)}.mp3`);
      await fs.writeFile(linePath, response.audioData);
      
      console.log(`Line generated successfully!`);
      console.log('Duration:', response.duration, 'seconds');
    }

    // Combine segments first
    console.log('\nCombining audio segments...');
    const combinedSpeech = await audioProcessor.concatenateAudio(audioSegments);

    let finalAudio = combinedSpeech;

    // Try to add background music if available
    try {
      const bgMusicPath = path.join(process.cwd(), 'assets', 'background.mp3');
      console.log('Looking for background music at:', bgMusicPath);
      
      const backgroundMusic = await fs.readFile(bgMusicPath);
      console.log('Adding background music...');
      
      finalAudio = audioProcessor.mixWithBackground(
        combinedSpeech,
        backgroundMusic,
        0.08  // Very subtle background music
      );
    } catch (error) {
      console.log('No background music found, continuing without it...');
    }

    // Save final episode
    const episodePath = path.join(outputDir, 'ai-episode-final.mp3');
    await fs.writeFile(episodePath, finalAudio);

    console.log('\nEpisode generated successfully!');
    console.log('Saved to:', episodePath);

    // Cleanup individual files
    console.log('\nCleaning up temporary files...');
    await Promise.all(lines.map(async (line, index) => {
      const fileName = `line-${voices[line.speaker].name.toLowerCase()}-${index}.mp3`;
      const filePath = path.join(outputDir, fileName);
      await fs.unlink(filePath).catch(() => {}); // Ignore errors
    }));

    console.log('Cleanup complete!');

  } catch (error) {
    console.error('Failed to generate episode:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}

generateTestEpisode().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 