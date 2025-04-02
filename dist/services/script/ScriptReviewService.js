"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptReviewService = void 0;
const NotebookLMService_1 = require("../ai/NotebookLMService");
const logger_1 = require("../../utils/logger");
class ScriptReviewService {
    constructor() {
        this.notebookLM = NotebookLMService_1.NotebookLMService.getInstance();
        this.reviews = new Map();
    }
    static getInstance() {
        if (!ScriptReviewService.instance) {
            ScriptReviewService.instance = new ScriptReviewService();
        }
        return ScriptReviewService.instance;
    }
    async reviewScript(podcastId, script) {
        try {
            const review = {
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
            logger_1.logger.info('Created new script review:', { reviewId: review.id, podcastId });
            // Start the review process
            await this.processReview(review);
            return review;
        }
        catch (error) {
            logger_1.logger.error('Error creating script review:', error);
            throw error;
        }
    }
    async processReview(review) {
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
            logger_1.logger.info('Completed script review:', { reviewId: review.id });
        }
        catch (error) {
            review.status = 'failed';
            review.updatedAt = new Date();
            this.reviews.set(review.id, review);
            logger_1.logger.error('Error processing script review:', error);
            throw error;
        }
    }
    async getReview(reviewId) {
        return this.reviews.get(reviewId);
    }
    async getPodcastReviews(podcastId) {
        return Array.from(this.reviews.values()).filter(review => review.podcastId === podcastId);
    }
    generateId() {
        return Math.random().toString(36).substring(2, 15);
    }
}
exports.ScriptReviewService = ScriptReviewService;
//# sourceMappingURL=ScriptReviewService.js.map