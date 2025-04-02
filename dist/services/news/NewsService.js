"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsService = void 0;
const axios_1 = __importDefault(require("axios"));
class NewsService {
    constructor(apiKey) {
        this.baseUrl = 'https://newsapi.org/v2';
        this.topHeadlinesUrl = `${this.baseUrl}/top-headlines`;
        this.everythingUrl = `${this.baseUrl}/everything`;
        this.newsApiKey = apiKey;
    }
    /**
     * Fetch articles based on search options
     * @param options Search parameters including category, dates, and sorting
     * @returns Array of news articles
     */
    async fetchArticles(options) {
        const { category, from, to, language = 'en', sortBy = 'relevancy', pageSize = 10, page = 1 } = options;
        try {
            // Try top headlines first for the category
            const headlinesResponse = await this.fetchTopHeadlines(category, language, pageSize);
            // If not enough headlines, supplement with everything endpoint
            if (headlinesResponse.length < pageSize) {
                const everythingResponse = await this.fetchEverything(category, from, to, language, sortBy, pageSize - headlinesResponse.length);
                // Combine and deduplicate results
                const combined = [...headlinesResponse, ...everythingResponse];
                return this.deduplicateArticles(combined);
            }
            return headlinesResponse;
        }
        catch (error) {
            console.error('Error fetching news articles:', error);
            throw new Error('Failed to fetch news articles');
        }
    }
    /**
     * Fetch top headlines for a category
     */
    async fetchTopHeadlines(category, language, pageSize) {
        try {
            const response = await axios_1.default.get(this.topHeadlinesUrl, {
                params: {
                    category: this.mapCategory(category),
                    language,
                    pageSize,
                    apiKey: this.newsApiKey
                }
            });
            return response.data.articles.map((article) => this.normalizeArticle(article, category));
        }
        catch (error) {
            console.error('Error fetching top headlines:', error);
            return [];
        }
    }
    /**
     * Fetch articles from everything endpoint
     */
    async fetchEverything(category, from, to, language, sortBy, pageSize) {
        try {
            const response = await axios_1.default.get(this.everythingUrl, {
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
            return response.data.articles.map((article) => this.normalizeArticle(article, category));
        }
        catch (error) {
            console.error('Error fetching articles:', error);
            return [];
        }
    }
    /**
     * Map our categories to NewsAPI categories
     */
    mapCategory(category) {
        const categoryMap = {
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
    normalizeArticle(article, category) {
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
    deduplicateArticles(articles) {
        const seen = new Set();
        return articles.filter(article => {
            if (seen.has(article.url)) {
                return false;
            }
            seen.add(article.url);
            return true;
        });
    }
}
exports.NewsService = NewsService;
//# sourceMappingURL=NewsService.js.map