export interface ResearchPaper {
    id: string;
    title: string;
    authors: string[];
    abstract: string;
    content: string;
    url: string;
    doi?: string;
    publishedDate: Date;
    source: string;
    keywords: string[];
    references: string[];
    metadata?: Record<string, any>;
}
export interface PaperAnalysis {
    summary: string;
    keyPoints: string[];
    methodology: string;
    findings: string[];
    implications: string[];
    limitations: string[];
    futureWork: string[];
    confidence: number;
    metadata?: Record<string, any>;
}
export interface AnalyzeOptions {
    depth: 'basic' | 'detailed' | 'comprehensive';
    focus?: string[];
    maxPoints?: number;
    includeMethodology?: boolean;
    includeLimitations?: boolean;
    includeFutureWork?: boolean;
    metadata?: Record<string, any>;
}
export interface CompletionResult {
    content: string;
    usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    finishReason: string;
    metadata?: Record<string, any>;
}
