"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ScriptReviewService_1 = require("../services/script/ScriptReviewService");
const logger_1 = require("../utils/logger");
const chalk_1 = __importDefault(require("chalk"));
async function testScriptReview() {
    try {
        console.log(chalk_1.default.blue('\nStarting Script Review Test\n'));
        const scriptReviewService = ScriptReviewService_1.ScriptReviewService.getInstance();
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
        logger_1.logger.info('Starting script review test...');
        // Create a new script review
        console.log(chalk_1.default.yellow('Creating script review...'));
        const review = await scriptReviewService.reviewScript(podcastId, testScript);
        console.log(chalk_1.default.green('✓ Created script review:', review.id));
        // Get the review
        console.log(chalk_1.default.yellow('\nRetrieving review...'));
        const retrievedReview = await scriptReviewService.getReview(review.id);
        if (!retrievedReview) {
            throw new Error('Failed to retrieve review');
        }
        console.log(chalk_1.default.green('✓ Retrieved review:', retrievedReview.id));
        // Get all reviews for the podcast
        console.log(chalk_1.default.yellow('\nRetrieving podcast reviews...'));
        const podcastReviews = await scriptReviewService.getPodcastReviews(podcastId);
        console.log(chalk_1.default.green('✓ Retrieved podcast reviews:', podcastReviews.length));
        // Log review results
        console.log(chalk_1.default.blue('\nReview Results:'));
        console.log(chalk_1.default.white('\nFeedback:'));
        console.log(retrievedReview.feedback);
        console.log(chalk_1.default.white('\nSuggestions:'));
        retrievedReview.suggestions.forEach((suggestion, index) => {
            console.log(chalk_1.default.cyan(`${index + 1}. ${suggestion}`));
        });
        console.log(chalk_1.default.white('\nReferences:'));
        retrievedReview.references.forEach((reference, index) => {
            console.log(chalk_1.default.magenta(`${index + 1}. ${reference}`));
        });
        console.log(chalk_1.default.green('\n✓ Script review test completed successfully\n'));
    }
    catch (error) {
        console.error(chalk_1.default.red('\n✗ Script review test failed:'));
        console.error(chalk_1.default.red(error.message));
        logger_1.logger.error('Script review test failed:', error);
        process.exit(1);
    }
}
// Run the test
testScriptReview();
//# sourceMappingURL=test_script_review.js.map