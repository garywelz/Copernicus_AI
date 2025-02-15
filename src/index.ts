import { processPaper } from './services/paperProcessor.js';
import { logger } from './utils/logger.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Add debug logging for environment setup
logger.info('Current directory:', process.cwd());
logger.info('Module directory:', __dirname);
logger.info('Env file path:', join(__dirname, '..', '.env'));

// Load environment variables from the root directory
const envResult = dotenv.config({ path: join(__dirname, '..', '.env') });
if (envResult.error) {
  logger.error('Error loading .env:', envResult.error);
} else {
  logger.info('Environment variables loaded successfully');
}

async function main() {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      logger.error('Missing OPENROUTER_API_KEY in environment variables');
      process.exit(1);
    }

    logger.info('Starting with API key:', apiKey.substring(0, 8) + '...');

    // Example paper for testing
    const testPaper = {
      title: 'Test Paper',
      authors: ['Test Author'],
      content: 'This is a test paper about AI and machine learning.',
      doi: '10.1234/test',
      publicationDate: '2024-01-01',
      journal: 'Test Journal'
    };

    const options = {
      depth: 'quick' as const,
      outputFormat: 'summary' as const
    };

    logger.info('Starting paper analysis...');
    const analysis = await processPaper(testPaper, options, apiKey);
    logger.info('Analysis complete:', analysis);
  } catch (error) {
    logger.error('Error in main:', error);
    process.exit(1);
  }
}

main().catch(error => {
  logger.error('Unhandled error:', error);
  process.exit(1);
}); 