import OpenAI from 'openai';
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

export class NewsAnalyzer {
    private readonly openai: OpenAI;
    private readonly defaultOptions: AnalysisOptions = {
        maxTokens: 1000,
        temperature: 0.7,
        format: 'detailed'
    };

    constructor(apiKey: string) {
        this.openai = new OpenAI({ apiKey });
    }

    /**
     * Analyze multiple news articles and create a cohesive narrative
     * @param articles Array of news articles
     * @param options Analysis options
     * @returns Combined analysis of all articles
     */
    async analyzeArticles(
        articles: NewsArticle[],
        options: AnalysisOptions = {}
    ): Promise<NewsAnalysis[]> {
        try {
            // Group articles by subtopic
            const groupedArticles = await this.groupArticlesByTopic(articles);
            
            // Analyze each group
            const analyses = await Promise.all(
                Object.values(groupedArticles).map(group =>
                    this.analyzeArticleGroup(group, options)
                )
            );

            // Find connections between topics
            if (analyses.length > 1) {
                const connections = await this.findConnections(analyses);
                analyses.forEach((analysis, i) => {
                    analysis.background += `\n\nRelated developments:\n${
                        connections[i].join('\n')
                    }`;
                });
            }

            return analyses;
        } catch (error) {
            console.error('Error analyzing news articles:', error);
            throw new Error('Failed to analyze news articles');
        }
    }

    /**
     * Group articles by subtopic using semantic similarity
     */
    private async groupArticlesByTopic(
        articles: NewsArticle[]
    ): Promise<{ [key: string]: NewsArticle[] }> {
        try {
            const prompt = `
Please analyze these news articles and group them by subtopic.
Return a JSON object where keys are subtopic names and values are arrays of article indices.

Articles:
${articles.map((a, i) => `
${i}. ${a.title}
${a.description}
`).join('\n')}`;

            const response = await this.openai.chat.completions.create({
                model: 'gpt-4-turbo-preview',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a news analyst specializing in identifying related stories and themes.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 500
            });

            const groups = JSON.parse(response.choices[0].message.content);
            
            // Convert index groups to article groups
            return Object.fromEntries(
                Object.entries(groups).map(([topic, indices]: [string, number[]]) => [
                    topic,
                    indices.map(i => articles[i])
                ])
            );
        } catch (error) {
            console.error('Error grouping articles:', error);
            // Fall back to single group
            return { 'main': articles };
        }
    }

    /**
     * Analyze a group of related articles
     */
    private async analyzeArticleGroup(
        articles: NewsArticle[],
        options: AnalysisOptions
    ): Promise<NewsAnalysis> {
        const opts = { ...this.defaultOptions, ...options };

        try {
            const prompt = this.constructAnalysisPrompt(articles, opts.format);
            
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4-turbo-preview',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a news analyst specializing in creating engaging news segments.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: opts.temperature,
                max_tokens: opts.maxTokens
            });

            const analysis = JSON.parse(response.choices[0].message.content);
            return this.validateAnalysis(analysis);
        } catch (error) {
            console.error('Error analyzing article group:', error);
            throw new Error('Failed to analyze article group');
        }
    }

    /**
     * Find connections between different news topics
     */
    private async findConnections(
        analyses: NewsAnalysis[]
    ): Promise<string[][]> {
        try {
            const prompt = this.constructConnectionsPrompt(analyses);
            
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4-turbo-preview',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a news synthesizer specializing in finding connections between different news topics.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            });

            return JSON.parse(response.choices[0].message.content);
        } catch (error) {
            console.error('Error finding connections between topics:', error);
            return analyses.map(() => []);
        }
    }

    /**
     * Construct prompt for news analysis
     */
    private constructAnalysisPrompt(
        articles: NewsArticle[],
        format: 'brief' | 'detailed'
    ): string {
        return `
Please analyze these related news articles and provide a structured analysis.
Format: ${format} (${format === 'brief' ? 'concise key points' : 'detailed analysis'})

Articles:
${articles.map(a => `
Title: ${a.title}
Source: ${a.source.name}
Content: ${a.content}
`).join('\n')}

Please provide the analysis in the following JSON format:
{
    "title": "Segment title",
    "summary": "Overview of the news topic",
    "keyPoints": ["Array of main points"],
    "impact": "Significance and implications",
    "background": "Context and history",
    "quotes": ["Notable quotes"],
    "relatedTopics": ["Related themes or stories"],
    "suggestedSegments": [
        {
            "title": "Segment title",
            "content": "Segment script",
            "speaker": "host/correspondent",
            "duration": "estimated seconds"
        }
    ],
    "keywords": ["Relevant keywords"]
}`;
    }

    /**
     * Construct prompt for finding connections between topics
     */
    private constructConnectionsPrompt(analyses: NewsAnalysis[]): string {
        return `
Please analyze these ${analyses.length} news topics and identify meaningful connections between them.
Focus on broader themes, cause-and-effect relationships, and potential impacts.

Topics:
${analyses.map((a, i) => `
Topic ${i + 1}: ${a.title}
Summary: ${a.summary}
Key Points: ${a.keyPoints.join(', ')}
`).join('\n')}

Please provide an array of connection descriptions for each topic in JSON format.
Each topic should have an array of strings describing its connections to other topics.`;
    }

    /**
     * Validate and clean analysis output
     */
    private validateAnalysis(analysis: any): NewsAnalysis {
        // Ensure all required fields are present
        const requiredFields = [
            'title', 'summary', 'keyPoints', 'impact',
            'background', 'quotes', 'relatedTopics',
            'suggestedSegments', 'keywords'
        ];

        for (const field of requiredFields) {
            if (!analysis[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Validate arrays
        if (!Array.isArray(analysis.keyPoints) ||
            !Array.isArray(analysis.quotes) ||
            !Array.isArray(analysis.relatedTopics) ||
            !Array.isArray(analysis.suggestedSegments) ||
            !Array.isArray(analysis.keywords)) {
            throw new Error('Invalid analysis format: arrays required for keyPoints, quotes, relatedTopics, suggestedSegments, and keywords');
        }

        // Validate segments
        for (const segment of analysis.suggestedSegments) {
            if (!segment.title || !segment.content || !segment.speaker) {
                throw new Error('Invalid segment format: missing required fields');
            }
        }

        return analysis as NewsAnalysis;
    }
} 