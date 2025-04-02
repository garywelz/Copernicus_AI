import type { ResearchPaper, PaperAnalysis } from '../types/paper';
export declare function analyzePaper(paper: ResearchPaper, options?: {
    depth?: 'quick' | 'detailed';
    outputFormat?: 'summary' | 'structured';
}): Promise<PaperAnalysis>;
