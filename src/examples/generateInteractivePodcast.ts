import { ElevenLabsService } from '../services/voice/ElevenLabsService.js';
import { AudioProcessor } from '../utils/audio.js';
import { OllamaService } from '../services/ai/OllamaService.js';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { execAsync } from '../utils/execAsync.js';

dotenv.config();

interface PodcastState {
  topic: string;
  currentSpeaker: 'host' | 'expert';
  context: string[];
  questionQueue: string[];
}

async function generateInteractiveEpisode() {
  console.log('Starting interactive podcast...');

  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error('Missing required API keys');
  }

  const ttsService = new ElevenLabsService(
    process.env.ELEVENLABS_API_KEY,
    { 
      sampleRate: 44100,
      bitDepth: 16,
      channels: 1
    }
  );

  const audioProcessor = new AudioProcessor({
    sampleRate: 44100,
    bitDepth: 16,
    channels: 1
  });

  const aiService = new OllamaService();

  // Configure voices
  const voices = {
    host: {
      voiceId: '5KCLtmjBQSL8p6gtQvcj',  // Gary hoarse
      name: 'Gary',
      style: 0.35,
      stability: 0.8,
      speaking_rate: 0.95
    },
    expert: {
      voiceId: '21m00Tcm4TlvDq8ikWAM',
      name: 'Charlotte',
      style: 0.25,
      stability: 0.85,
      speaking_rate: 0.9
    }
  };

  Object.entries(voices).forEach(([role, config]) => {
    ttsService.setVoice(role, config);
  });

  const state: PodcastState = {
    topic: 'artificial intelligence',
    currentSpeaker: 'host',
    context: [],
    questionQueue: []
  };

  console.log('\nReady for questions! Type your question and press Enter.');
  console.log('(Press Ctrl+C to exit)\n');

  process.stdin.setEncoding('utf8');
  process.stdin.on('data', async (data) => {
    const question = data.toString().trim();
    if (question) {
      console.log('\nProcessing question:', question);
      try {
        const response = await handleQuestion(question);
        console.log('AI Response:', response);
        // Play the response
        const audioPath = path.join(process.cwd(), 'output', 'response.mp3');
        await fs.writeFile(audioPath, response.audioData);
        console.log('\nPlaying response...');
        await execAsync(`mpv ${audioPath}`);
      } catch (error) {
        console.error('Error handling question:', error);
      }
    }
  });

  async function handleQuestion(question: string) {
    // Get AI response
    const response = await aiService.generateResponse({
      role: 'expert',
      context: state.context,
      question: question
    });

    // Add to context
    state.context.push(response);

    // Generate audio
    return await ttsService.synthesize(response, {
      model: 'expert',
      speed: 1.0
    });
  }
}

generateInteractiveEpisode().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 