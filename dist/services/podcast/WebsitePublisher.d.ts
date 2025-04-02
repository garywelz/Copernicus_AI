import type { Podcast } from '../../types/podcast';
export interface WebsiteConfig {
    baseUrl: string;
    apiKey: string;
    podcastPath: string;
}
export declare class WebsitePublisher {
    private config;
    constructor(config: WebsiteConfig);
    publishToWebsite(podcast: Podcast): Promise<string>;
}
