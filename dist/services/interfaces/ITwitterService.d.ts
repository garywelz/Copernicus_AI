export interface TweetOptions {
    text: string;
    media?: {
        imageData?: Buffer;
        mimeType?: string;
    };
}
export interface TweetResponse {
    id: string;
    text: string;
    createdAt: string;
}
export interface ITwitterService {
    postTweet(options: TweetOptions): Promise<TweetResponse>;
}
