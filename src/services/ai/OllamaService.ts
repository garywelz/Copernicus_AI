import { logger } from '../../utils/logger.js';

interface ResponseOptions {
  role: 'host' | 'expert';
  context: string[];
  question: string;
  mode?: 'podcast' | 'qa';
}

export class OllamaService {
  private baseUrl: string;

  constructor(baseUrl = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
  }

  async generateResponse(options: ResponseOptions): Promise<string> {
    try {
      const { role, context, question, mode = 'podcast' } = options;

      const systemPrompt = mode === 'podcast'
        ? this.getPodcastPrompt(role)
        : this.getQAPrompt(role);

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral',
          prompt: `${systemPrompt}\n\nContext:\n${context.join('\n')}\n\nQuestion: ${question}\n\nResponse:`,
          stream: false
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      const answer = data.response;

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

  private getPodcastPrompt(role: string): string {
    return role === 'expert'
      ? "You are an AI expert named Charlotte speaking on a podcast. You are knowledgeable, engaging, and good at explaining complex topics clearly. Keep your responses natural and conversational, but maintain high accuracy and insight."
      : "You are a podcast host named Gary. You are skilled at guiding conversations, asking insightful questions, and making complex topics accessible. Keep the discussion flowing naturally while drawing out interesting insights from your expert guest.";
  }

  private getQAPrompt(role: string): string {
    return role === 'expert'
      ? "You are an AI expert named Charlotte. A listener has asked a question. Provide a clear, accurate answer that connects to the current discussion while drawing on your broader knowledge. Be concise but thorough."
      : "You are podcast host Gary. Help clarify the listener's question and facilitate the discussion.";
  }
} 