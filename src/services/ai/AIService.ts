import { OpenRouterService } from '../llm/OpenRouterService';
import { logger } from '../../utils/logger';

interface ResponseOptions {
  role: 'host' | 'expert';
  context: string[];
  question: string;
}

export class AIService {
  private llmService: OpenRouterService;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('OpenRouter API key is required');
    }
    this.llmService = new OpenRouterService(apiKey);
  }

  async generateResponse(options: ResponseOptions): Promise<string> {
    try {
      const { role, context, question } = options;

      const systemPrompt = role === 'expert' 
        ? "You are an AI expert named Charlotte speaking on a podcast. Keep responses concise and conversational."
        : "You are a podcast host named Gary. Keep responses engaging and natural.";

      const prompt = `${systemPrompt}\n\nContext:\n${context.join('\n')}\n\nQuestion: ${question}`;

      const response = await this.llmService.generateCompletion(prompt);

      logger.debug(`Generated response for ${role}:`, response.text);
      return response.text;

    } catch (error: unknown) {
      logger.error('Error generating response:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to generate response: ${errorMessage}`);
    }
  }
} 