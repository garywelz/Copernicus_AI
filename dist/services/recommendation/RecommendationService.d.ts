import { Podcast } from '@prisma/client';
export declare class RecommendationService {
    private prisma;
    constructor();
    getRecommendations(userId: string, limit?: number): Promise<Podcast[]>;
    private calculatePodcastScore;
    getPersonalizedFeed(userId: string): Promise<Podcast[]>;
    getSubjectRecommendations(userId: string, subject: string): Promise<Podcast[]>;
    getTrendingPodcasts(): Promise<Podcast[]>;
}
