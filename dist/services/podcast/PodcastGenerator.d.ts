import { PodcastScript } from '../../types/podcast';
import { IVoiceService } from '../interfaces/IVoiceService';
export declare class PodcastGenerator {
    private ttsService;
    private descriptService?;
    constructor(ttsService: IVoiceService, descriptConfig?: {
        apiKey: string;
    });
    generatePodcast(template: PodcastScript): Promise<Buffer>;
}
