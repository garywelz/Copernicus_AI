import type { PodcastScript, PodcastOptions } from '../../types/podcast.js';
import type { PaperAnalysis } from '../../types/paper.js';
import type { ILLMService } from '../interfaces/ILLMService.js';
interface VoiceConfig {
    role: string;
    model: string;
    voice: string;
    speed: number;
}
export declare class PodcastGenerationService {
    private llmService;
    private voices;
    private readonly targetWordsPerMinute;
    private readonly ttsService;
    constructor(llmService: ILLMService, voices: Record<string, VoiceConfig>);
    generatePodcastScript(content: PaperAnalysis | string[], options: PodcastOptions): Promise<PodcastScript>;
    generateAudio(script: PodcastScript): Promise<Buffer>;
    private createResearchScriptPrompt;
    private createNewsScriptPrompt;
    private getPodcastSchema;
    private calculateSegmentDurations;
}
export {};
