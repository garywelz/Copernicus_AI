import { NewsArticle } from './NewsService';
interface NewsAnalysis {
    title: string;
    summary: string;
    keyPoints: string[];
    impact: string;
    background: string;
    quotes: string[];
    relatedTopics: string[];
    suggestedSegments: {
        title: string;
        content: string;
        speaker: string;
        duration?: number;
    }[];
    keywords: string[];
}
interface AnalysisOptions {
    maxTokens?: number;
    temperature?: number;
    format?: 'brief' | 'detailed';
}
export declare class NewsAnalyzer {
    private readonly openai;
    private readonly defaultOptions;
    constructor(apiKey: string);
    /**
     * Analyze multiple news articles and create a cohesive narrative
     * @param articles Array of news articles
     * @param options Analysis options
     * @returns Combined analysis of all articles
     */
    analyzeArticles(articles: NewsArticle[], options?: AnalysisOptions): Promise<NewsAnalysis[]>;
    /**
     * Group articles by subtopic using semantic similarity
     */
    private groupArticlesByTopic;
    /**
     * Analyze a group of related articles
     */
    private analyzeArticleGroup;
    /**
     * Find connections between different news topics
     */
    private findConnections;
    /**
     * Construct prompt for news analysis
     */
    private constructAnalysisPrompt;
    /**
     * Construct prompt for finding connections between topics
     */
    private constructConnectionsPrompt;
    /**
     * Validate and clean analysis output
     */
    private validateAnalysis;
}
export {};
