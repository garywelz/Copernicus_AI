import type { Podcast } from '../../types/podcast';
interface OAuthCredentials {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
}
export declare class YouTubeDistributor {
    private youtube;
    private oauth2Client;
    constructor(credentials: OAuthCredentials);
    uploadPodcast(podcast: Podcast): Promise<string>;
    private generateDescription;
}
export {};
