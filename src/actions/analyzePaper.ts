// src/actions/analyzePaper.ts
import { IAgentRuntime } from '@elizaos/core';
import { ResearchPaper, AnalyzeOptions } from '../types/paper';
import { processPaper } from '../services/paperProcessor';
import { formatCitation } from '../utils/citationFormatter';

export const analyzePaperAction = {
  name: 'analyzePaper',
  description: 'Analyzes a research paper and provides insights.',
  handler: async (
    runtime: IAgentRuntime,
    memory: {
      userId: string;
      agentId: string;
      roomId: string;
      content: ResearchPaper;
    },
    state: Record<string, unknown>,
    args: AnalyzeOptions,
    callback: (result: Record<string, unknown>) => void
  ) => {
    try {
      // Ensure API key exists
      const apiKey = runtime.character?.settings?.secrets?.OPENROUTER_API_KEY;
      if (!apiKey) {
        callback({ error: 'Missing API key for analysis service.' });
        return;
      }

      const analysis = await processPaper(memory.content, args, apiKey);
      const citation = formatCitation(memory.content, {
        style: 'APA',
        includeLinks: true,
        includeDOI: true
      });

      callback({
        success: true,
        analysis,
        citation
      });
    } catch (error) {
      // Handle error without relying on a logger in runtime
      console.error('Error in analyzePaperAction:', error);
      callback({ success: false, error: 'Failed to analyze the paper.' });
    }
  },
};
