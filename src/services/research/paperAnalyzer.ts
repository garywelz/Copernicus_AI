import type { ResearchPaper, PaperAnalysis } from '../types/paper';
import { OpenRouterService } from './llm/OpenRouterService';

export async function analyzePaper(
  paper: ResearchPaper,
  options?: {
    depth?: 'quick' | 'detailed';
    outputFormat?: 'summary' | 'structured';
  }
): Promise<PaperAnalysis> {
  const llm = new OpenRouterService(process.env.OPENROUTER_API_KEY || '');
  
  const prompt = `Analyze this research paper:
Title: ${paper.title}
Authors: ${paper.authors.join(', ')}
Content: ${paper.content}

Provide a ${options?.depth || 'quick'} analysis with ${options?.outputFormat || 'summary'} format.`;

  const response = await llm.generateStructuredOutput<PaperAnalysis>(prompt, {
    type: 'object',
    properties: {
      summary: { type: 'string' },
      keyPoints: { type: 'array', items: { type: 'string' } }
    }
  });

  return response;
} 