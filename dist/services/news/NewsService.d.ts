interface NewsArticle {
    title: string;
    description: string;
    content: string;
    url: string;
    source: {
        name: string;
        url: string;
    };
    author?: string;
    publishedAt: string;
    urlToImage?: string;
    category: string;
}
interface NewsSearchOptions {
    category: string;
    from: string;
    to: string;
    language?: string;
    sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
    pageSize?: number;
    page?: number;
}
export declare class NewsService {
    private readonly newsApiKey;
    private readonly baseUrl;
    private readonly topHeadlinesUrl;
    private readonly everythingUrl;
    constructor(apiKey: string);
    /**
     * Fetch articles based on search options
     * @param options Search parameters including category, dates, and sorting
     * @returns Array of news articles
     */
    fetchArticles(options: NewsSearchOptions): Promise<NewsArticle[]>;
    /**
     * Fetch top headlines for a category
     */
    private fetchTopHeadlines;
    /**
     * Fetch articles from everything endpoint
     */
    private fetchEverything;
    /**
     * Map our categories to NewsAPI categories
     */
    private mapCategory;
    /**
     * Normalize article data
     */
    private normalizeArticle;
    /**
     * Remove duplicate articles based on URL
     */
    private deduplicateArticles;
}
export {};
