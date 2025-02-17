// Define types for Anthropic SDK
interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AnthropicResponse {
  content: Array<{ text: string }>;
}

interface AnthropicClient {
  messages: {
    create: (params: {
      model: string;
      max_tokens: number;
      temperature: number;
      system: string;
      messages: AnthropicMessage[];
    }) => Promise<AnthropicResponse>;
  };
}

// Try importing Anthropic SDK, fallback to mock if not available
let Anthropic: { new(config: { apiKey: string }): AnthropicClient };

try {
  Anthropic = require('@anthropic-ai/sdk');
} catch {
  // Mock implementation for development/testing
  Anthropic = class {
    messages = {
      create: async () => ({
        content: [{ text: 'Mock response from Claude' }]
      })
    };
  };
}

import { logger } from '../../utils/logger.js';

interface ResponseOptions {
  role: 'host' | 'expert';
  context: string[];
  question: string;
}

export class ClaudeService {
  private client: AnthropicClient;

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

      const messages: AnthropicMessage[] = [
        ...context.map(msg => ({ 
          role: 'assistant' as const, 
          content: msg 
        })),
        { 
          role: 'user' as const, 
          content: question 
        }
      ];

      const response = await this.client.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 150,
        temperature: 0.7,
        system: systemPrompt,
        messages
      });

      const answer = response.content[0]?.text;
      if (!answer) {
        throw new Error('No response generated');
      }

      logger.debug(`Generated response for ${role}:`, answer);
      return answer;

    } catch (error: unknown) {
      logger.error('Error generating response:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to generate response: ${errorMessage}`);
    }
  }
} 