import { NotebookLMService } from '../ai/NotebookLMService';
import { logger } from '../../utils/logger';

export interface ScriptReview {
  id: string;
  podcastId: string;
  script: string;
  feedback: string;
  suggestions: string[];
  references: string[];
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export class ScriptReviewService {
  private static instance: ScriptReviewService;
  private notebookLM: NotebookLMService;
  private reviews: Map<string, ScriptReview>;

  private constructor() {
    this.notebookLM = NotebookLMService.getInstance();
    this.reviews = new Map();
  }

  public static getInstance(): ScriptReviewService {
    if (!ScriptReviewService.instance) {
      ScriptReviewService.instance = new ScriptReviewService();
    }
    return ScriptReviewService.instance;
  }

  public async reviewScript(
    podcastId: string,
    script: string
  ): Promise<ScriptReview> {
    try {
      const review: ScriptReview = {
        id: this.generateId(),
        podcastId,
        script,
        feedback: '',
        suggestions: [],
        references: [],
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.reviews.set(review.id, review);
      logger.info('Created new script review:', { reviewId: review.id, podcastId });

      // Start the review process
      await this.processReview(review);

      return review;
    } catch (error) {
      logger.error('Error creating script review:', error as Error);
      throw error;
    }
  }

  private async processReview(review: ScriptReview): Promise<void> {
    try {
      review.status = 'completed';
      review.updatedAt = new Date();

      // Use NotebookLM to analyze the script
      const analysis = await this.notebookLM.analyzeScript(review.script);

      // Update review with feedback and suggestions
      review.feedback = analysis.feedback;
      review.suggestions = analysis.suggestions;
      review.references = analysis.references;

      this.reviews.set(review.id, review);
      logger.info('Completed script review:', { reviewId: review.id });
    } catch (error) {
      review.status = 'failed';
      review.updatedAt = new Date();
      this.reviews.set(review.id, review);
      logger.error('Error processing script review:', error as Error);
      throw error;
    }
  }

  public async getReview(reviewId: string): Promise<ScriptReview | undefined> {
    return this.reviews.get(reviewId);
  }

  public async getPodcastReviews(podcastId: string): Promise<ScriptReview[]> {
    return Array.from(this.reviews.values()).filter(
      review => review.podcastId === podcastId
    );
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
} 