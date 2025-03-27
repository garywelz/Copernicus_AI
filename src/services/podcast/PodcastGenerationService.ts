import type { PodcastScript, PodcastOptions, PodcastSegment, PodcastType } from '../../types/podcast.js';
import type { PaperAnalysis } from '../../types/paper.js';
import type { ILLMService } from '../interfaces/ILLMService.js';
import { OpenAITTSService } from '../voice/OpenAITTSService.js';
import { logger } from '../../utils/logger.js';

interface VoiceConfig {
  role: string;
  model: string;
  voice: string;
  speed: number;
}

interface DialogueSegment extends PodcastSegment {
  speaker: string;
  pauseAfter?: boolean;
}

export class PodcastGenerationService {
  private readonly targetWordsPerMinute = 150; // Average speaking pace
  private readonly ttsService: OpenAITTSService;

  constructor(
    private llmService: ILLMService,
    private voices: Record<string, VoiceConfig>
  ) {
    this.ttsService = new OpenAITTSService(process.env.OPENAI_API_KEY);
  }

  async generatePodcastScript(
    content: PaperAnalysis | string[],
    options: PodcastOptions
  ): Promise<PodcastScript> {
    try {
      logger.info('Generating podcast script with options:', options);

      const prompt = options.type === 'research' 
        ? this.createResearchScriptPrompt(content as PaperAnalysis, options)
        : this.createNewsScriptPrompt(content as string[], options);

      const response = await this.llmService.generateStructuredOutput<PodcastScript>(
        prompt,
        this.getPodcastSchema()
      );

      const scriptWithDurations = this.calculateSegmentDurations(response);
      logger.info('Generated podcast script with duration:', scriptWithDurations.totalDuration);
      
      return scriptWithDurations;
    } catch (error) {
      logger.error('Error generating podcast script:', error);
      throw new Error('Failed to generate podcast script');
    }
  }

  async generateAudio(script: PodcastScript): Promise<Buffer> {
    try {
      const audioSegments: Buffer[] = [];
      
      // Generate intro
      const introAudio = await this.ttsService.generateSpeech(script.introduction, this.voices.host);
      audioSegments.push(introAudio);

      // Generate segments
      for (const segment of script.segments) {
        const voiceConfig = this.voices[segment.speaker.toLowerCase()];
        const audio = await this.ttsService.generateSpeech(segment.content, voiceConfig);
        audioSegments.push(audio);
        
        if (segment.pauseAfter) {
          audioSegments.push(await this.ttsService.generatePause(1.5));
        }
      }

      // Generate conclusion
      const outroAudio = await this.ttsService.generateSpeech(script.conclusion, this.voices.host);
      audioSegments.push(outroAudio);

      return await this.ttsService.combineAudioSegments(audioSegments);
    } catch (error) {
      logger.error('Error generating audio:', error);
      throw new Error('Failed to generate audio');
    }
  }

  private createResearchScriptPrompt(analysis: PaperAnalysis, options: PodcastOptions): string {
    return `Create a research discussion podcast script about a scientific paper.
The podcast should be approximately ${options.targetDuration} minutes long
and aimed at a ${options.complexity} audience.

Use these roles:
${Object.entries(this.voices).map(([role, config]) => `- ${role}: ${config.role}`).join('\n')}

Paper Analysis:
${JSON.stringify(analysis, null, 2)}

Format the script with clear speaker labels and include natural interaction points.
Add pause points after significant revelations or complex explanations.
Include citations when referencing specific findings.`;
  }

  private createNewsScriptPrompt(newsItems: string[], options: PodcastOptions): string {
    return `Create a news program script about recent developments in ${options.subject}.
The program should be approximately ${options.targetDuration} minutes long
and aimed at a ${options.complexity} audience.

Use these roles:
${Object.entries(this.voices).map(([role, config]) => `- ${role}: ${config.role}`).join('\n')}

News Items:
${newsItems.map(item => `- ${item}`).join('\n')}

Format the script as a news program with:
- An engaging introduction
- Clear transitions between stories
- Expert commentary and analysis
- A concise conclusion
Include citations and links to sources.`;
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
        conclusion: { type: 'string' },
        references: {
          type: 'array',
          items: { type: 'string' }
        },
        hashtags: {
          type: 'array',
          items: { type: 'string' }
        }
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