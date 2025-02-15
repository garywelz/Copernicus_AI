import { ElevenLabsService } from '../services/voice/ElevenLabsService.js';
import { AudioProcessor } from '../utils/audio.js';
import { OllamaService } from '../services/ai/OllamaService.js';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { execAsync } from '../utils/execAsync.js';

interface PodcastState {
  topic: string;
  currentSpeaker: 'host' | 'expert';
  context: string[];
  isInterrupted: boolean;
}

async function generateAIPodcast(topic = 'black holes and the nature of space-time') {
  console.log('Starting AI Podcast Generator...');

  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error('Missing required API keys');
  }

  // Initialize services
  const ttsService = new ElevenLabsService(
    process.env.ELEVENLABS_API_KEY,
    { sampleRate: 44100, bitDepth: 16, channels: 1 }
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
    topic,
    currentSpeaker: 'host',
    context: [],
    isInterrupted: false
  };

  // Generate initial conversation structure
  async function generateConversationSegment() {
    const prompt = state.context.length === 0 
      ? `Start a podcast discussion about ${topic}. As the host, introduce the topic and your expert guest Charlotte.`
      : `Continue the discussion about ${topic}, asking an insightful follow-up question based on the previous context.`;

    const response = await aiService.generateResponse({
      role: state.currentSpeaker,
      context: state.context,
      question: prompt
    });

    return response;
  }

  // Handle interruptions/questions
  async function handleQuestion(question: string) {
    state.isInterrupted = true;
    console.log('\nProcessing question:', question);

    const response = await aiService.generateResponse({
      role: 'expert',
      context: state.context,
      question: `The listener asks: ${question}. Provide a clear, informative answer that connects to our discussion of ${topic}.`
    });

    state.context.push(response);
    const audioResponse = await ttsService.synthesize(response, {
      model: 'expert',
      speed: 1.0
    });

    return audioResponse;
  }

  // Main podcast loop
  console.log('\nStarting podcast about:', topic);
  console.log('Type your questions anytime to interrupt!\n');

  process.stdin.setEncoding('utf8');
  process.stdin.on('data', async (data) => {
    const question = data.toString().trim();
    if (question) {
      try {
        const response = await handleQuestion(question);
        const audioPath = path.join(process.cwd(), 'output', 'response.mp3');
        await fs.writeFile(audioPath, response.audioData);
        console.log('\nPlaying response...');
        await execAsync(`mpv ${audioPath}`);
        state.isInterrupted = false;
        continuePodcast(); // Resume the main conversation
      } catch (error) {
        console.error('Error handling question:', error);
      }
    }
  });

  // Continue the podcast conversation
  async function continuePodcast() {
    if (state.isInterrupted) return;

    try {
      const segment = await generateConversationSegment();
      state.context.push(segment);
      
      const audio = await ttsService.synthesize(segment, {
        model: state.currentSpeaker,
        speed: 1.0
      });

      const audioPath = path.join(process.cwd(), 'output', 'segment.mp3');
      await fs.writeFile(audioPath, audio.audioData);
      console.log('\nPlaying segment...');
      await execAsync(`mpv ${audioPath}`);

      // Switch speakers
      state.currentSpeaker = state.currentSpeaker === 'host' ? 'expert' : 'host';
      
      // Continue conversation after a short pause
      setTimeout(continuePodcast, 1000);
    } catch (error) {
      console.error('Error generating podcast segment:', error);
    }
  }

  // Start the podcast
  continuePodcast();
}

// Run the podcast generator
generateAIPodcast().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 