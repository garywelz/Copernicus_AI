import axios from 'axios';

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

export class NewsService {
    private readonly newsApiKey: string;
    private readonly baseUrl = 'https://newsapi.org/v2';
    private readonly topHeadlinesUrl = `${this.baseUrl}/top-headlines`;
    private readonly everythingUrl = `${this.baseUrl}/everything`;

    constructor(apiKey: string) {
        this.newsApiKey = apiKey;
    }

    /**
     * Fetch articles based on search options
     * @param options Search parameters including category, dates, and sorting
     * @returns Array of news articles
     */
    async fetchArticles(options: NewsSearchOptions): Promise<NewsArticle[]> {
        const {
            category,
            from,
            to,
            language = 'en',
            sortBy = 'relevancy',
            pageSize = 10,
            page = 1
        } = options;

        try {
            // Try top headlines first for the category
            const headlinesResponse = await this.fetchTopHeadlines(category, language, pageSize);
            
            // If not enough headlines, supplement with everything endpoint
            if (headlinesResponse.length < pageSize) {
                const everythingResponse = await this.fetchEverything(
                    category,
                    from,
                    to,
                    language,
                    sortBy,
                    pageSize - headlinesResponse.length
                );
                
                // Combine and deduplicate results
                const combined = [...headlinesResponse, ...everythingResponse];
                return this.deduplicateArticles(combined);
            }

            return headlinesResponse;
        } catch (error) {
            console.error('Error fetching news articles:', error);
            throw new Error('Failed to fetch news articles');
        }
    }

    /**
     * Fetch top headlines for a category
     */
    private async fetchTopHeadlines(
        category: string,
        language: string,
        pageSize: number
    ): Promise<NewsArticle[]> {
        try {
            const response = await axios.get(this.topHeadlinesUrl, {
                params: {
                    category: this.mapCategory(category),
                    language,
                    pageSize,
                    apiKey: this.newsApiKey
                }
            });

            return response.data.articles.map((article: any) => 
                this.normalizeArticle(article, category));
        } catch (error) {
            console.error('Error fetching top headlines:', error);
            return [];
        }
    }

    /**
     * Fetch articles from everything endpoint
     */
    private async fetchEverything(
        category: string,
        from: string,
        to: string,
        language: string,
        sortBy: string,
        pageSize: number
    ): Promise<NewsArticle[]> {
        try {
            const response = await axios.get(this.everythingUrl, {
                params: {
                    q: category,
                    from,
                    to,
                    language,
                    sortBy,
                    pageSize,
                    apiKey: this.newsApiKey
                }
            });

            return response.data.articles.map((article: any) => 
                this.normalizeArticle(article, category));
        } catch (error) {
            console.error('Error fetching articles:', error);
            return [];
        }
    }

    /**
     * Map our categories to NewsAPI categories
     */
    private mapCategory(category: string): string {
        const categoryMap: { [key: string]: string } = {
            'technology': 'technology',
            'science': 'science',
            'business': 'business',
            'health': 'health',
            'environment': 'science',
            'space': 'science',
            'ai': 'technology',
            'quantum-computing': 'technology'
        };
        return categoryMap[category] || 'technology';
    }

    /**
     * Normalize article data
     */
    private normalizeArticle(article: any, category: string): NewsArticle {
        return {
            title: article.title,
            description: article.description || '',
            content: article.content || article.description || '',
            url: article.url,
            source: {
                name: article.source.name,
                url: article.source.url || ''
            },
            author: article.author,
            publishedAt: article.publishedAt,
            urlToImage: article.urlToImage,
            category
        };
    }

    /**
     * Remove duplicate articles based on URL
     */
    private deduplicateArticles(articles: NewsArticle[]): NewsArticle[] {
        const seen = new Set<string>();
        return articles.filter(article => {
            if (seen.has(article.url)) {
                return false;
            }
            seen.add(article.url);
            return true;
        });
    }
} 