import { AudioPlayer } from '../services/audio/AudioPlayer.js';
import { ElevenLabsService } from '../services/voice/ElevenLabsService.js';
import { PodcastInteraction } from '../services/interaction/PodcastInteraction.js';
import { PodcastController } from '../services/interaction/PodcastController.js';
import { AudioProcessor } from '../utils/audio.js';
import fs from 'fs/promises';
import readline from 'readline';

async function testInteractivePodcast() {
  // Initialize services
  const player = new AudioPlayer();
  const tts = new ElevenLabsService('sk_3f67d0b5dc8a714834c895b3346bb992a39e3c7248dacedb');
  const audioProcessor = new AudioProcessor();
  const interaction = new PodcastInteraction(tts, audioProcessor);
  const controller = new PodcastController(player, interaction);

  // Clear screen and show instructions
  console.clear();
  console.log('\n=== Interactive Podcast Player ===\n');
  console.log('The podcast will start playing.');
  console.log('You can type commands at any time, even if you don\'t see a cursor.\n');
  console.log('Commands:');
  console.log('1. Type a question:  ask what is an event horizon?');
  console.log('2. Pause podcast:    pause');
  console.log('3. Resume podcast:   resume');
  console.log('4. Exit program:     quit\n');
  console.log('Press Enter after typing your command.\n');
  console.log('Starting podcast in 5 seconds...\n');

  // Wait 5 seconds before starting
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Set up input handling
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Load and play the podcast
  const podcastBuffer = await fs.readFile('output/black-holes-podcast.mp3');
  
  // Handle input
  rl.on('line', async (input) => {
    // Show what was typed
    console.log('\nYou entered:', input);

    if (input === 'quit') {
      console.log('Stopping podcast...');
      player.stop();
      rl.close();
      process.exit(0);
    }

    try {
      await controller.handleCommand(input);
    } catch (error) {
      console.error('Error handling command:', error);
    }
  });

  // Start playback
  await player.playPodcast(podcastBuffer);
}

testInteractivePodcast().catch(console.error); 