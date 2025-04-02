"use strict";
// src/services/llm/OpenRouterService.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenRouterService = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const https_1 = __importDefault(require("https"));
class OpenRouterService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://openrouter.ai/api/v1';
        this.cache = new Map();
        this.cacheDuration = 1000 * 60 * 60; // 1 hour
        // Initialize HTTPS agent with relaxed SSL verification
        this.agent = new https_1.default.Agent({
            rejectUnauthorized: false
        });
    }
    getCacheKey(paper, options) {
        return `${paper.title}-${paper.authors.join()}-${options.depth}`;
    }
    getCachedAnalysis(key) {
        const entry = this.cache.get(key);
        if (!entry)
            return null;
        if (Date.now() - entry.timestamp > this.cacheDuration) {
            this.cache.delete(key);
            return null;
        }
        return entry.data;
    }
    setCachedAnalysis(key, data) {
        this.cache.set(key, {
            timestamp: Date.now(),
            data
        });
    }
    async generateCompletion(prompt, options) {
        const response = await this.makeRequest('/chat/completions', {
            method: 'POST',
            body: {
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: options?.temperature ?? 0.7,
                max_tokens: options?.maxTokens ?? 1000,
                ...options
            }
        });
        return { text: response.choices[0].message.content };
    }
    async analyzePaper(paper, options) {
        try {
            const prompt = this.createAnalysisPrompt(paper, options);
            const cacheKey = this.getCacheKey(paper, options);
            // Check cache first
            const cached = this.getCachedAnalysis(cacheKey);
            if (cached) {
                console.log('Using cached analysis');
                return cached;
            }
            const response = await this.makeRequest('/chat/completions', {
                method: 'POST',
                body: {
                    messages: [
                        {
                            role: "system",
                            content: "You are a research paper analyzer. Provide clear, structured analysis with specific details and examples from the paper."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    model: "gpt-3.5-turbo",
                    temperature: 0.7,
                    max_tokens: 1000,
                    stream: false
                }
            });
            const analysis = this.parseAnalysisResponse(response);
            // Cache the result
            this.setCachedAnalysis(cacheKey, analysis);
            return analysis;
        }
        catch (error) {
            console.error('Error analyzing paper:', error);
            throw new Error(`Failed to analyze paper: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    createAnalysisPrompt(paper, options) {
        return `Analyze this research paper with ${options.depth} detail:

Title: ${paper.title}
Authors: ${paper.authors.join(', ')}

Content:
${paper.content}

Please provide a structured analysis with the following sections:

1. Summary of the paper
- Provide a concise overview
- Highlight the main objectives

2. Key points and findings
- List the major findings
- Include supporting evidence
- Highlight innovative aspects

3. Methodology used
- Describe research methods
- Evaluate approach effectiveness

4. Implications and conclusions
- Discuss impact on the field
- Address practical applications
- Note limitations if any

Format each section clearly with headers.`;
    }
    parseAnalysisResponse(response) {
        try {
            const content = response.choices[0].message.content;
            // Updated regex patterns to handle both markdown and plain formats
            const summaryMatch = content.match(/(?:\*\*)?1\.\s*Summary (?:of the )?(?:P|p)aper:(?:\*\*)?\s*(.*?)(?=\n\n(?:\*\*)?2\.)/s)
                || content.match(/1\.\s*Summary (?:of the )?(?:P|p)aper:\s*(.*?)(?=\n\n2\.)/s);
            const keyPointsMatch = content.match(/(?:\*\*)?2\.\s*Key [Pp]oints and [Ff]indings:(?:\*\*)?\s*(.*?)(?=\n\n(?:\*\*)?3\.)/s)
                || content.match(/2\.\s*Key [Pp]oints and [Ff]indings:\s*(.*?)(?=\n\n3\.)/s);
            const methodologyMatch = content.match(/(?:\*\*)?3\.\s*Methodology [Uu]sed:(?:\*\*)?\s*(.*?)(?=\n\n(?:\*\*)?4\.)/s)
                || content.match(/3\.\s*Methodology [Uu]sed:\s*(.*?)(?=\n\n4\.)/s);
            const implicationsMatch = content.match(/(?:\*\*)?4\.\s*Implications and [Cc]onclusions:(?:\*\*)?\s*(.*?)(?=\n\nOverall|$)/s)
                || content.match(/4\.\s*Implications and [Cc]onclusions:\s*(.*?)(?=\n\nOverall|$)/s);
            if (!summaryMatch || !keyPointsMatch || !methodologyMatch || !implicationsMatch) {
                console.warn('Failed to parse some sections of the analysis response');
                console.log('Content:', content);
                console.log('Matches:', { summaryMatch, keyPointsMatch, methodologyMatch, implicationsMatch });
            }
            // Extract and clean up the sections
            const summary = summaryMatch?.[1]?.trim() ?? '';
            // Handle both bullet points and paragraph format for key points
            const keyPointsText = keyPointsMatch?.[1]?.trim() ?? '';
            const keyPoints = keyPointsText
                .split('\n')
                .filter(line => line.trim().startsWith('-'))
                .map(point => point.trim().replace(/^-\s*/, ''));
            const methodology = methodologyMatch?.[1]?.trim() ?? '';
            // Clean up implications to be more concise
            const implications = implicationsMatch?.[1]?.trim()
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0 && !line.endsWith(':'))
                .join('\n') ?? '';
            return {
                summary,
                keyPoints,
                methodology,
                implications
            };
        }
        catch (error) {
            console.error('Error parsing analysis response:', error);
            throw new Error('Failed to parse analysis response');
        }
    }
    async generateStructuredOutput(prompt, schema, options) {
        const response = await this.makeRequest('/structured', {
            method: 'POST',
            body: {
                prompt,
                schema,
                ...options
            }
        });
        return response;
    }
    async makeRequest(endpoint, config) {
        const url = `${this.baseUrl}${endpoint}`;
        console.log('Making request to:', url);
        console.log('Request body:', JSON.stringify(config.body, null, 2));
        const response = await (0, node_fetch_1.default)(url, {
            method: config.method,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://github.com/gdubs/copernicus',
                'X-Title': 'Copernicus Research Paper Analyzer',
                'Accept': 'application/json'
            },
            body: JSON.stringify(config.body),
            // @ts-ignore
            agent: this.agent
        });
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        const responseText = await response.text();
        console.log('Response body:', responseText);
        if (!response.ok) {
            throw new Error(`API request failed (${response.status}): ${responseText}`);
        }
        try {
            return JSON.parse(responseText);
        }
        catch (error) {
            console.error('Failed to parse response as JSON:', error);
            throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
        }
    }
}
exports.OpenRouterService = OpenRouterService;
//# sourceMappingURL=OpenRouterService.js.map