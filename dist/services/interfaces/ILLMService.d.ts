export interface CompletionOptions {
    model?: string;
    temperature?: number;
    maxTokens?: number;
}
export interface CompletionResponse {
    text: string;
}
export interface ILLMService {
    generateCompletion(prompt: string, options?: CompletionOptions): Promise<CompletionResponse>;
    generateStructuredOutput<T>(prompt: string, schema: any, options?: CompletionOptions): Promise<T>;
}
