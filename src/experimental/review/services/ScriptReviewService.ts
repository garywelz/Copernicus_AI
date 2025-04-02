import { NotebookServiceClient } from '@google-cloud/aiplatform';
import { PodcastScript } from '../../../types/podcast';

interface ReviewFeedback {
  overallAssessment: string;
  segmentFeedback: {
    segmentIndex: number;
    feedback: string;
    suggestions: string[];
  }[];
  citationAccuracy: {
    isAccurate: boolean;
    issues?: string[];
  };
  structuralSuggestions: string[];
  engagementScore: number;
  technicalAccuracyScore: number;
}

interface ReviewOptions {
  focusAreas?: string[];
  strictnessLevel?: 'lenient' | 'moderate' | 'strict';
  requireCitations?: boolean;
}

export class ScriptReviewService {
  private notebookClient: NotebookServiceClient;
  private projectId: string;
  private location: string;

  constructor(projectId: string, location: string = 'us-central1') {
    this.projectId = projectId;
    this.location = location;
    this.notebookClient = new NotebookServiceClient();
  }

  async reviewScript(
    script: PodcastScript,
    options: ReviewOptions = {}
  ): Promise<ReviewFeedback> {
    try {
      // Create a new notebook for this review session
      const notebook = await this.createReviewNotebook(script.title);

      // Add script content as context
      await this.addScriptContext(notebook, script);

      // Generate review using structured prompts
      const review = await this.generateReview(notebook, options);

      return review;
    } catch (error) {
      console.error('Error reviewing script:', error);
      throw new Error('Failed to review script');
    }
  }

  private async createReviewNotebook(title: string): Promise<string> {
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

  private async addScriptContext(notebook: string, script: PodcastScript): Promise<void> {
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

  private async generateReview(
    notebook: string,
    options: ReviewOptions
  ): Promise<ReviewFeedback> {
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

  private createReviewPrompt(options: ReviewOptions): string {
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

  private parseReviewResponse(response: any): ReviewFeedback {
    try {
      const parsedResponse = JSON.parse(response.text);
      return parsedResponse as ReviewFeedback;
    } catch (error) {
      console.error('Error parsing review response:', error);
      throw new Error('Failed to parse review response');
    }
  }
} 