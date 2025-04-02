import { ScriptReviewService } from '../services/ScriptReviewService';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';

// Load environment variables
dotenv.config();

async function testScriptReview() {
  if (!process.env.GOOGLE_PROJECT_ID) {
    throw new Error('GOOGLE_PROJECT_ID is required in .env file');
  }

  // Initialize the review service
  const reviewService = new ScriptReviewService(process.env.GOOGLE_PROJECT_ID);

  try {
    // Load a sample script from the output directory
    const scriptPath = path.join(process.cwd(), 'output/episode_scripts/quantum-chronicles:-demystifying-the-micro-universe.json');
    const scriptContent = await fs.readFile(scriptPath, 'utf-8');
    const script = JSON.parse(scriptContent);

    console.log('Reviewing script:', script.title);

    // Test with different review options
    const reviewOptions = {
      focusAreas: ['technical accuracy', 'engagement'],
      strictnessLevel: 'moderate' as const,
      requireCitations: true
    };

    const feedback = await reviewService.reviewScript(script, reviewOptions);

    // Print the review results
    console.log('\nScript Review Results:');
    console.log('=====================');
    console.log('\nOverall Assessment:', feedback.overallAssessment);
    console.log('\nEngagement Score:', feedback.engagementScore);
    console.log('Technical Accuracy Score:', feedback.technicalAccuracyScore);
    
    console.log('\nSegment Feedback:');
    feedback.segmentFeedback.forEach(segment => {
      console.log(`\nSegment ${segment.segmentIndex + 1}:`);
      console.log('Feedback:', segment.feedback);
      console.log('Suggestions:', segment.suggestions.join('\n  - '));
    });

    console.log('\nCitation Accuracy:');
    console.log('Is Accurate:', feedback.citationAccuracy.isAccurate);
    if (feedback.citationAccuracy.issues?.length) {
      console.log('Issues:');
      feedback.citationAccuracy.issues.forEach(issue => console.log(`  - ${issue}`));
    }

    console.log('\nStructural Suggestions:');
    feedback.structuralSuggestions.forEach(suggestion => console.log(`  - ${suggestion}`));

  } catch (error) {
    console.error('Error testing script review:', error);
  }
}

testScriptReview(); 