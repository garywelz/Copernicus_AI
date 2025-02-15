import Anthropic from '@anthropic-ai/sdk';
import { logger } from '../../utils/logger.js';

interface ResponseOptions {
  role: 'host' | 'expert';
  context: string[];
  question: string;
}

export class ClaudeService {
  private client: Anthropic;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Anthropic API key is required');
    }
    this.client = new Anthropic({ apiKey });
  }

  async generateResponse(options: ResponseOptions): Promise<string> {
    try {
      const { role, context, question } = options;

      const systemPrompt = role === 'expert' 
        ? "You are an AI expert named Charlotte speaking on a podcast. Keep responses concise and conversational."
        : "You are a podcast host named Gary. Keep responses engaging and natural.";

      const response = await this.client.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 150,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          ...context.map(msg => ({ role: 'assistant', content: msg })),
          { role: 'user', content: question }
        ]
      });

      const answer = response.content[0]?.text;
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