export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'expired';
export interface UserProfile {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    subscription: {
        tier: SubscriptionTier;
        status: SubscriptionStatus;
        validUntil: Date;
    };
    podcastHistory: PodcastHistory[];
    preferences: UserPreferences;
}
export interface PodcastHistory {
    id: string;
    podcastId: string;
    title: string;
    progress: number;
    listenedAt: Date;
}
export interface UserPreferences {
    language: string;
    subjects: string[];
    notificationEnabled: boolean;
    privateByDefault: boolean;
    metadata?: Record<string, any>;
}
