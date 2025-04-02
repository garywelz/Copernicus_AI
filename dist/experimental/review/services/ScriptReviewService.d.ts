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
export declare class ScriptReviewService {
    private notebookClient;
    private projectId;
    private location;
    constructor(projectId: string, location?: string);
    reviewScript(script: PodcastScript, options?: ReviewOptions): Promise<ReviewFeedback>;
    private createReviewNotebook;
    private addScriptContext;
    private generateReview;
    private createReviewPrompt;
    private parseReviewResponse;
}
export {};
