import { createTwitterService } from '../src/services/twitter/createTwitterService';
import { PodcastDistributor } from '../src/services/podcast/PodcastDistributor';
import { AudioProcessor } from '../src/utils/audio';
import type { TweetResponse } from '../src/services/interfaces/ITwitterService';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from project root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function testShare() {
  try {
    // Create services
    const twitterService = createTwitterService();
    const audioProcessor = new AudioProcessor();
    const distributor = new PodcastDistributor(twitterService, audioProcessor);

    // Test podcast data
    const testPodcast = {
      title: "Test AI Research Podcast",
      url: "https://example.com/podcast/test",
      audioUrl: "https://example.com/audio/test.mp3",
      duration: 60
    };

    console.log('Sharing podcast...');
    const result: TweetResponse = await distributor.shareToTwitter(testPodcast);
    
    console.log('Success! Tweet posted:');
    console.log('Tweet ID:', result.id);
    console.log('Tweet URL:', `https://twitter.com/i/status/${result.id}`);
  } catch (error) {
    console.error('Error sharing podcast:', error);
  }
}

// Run the test
testShare(); 