import { createTwitterService } from '../src/services/twitter/createTwitterService';
import { PodcastDistributor } from '../src/services/podcast/PodcastDistributor';
import { AudioProcessor } from '../src/utils/audio';
import type { TweetResponse } from '../src/types/twitter';
import type { Podcast } from '../src/types/podcast';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from project root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const testPodcast: Podcast = {
  title: 'Test Podcast',
  description: 'Test Description',
  url: 'https://example.com/podcast',
  audioUrl: 'https://example.com/podcast.mp3'
};

async function testShare() {
  try {
    // Create services
    const twitterService = createTwitterService();
    const audioProcessor = new AudioProcessor();
    const distributor = new PodcastDistributor(twitterService, audioProcessor);

    console.log('Sharing podcast...');
    const result = await distributor.shareToTwitter(testPodcast);
    
    console.log('Success! Tweet posted:');
    console.log('Tweet ID:', result.id);
    console.log('Tweet Text:', result.text);
  } catch (error) {
    console.error('Error sharing podcast:', error);
  }
}

// Run the test
testShare(); 