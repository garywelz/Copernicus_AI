import { ResearchPaper, PaperAnalysis, AnalyzeOptions } from '../types/paper.js';
interface AnalysisCache {
    [key: string]: {
        analysis: PaperAnalysis;
        timestamp: number;
    };
}
export declare const analysisCache: AnalysisCache;
/**
 * Processes a research paper and returns analysis
 * @param paper The research paper to analyze
 * @param options Analysis options
 * @param apiKey OpenRouter API key
 * @returns Promise<PaperAnalysis>
 */
export declare function processPaper(paper: ResearchPaper, options: AnalyzeOptions, apiKey: string): Promise<PaperAnalysis>;
/**
 * Clears expired entries from the analysis cache
 */
export declare function cleanupCache(): void;
export declare function startCleanupInterval(): void;
export declare function stopCleanupInterval(): void;
export {};
