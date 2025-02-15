import OpenAI from 'openai';
import { logger } from '../../utils/logger.js';

interface ResponseOptions {
  role: 'host' | 'expert';
  context: string[];
  question: string;
}

export class OpenAIService {
  private client: OpenAI;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }
    this.client = new OpenAI({ apiKey });
  }

  async generateResponse(options: ResponseOptions): Promise<string> {
    try {
      const { role, context, question } = options;

      const systemPrompt = role === 'expert' 
        ? "You are an AI expert named Charlotte speaking on a podcast. Keep responses concise and conversational."
        : "You are a podcast host named Gary. Keep responses engaging and natural.";

      const response = await this.client.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...context.map(msg => ({ role: "assistant" as const, content: msg })),
          { role: "user", content: question }
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      const answer = response.choices[0]?.message?.content;
      if (!answer) {
        throw new Error('No response generated');
      }

      logger.debug(`Generated response for ${role}:`, answer);
      return answer;

    } catch (error) {
      logger.error('Error generating response:', error);
      throw new Error(`Failed to generate response: ${error.message}`);
    }
  }
} 