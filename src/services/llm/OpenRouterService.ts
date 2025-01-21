// src/services/llm/OpenRouterService.ts

import { elizaLogger } from '@elizaos/core';
import { ILLMService, CompletionOptions, CompletionResponse } from '../interfaces/ILLMService.js';

interface ApiUsageMetrics {
    requestCount: number;
    tokenCount: number;
    lastRequestTime: Date;
    totalCost: number;
}

interface OpenRouterMessage {
    role: string;
    content: string;
}

interface OpenRouterChoice {
    message: {
        content: string;
    };
    finish_reason: string;
}

interface OpenRouterResponse {
    id: string;
    choices: OpenRouterChoice[];
    model: string;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    response_ms?: number;
}

interface OpenRouterRequest {
    model: string;
    messages: OpenRouterMessage[];
    temperature?: number;
    max_tokens?: number;
}

export class OpenRouterService implements ILLMService {
    private readonly apiKey: string;
    private readonly baseUrl: string;
    private readonly defaultModel: string;
    private readonly maxRetries: number;
    private metrics: ApiUsageMetrics;
    private cache: Map<string, { response: any; timestamp: Date }>;
    private readonly cacheDuration: number; // in milliseconds

    constructor(apiKey: string, options = {
        baseUrl: 'https://openrouter.ai/api/v1',
        defaultModel: 'gpt-3.5-turbo',
        maxRetries: 3,
        cacheDuration: 24 * 60 * 60 * 1000 // 24 hours by default
    }) {
        if (!apiKey) {
            throw new Error('OpenRouter API key is required');
        }
        this.apiKey = apiKey;
        this.baseUrl = options.baseUrl;
        this.defaultModel = options.defaultModel;
        this.maxRetries = options.maxRetries;
        this.cacheDuration = options.cacheDuration;
        this.metrics = {
            requestCount: 0,
            tokenCount: 0,
            lastRequestTime: new Date(),
            totalCost: 0
        };
        this.cache = new Map();
    }

    private getCacheKey(prompt: string, options: any): string {
        return JSON.stringify({ prompt, options });
    }

    private async getFromCache(key: string): Promise<any | null> {
        const cached = this.cache.get(key);
        if (!cached) return null;

        const now = new Date();
        if (now.getTime() - cached.timestamp.getTime() > this.cacheDuration) {
            this.cache.delete(key);
            return null;
        }

        elizaLogger.info('Cache hit:', { key });
        return cached.response;
    }

    private setCache(key: string, response: any): void {
        this.cache.set(key, { response, timestamp: new Date() });
    }

    public getMetrics(): ApiUsageMetrics {
        return { ...this.metrics };
    }

    private updateMetrics(response: OpenRouterResponse): void {
        this.metrics.requestCount++;
        this.metrics.lastRequestTime = new Date();
        if (response.usage) {
            this.metrics.tokenCount += response.usage.total_tokens;
            // Approximate cost calculation (you can adjust the rates)
            this.metrics.totalCost += (response.usage.total_tokens / 1000) * 0.002;
        }
        elizaLogger.info('API Usage Metrics:', this.metrics);
    }

    private async makeRequest(endpoint: string, requestData: any, retryCount = 0): Promise<Response> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': `${process.env.APPLICATION_URL || 'https://github.com/yourusername/copernicus'}`,
                },
                body: JSON.stringify(requestData)
            });

            if (response.status === 429 && retryCount < this.maxRetries) {
                const delay = Math.pow(2, retryCount) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.makeRequest(endpoint, requestData, retryCount + 1);
            }

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`OpenRouter API error: ${error.message || response.statusText}`);
            }

            return response;

        } catch (error) {
            if (error instanceof Error && error.message.includes('network') && retryCount < this.maxRetries) {
                const delay = Math.pow(2, retryCount) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.makeRequest(endpoint, requestData, retryCount + 1);
            }
            throw error;
        }
    }

    public async processBatch(prompts: string[], options: CompletionOptions = {}): Promise<CompletionResponse[]> {
        const results: CompletionResponse[] = [];
        const errors: Error[] = [];
    
        await Promise.all(prompts.map(async (prompt, index) => {
            try {
                const result = await this.generateCompletion(prompt, options);
                results[index] = result;
            } catch (error) {
                errors[index] = error instanceof Error ? error : new Error(String(error));
                results[index] = { text: `Error processing prompt ${index + 1}: ${error.message}` };
            }
        }));
    
        if (errors.length > 0) {
            elizaLogger.warn('Some batch operations failed:', errors);
        }
    
        return results;
    }

    async generateCompletion(prompt: string, options: CompletionOptions = {}): Promise<CompletionResponse> {
        const cacheKey = this.getCacheKey(prompt, options);
        const cachedResponse = await this.getFromCache(cacheKey);
        if (cachedResponse) return cachedResponse;

        const request: OpenRouterRequest = {
            model: options.model || this.defaultModel,
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert academic researcher analyzing research papers.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 2000
        };

        try {
            elizaLogger.info('Sending request to OpenRouter:', {
                model: request.model,
                temperature: request.temperature,
                maxTokens: request.max_tokens
            });

            const response = await this.makeRequest('/chat/completions', request);
            const data: OpenRouterResponse = await response.json();

            if (!data.choices || data.choices.length === 0) {
                throw new Error('No completion choices returned from OpenRouter');
            }

            this.updateMetrics(data);
            const result = { text: data.choices[0].message.content };
            this.setCache(cacheKey, result);
            return result;

        } catch (error) {
            elizaLogger.error('OpenRouter API error:', error);
            throw error;
        }
    }

    async generateStructuredOutput<T>(
        prompt: string,
        schema: any,
        options: CompletionOptions = {}
    ): Promise<T> {
        const schemaPrompt = `
            Analyze the following content and provide a response in this JSON format:
            ${JSON.stringify(schema, null, 2)}

            Content:
            ${prompt}

            Provide only the JSON response, no additional text.`;

        const completion = await this.generateCompletion(schemaPrompt, options);
        
        try {
            const jsonStr = completion.text.replace(/```json\n?|\n?```/g, '').trim();
            return JSON.parse(jsonStr) as T;
        } catch (error) {
            elizaLogger.error('Error parsing structured output:', error);
            throw new Error('Failed to parse structured output from LLM response');
        }
    }
}