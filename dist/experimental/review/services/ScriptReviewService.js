"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptReviewService = void 0;
const aiplatform_1 = require("@google-cloud/aiplatform");
class ScriptReviewService {
    constructor(projectId, location = 'us-central1') {
        this.projectId = projectId;
        this.location = location;
        this.notebookClient = new aiplatform_1.NotebookServiceClient();
    }
    async reviewScript(script, options = {}) {
        try {
            // Create a new notebook for this review session
            const notebook = await this.createReviewNotebook(script.title);
            // Add script content as context
            await this.addScriptContext(notebook, script);
            // Generate review using structured prompts
            const review = await this.generateReview(notebook, options);
            return review;
        }
        catch (error) {
            console.error('Error reviewing script:', error);
            throw new Error('Failed to review script');
        }
    }
    async createReviewNotebook(title) {
        const createRequest = {
            parent: `projects/${this.projectId}/locations/${this.location}`,
            notebook: {
                displayName: `Script Review: ${title}`,
                description: 'Automated script review session'
            }
        };
        const [notebook] = await this.notebookClient.createNotebook(createRequest);
        return notebook.name;
    }
    async addScriptContext(notebook, script) {
        // Add script sections as separate context blocks
        await this.notebookClient.addContext({
            notebook,
            content: JSON.stringify(script, null, 2),
            metadata: {
                type: 'podcast_script',
                title: script.title,
                sections: script.segments.length
            }
        });
        // Add any referenced papers or sources
        if (script.references) {
            await this.notebookClient.addContext({
                notebook,
                content: JSON.stringify(script.references, null, 2),
                metadata: {
                    type: 'references'
                }
            });
        }
    }
    async generateReview(notebook, options) {
        const reviewPrompt = this.createReviewPrompt(options);
        const response = await this.notebookClient.generateContent({
            notebook,
            prompt: reviewPrompt,
            generation_config: {
                temperature: 0.3,
                top_p: 0.8,
                top_k: 40
            }
        });
        return this.parseReviewResponse(response);
    }
    createReviewPrompt(options) {
        return `Review this podcast script with the following considerations:

${options.focusAreas ? `Focus areas: ${options.focusAreas.join(', ')}` : 'General review'}
Strictness level: ${options.strictnessLevel || 'moderate'}
Citation checking: ${options.requireCitations ? 'Required' : 'Optional'}

Please analyze:
1. Overall structure and flow
2. Technical accuracy and clarity
3. Engagement and accessibility
4. Citation accuracy and completeness
5. Speaker interactions and transitions

Provide specific feedback for each segment and overall recommendations.

Format the response as a JSON object with:
{
  "overallAssessment": "General evaluation",
  "segmentFeedback": [
    {
      "segmentIndex": 0,
      "feedback": "Specific feedback",
      "suggestions": ["Improvement 1", "Improvement 2"]
    }
  ],
  "citationAccuracy": {
    "isAccurate": true/false,
    "issues": ["Issue 1", "Issue 2"]
  },
  "structuralSuggestions": ["Suggestion 1", "Suggestion 2"],
  "engagementScore": 0-10,
  "technicalAccuracyScore": 0-10
}`;
    }
    parseReviewResponse(response) {
        try {
            const parsedResponse = JSON.parse(response.text);
            return parsedResponse;
        }
        catch (error) {
            console.error('Error parsing review response:', error);
            throw new Error('Failed to parse review response');
        }
    }
}
exports.ScriptReviewService = ScriptReviewService;
//# sourceMappingURL=ScriptReviewService.js.map