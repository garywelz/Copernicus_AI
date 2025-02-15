import { TwitterService } from './TwitterService';
import { logger } from '../../utils/logger';

export function createTwitterService(): TwitterService {
  const {
    TWITTER_API_KEY,
    TWITTER_API_SECRET,
    TWITTER_ACCESS_TOKEN,
    TWITTER_ACCESS_SECRET
  } = process.env;

  // Log initialization attempt
  logger.info('Initializing Twitter service');

  // Validate required environment variables
  const requiredEnvVars = {
    TWITTER_API_KEY,
    TWITTER_API_SECRET,
    TWITTER_ACCESS_TOKEN,
    TWITTER_ACCESS_SECRET
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    logger.error('Missing Twitter credentials:', missingVars);
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return new TwitterService(
    TWITTER_API_KEY!,
    TWITTER_API_SECRET!,
    TWITTER_ACCESS_TOKEN!,
    TWITTER_ACCESS_SECRET!
  );
} 