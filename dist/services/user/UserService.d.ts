import { User, Subscription, PodcastRequest } from '@prisma/client';
export interface UserProfile {
    id: string;
    email: string;
    name: string;
    subscription: {
        tier: SubscriptionTier;
        status: SubscriptionStatus;
        validUntil: Date;
    };
    podcastHistory: PodcastHistory[];
    preferences: UserPreferences;
}
export declare enum SubscriptionTier {
    FREE = "FREE",
    BASIC = "BASIC",
    PREMIUM = "PREMIUM"
}
export declare enum SubscriptionStatus {
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED",
    CANCELLED = "CANCELLED"
}
export interface PodcastHistory {
    id: string;
    title: string;
    listenedAt: Date;
    progress: number;
}
export interface UserPreferences {
    subjects: string[];
    notificationEnabled: boolean;
    privateByDefault: boolean;
    language: string;
}
export declare class UserService {
    private prisma;
    private readonly JWT_SECRET;
    constructor();
    createUser(email: string, password: string, name: string): Promise<User>;
    authenticate(email: string, password: string): Promise<string>;
    getUserProfile(userId: string): Promise<UserProfile>;
    updateSubscription(userId: string, tier: SubscriptionTier): Promise<Subscription>;
    createPodcastRequest(userId: string, prompt: string, isPrivate: boolean): Promise<PodcastRequest>;
    updatePodcastHistory(userId: string, podcastId: string, progress: number): Promise<void>;
    getRecommendations(userId: string): Promise<any[]>;
    updatePreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences>;
}
