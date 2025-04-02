"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ScriptReviewService_1 = require("../services/ScriptReviewService");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
// Load environment variables
dotenv_1.default.config();
async function testScriptReview() {
    if (!process.env.GOOGLE_PROJECT_ID) {
        throw new Error('GOOGLE_PROJECT_ID is required in .env file');
    }
    // Initialize the review service
    const reviewService = new ScriptReviewService_1.ScriptReviewService(process.env.GOOGLE_PROJECT_ID);
    try {
        // Load a sample script from the output directory
        const scriptPath = path_1.default.join(process.cwd(), 'output/episode_scripts/quantum-chronicles:-demystifying-the-micro-universe.json');
        const scriptContent = await promises_1.default.readFile(scriptPath, 'utf-8');
        const script = JSON.parse(scriptContent);
        console.log('Reviewing script:', script.title);
        // Test with different review options
        const reviewOptions = {
            focusAreas: ['technical accuracy', 'engagement'],
            strictnessLevel: 'moderate',
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
    }
    catch (error) {
        console.error('Error testing script review:', error);
    }
}
testScriptReview();
//# sourceMappingURL=testScriptReview.js.map