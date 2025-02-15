import type { PodcastScript, PodcastOptions, PodcastSegment } from '../../types/podcast.js';
import type { PaperAnalysis } from '../../types/paper.js';
import type { ILLMService } from '../interfaces/ILLMService.js';
import { logger } from '../../utils/logger.js';

interface VoiceConfig {
  role: string;
  model: string;
}

interface DialogueSegment extends PodcastSegment {
  speaker: string;
  pauseAfter?: boolean;
}

export class PodcastGenerationService {
  private readonly targetWordsPerMinute = 150; // Average speaking pace

  constructor(
    private llmService: ILLMService,
    private voices: Record<string, VoiceConfig>
  ) {}

  async generatePodcastScript(
    analysis: PaperAnalysis,
    options: PodcastOptions
  ): Promise<PodcastScript> {
    try {
      logger.info('Generating podcast script with options:', options);

      const prompt = this.createScriptPrompt(analysis, options);
      const response = await this.llmService.generateStructuredOutput<PodcastScript>(
        prompt,
        this.getPodcastSchema()
      );

      // Calculate durations based on word count
      const scriptWithDurations = this.calculateSegmentDurations(response);

      logger.info('Generated podcast script with duration:', scriptWithDurations.totalDuration);
      return scriptWithDurations;
    } catch (error) {
      logger.error('Error generating podcast script:', error);
      throw new Error('Failed to generate podcast script');
    }
  }

  private createScriptPrompt(analysis: PaperAnalysis, options: PodcastOptions): string {
    return `Create a ${options.style} podcast script about a research paper.
The podcast should be approximately ${options.targetDuration} minutes long
and aimed at a ${options.complexity} audience.

Use these roles:
- Host (${this.voices.host.role})
- Expert (${this.voices.expert.role})
- Questioner (${this.voices.questioner.role})

Paper Analysis:
${JSON.stringify(analysis, null, 2)}

Format the script with clear speaker labels and include interaction points.
Add pause points after significant revelations or complex explanations.
Include citations when referencing specific findings.`;
  }

  private getPodcastSchema() {
    return {
      type: 'object',
      properties: {
        title: { type: 'string' },
        introduction: { type: 'string' },
        segments: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              content: { type: 'string' },
              speaker: { type: 'string' },
              pauseAfter: { type: 'boolean', optional: true }
            }
          }
        },
        conclusion: { type: 'string' }
      }
    };
  }

  private calculateSegmentDurations(script: PodcastScript): PodcastScript {
    const calculateDuration = (text: string): number => {
      const words = text.split(/\s+/).length;
      return Math.ceil((words / this.targetWordsPerMinute) * 60);
    };

    const segments = script.segments.map(segment => ({
      ...segment,
      duration: calculateDuration(segment.content)
    }));

    const totalDuration = segments.reduce(
      (total, segment) => total + segment.duration,
      calculateDuration(script.introduction) + calculateDuration(script.conclusion)
    );

    return {
      ...script,
      segments,
      totalDuration
    };
  }
} 