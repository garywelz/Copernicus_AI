import { ITwitterService } from '../interfaces/ITwitterService';
import { AudioProcessor } from '../../utils/audio';
import type { Podcast } from '../../types/podcast';
import type { TweetResponse } from '@/types/twitter';
export declare class PodcastDistributor {
    private twitterService;
    private audioProcessor;
    constructor(twitterService: ITwitterService, audioProcessor: AudioProcessor);
    shareToTwitter(podcast: Podcast): Promise<TweetResponse>;
    private createPreviewClip;
    private downloadAudio;
}
