import { logger } from '../../utils/logger.js';

interface ResponseOptions {
  role: 'host' | 'expert';
  context: string[];
  question: string;
  mode?: 'podcast' | 'qa';
}

export class DeepseekService {
  private apiKey: string;
  private baseUrl = 'https://api.deepseek.com/v1';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Deepseek API key is required');
    }
    this.apiKey = apiKey;
  }

  async generateResponse(options: ResponseOptions): Promise<string> {
    try {
      const { role, context, question, mode = 'podcast' } = options;

      const systemPrompt = mode === 'podcast'
        ? this.getPodcastPrompt(role)
        : this.getQAPrompt(role);

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat-67b',
          messages: [
            { role: 'system', content: systemPrompt },
            ...context.map(msg => ({ role: 'assistant', content: msg })),
            { role: 'user', content: question }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`Deepseek API error: ${response.statusText}`);
      }

      const data = await response.json();
      const answer = data.choices[0]?.message?.content;

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

  // Keep the same prompt methods...
} 