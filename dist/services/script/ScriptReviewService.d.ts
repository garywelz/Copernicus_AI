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
export declare class ScriptReviewService {
    private static instance;
    private notebookLM;
    private reviews;
    private constructor();
    static getInstance(): ScriptReviewService;
    reviewScript(podcastId: string, script: string): Promise<ScriptReview>;
    private processReview;
    getReview(reviewId: string): Promise<ScriptReview | undefined>;
    getPodcastReviews(podcastId: string): Promise<ScriptReview[]>;
    private generateId;
}
