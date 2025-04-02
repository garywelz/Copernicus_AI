"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationService = void 0;
const client_1 = require("@prisma/client");
const UserService_1 = require("../user/UserService");
class RecommendationService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async getRecommendations(userId, limit = 10) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                preferences: true,
                podcastHistory: {
                    include: { podcast: true },
                    orderBy: { listenedAt: 'desc' },
                    take: 50
                },
                subscription: true
            }
        });
        if (!user)
            throw new Error('User not found');
        // Get all podcasts
        const allPodcasts = await this.prisma.podcast.findMany({
            where: {
                isPrivate: false
            }
        });
        // Calculate scores for each podcast
        const scores = await Promise.all(allPodcasts.map(async (podcast) => {
            const score = await this.calculatePodcastScore(podcast, user);
            return {
                podcastId: podcast.id,
                score: score.total,
                factors: score.factors
            };
        }));
        // Sort by score and get top recommendations
        const topRecommendations = scores
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
        // Fetch full podcast details for recommendations
        const recommendedPodcasts = await this.prisma.podcast.findMany({
            where: {
                id: {
                    in: topRecommendations.map((rec) => rec.podcastId)
                }
            }
        });
        // Sort podcasts in the same order as recommendations
        return topRecommendations
            .map((rec) => recommendedPodcasts.find((p) => p.id === rec.podcastId))
            .filter(Boolean);
    }
    async calculatePodcastScore(podcast, user) {
        const factors = {
            subjectMatch: 0,
            recency: 0,
            popularity: 0,
            userPreference: 0
        };
        // Subject match score (0-1)
        if (user.preferences?.subjects.includes(podcast.subject)) {
            factors.subjectMatch = 1;
        }
        // Recency score (0-1)
        const podcastAge = Date.now() - podcast.createdAt.getTime();
        const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        factors.recency = Math.max(0, 1 - podcastAge / maxAge);
        // Popularity score (0-1)
        const listenerCount = await this.prisma.podcastHistory.count({
            where: { podcastId: podcast.id }
        });
        const maxListeners = 1000;
        factors.popularity = Math.min(1, listenerCount / maxListeners);
        // User preference score based on listening history (0-1)
        const userHistory = user.podcastHistory;
        const similarSubjectListens = userHistory.filter((h) => h.podcast.subject === podcast.subject).length;
        factors.userPreference = Math.min(1, similarSubjectListens / 10);
        // Calculate total score with weights
        const weights = {
            subjectMatch: 0.4,
            recency: 0.2,
            popularity: 0.2,
            userPreference: 0.2
        };
        const total = factors.subjectMatch * weights.subjectMatch +
            factors.recency * weights.recency +
            factors.popularity * weights.popularity +
            factors.userPreference * weights.userPreference;
        return { total, factors };
    }
    async getPersonalizedFeed(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { subscription: true }
        });
        if (!user)
            throw new Error('User not found');
        // Get recommendations based on subscription tier
        const recommendationCount = user.subscription?.tier === UserService_1.SubscriptionTier.PREMIUM
            ? 20
            : user.subscription?.tier === UserService_1.SubscriptionTier.BASIC
                ? 15
                : 10;
        return this.getRecommendations(userId, recommendationCount);
    }
    async getSubjectRecommendations(userId, subject) {
        const podcasts = await this.prisma.podcast.findMany({
            where: {
                subject,
                isPrivate: false
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 10
        });
        return podcasts;
    }
    async getTrendingPodcasts() {
        // Get podcasts with most listens in the last 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const trending = await this.prisma.podcast.findMany({
            where: {
                isPrivate: false,
                history: {
                    some: {
                        listenedAt: {
                            gte: sevenDaysAgo
                        }
                    }
                }
            },
            orderBy: {
                history: {
                    _count: 'desc'
                }
            },
            take: 10
        });
        return trending;
    }
}
exports.RecommendationService = RecommendationService;
//# sourceMappingURL=RecommendationService.js.map