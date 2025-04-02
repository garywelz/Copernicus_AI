import { ScriptReviewService } from '../services/script/ScriptReviewService';
import { logger } from '../utils/logger';
import chalk from 'chalk';

async function testScriptReview() {
  try {
    console.log(chalk.blue('\nStarting Script Review Test\n'));
    const scriptReviewService = ScriptReviewService.getInstance();
    const podcastId = 'test-podcast-1';
    const testScript = `
      Introduction:
      Welcome to this podcast about artificial intelligence and its impact on society.
      
      Main Points:
      1. The history of AI development
      2. Current applications in various industries
      3. Future implications and ethical considerations
      
      Conclusion:
      Thank you for listening to this episode about AI.
    `;

    logger.info('Starting script review test...');

    // Create a new script review
    console.log(chalk.yellow('Creating script review...'));
    const review = await scriptReviewService.reviewScript(podcastId, testScript);
    console.log(chalk.green('✓ Created script review:', review.id));

    // Get the review
    console.log(chalk.yellow('\nRetrieving review...'));
    const retrievedReview = await scriptReviewService.getReview(review.id);
    if (!retrievedReview) {
      throw new Error('Failed to retrieve review');
    }
    console.log(chalk.green('✓ Retrieved review:', retrievedReview.id));

    // Get all reviews for the podcast
    console.log(chalk.yellow('\nRetrieving podcast reviews...'));
    const podcastReviews = await scriptReviewService.getPodcastReviews(podcastId);
    console.log(chalk.green('✓ Retrieved podcast reviews:', podcastReviews.length));

    // Log review results
    console.log(chalk.blue('\nReview Results:'));
    console.log(chalk.white('\nFeedback:'));
    console.log(retrievedReview.feedback);
    
    console.log(chalk.white('\nSuggestions:'));
    retrievedReview.suggestions.forEach((suggestion, index) => {
      console.log(chalk.cyan(`${index + 1}. ${suggestion}`));
    });

    console.log(chalk.white('\nReferences:'));
    retrievedReview.references.forEach((reference, index) => {
      console.log(chalk.magenta(`${index + 1}. ${reference}`));
    });

    console.log(chalk.green('\n✓ Script review test completed successfully\n'));
  } catch (error) {
    console.error(chalk.red('\n✗ Script review test failed:'));
    console.error(chalk.red((error as Error).message));
    logger.error('Script review test failed:', error as Error);
    process.exit(1);
  }
}

// Run the test
testScriptReview(); 