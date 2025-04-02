import type { ILLMService, CompletionOptions, CompletionResult } from '../interfaces/ILLMService.js';
import type { ResearchPaper, PaperAnalysis, AnalyzeOptions } from '../../types/paper.js';
export declare class OpenRouterService implements ILLMService {
    private apiKey;
    private readonly baseUrl;
    private readonly agent;
    private readonly cache;
    private readonly cacheDuration;
    constructor(apiKey: string);
    private getCacheKey;
    private getCachedAnalysis;
    private setCachedAnalysis;
    generateCompletion(prompt: string, options?: CompletionOptions): Promise<CompletionResult>;
    analyzePaper(paper: ResearchPaper, options: AnalyzeOptions): Promise<PaperAnalysis>;
    private createAnalysisPrompt;
    private parseAnalysisResponse;
    generateStructuredOutput<T>(prompt: string, schema: any, options?: CompletionOptions): Promise<T>;
    private makeRequest;
}
