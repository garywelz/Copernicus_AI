import { TwitterApi } from 'twitter-api-v2';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testTwitterAPI() {
  try {
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });

    // First verify we're tweeting as the correct account
    console.log('Verifying account...');
    const me = await client.v2.me();
    console.log('Authenticated as:', me.data.username);

    // Post the tweet
    console.log('\nPosting first tweet...');
    const tweet = await client.v2.tweet({
      text: 'Hello World, this is Copernicus_AI making its first tweet'
    });

    console.log('\nTweet posted successfully!');
    console.log('Tweet URL:', `https://twitter.com/i/status/${tweet.data.id}`);

  } catch (error: any) {
    console.error('\nError details:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    if (error.data) {
      console.error('Twitter API Error data:', JSON.stringify(error.data, null, 2));
    }
  }
}

console.log('Starting Twitter API test...');
testTwitterAPI(); 