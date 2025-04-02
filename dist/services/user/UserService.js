"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = exports.SubscriptionStatus = exports.SubscriptionTier = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
var SubscriptionTier;
(function (SubscriptionTier) {
    SubscriptionTier["FREE"] = "FREE";
    SubscriptionTier["BASIC"] = "BASIC";
    SubscriptionTier["PREMIUM"] = "PREMIUM";
})(SubscriptionTier || (exports.SubscriptionTier = SubscriptionTier = {}));
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "ACTIVE";
    SubscriptionStatus["EXPIRED"] = "EXPIRED";
    SubscriptionStatus["CANCELLED"] = "CANCELLED";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
class UserService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
        this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    }
    async createUser(email, password, name) {
        const hashedPassword = await (0, bcrypt_1.hash)(password, 10);
        return this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                subscription: {
                    create: {
                        tier: SubscriptionTier.FREE,
                        status: SubscriptionStatus.ACTIVE,
                        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days trial
                    }
                },
                preferences: {
                    create: {
                        subjects: [],
                        notificationEnabled: true,
                        privateByDefault: false,
                        language: 'en'
                    }
                }
            },
            include: {
                subscription: true,
                preferences: true
            }
        });
    }
    async authenticate(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new Error('User not found');
        const valid = await (0, bcrypt_1.compare)(password, user.password);
        if (!valid)
            throw new Error('Invalid password');
        return (0, jsonwebtoken_1.sign)({ userId: user.id }, this.JWT_SECRET, { expiresIn: '7d' });
    }
    async getUserProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                subscription: true,
                podcastHistory: true,
                preferences: true
            }
        });
        if (!user)
            throw new Error('User not found');
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            subscription: user.subscription,
            podcastHistory: user.podcastHistory,
            preferences: user.preferences
        };
    }
    async updateSubscription(userId, tier) {
        return this.prisma.subscription.update({
            where: { userId },
            data: {
                tier,
                status: SubscriptionStatus.ACTIVE,
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            }
        });
    }
    async createPodcastRequest(userId, prompt, isPrivate) {
        const user = await this.getUserProfile(userId);
        // Check subscription tier permissions
        if (user.subscription.tier === SubscriptionTier.FREE) {
            throw new Error('Custom podcast requests require a paid subscription');
        }
        return this.prisma.podcastRequest.create({
            data: {
                userId,
                prompt,
                isPrivate,
                status: 'PENDING'
            }
        });
    }
    async updatePodcastHistory(userId, podcastId, progress) {
        await this.prisma.podcastHistory.upsert({
            where: {
                userId_podcastId: {
                    userId,
                    podcastId
                }
            },
            update: {
                progress,
                listenedAt: new Date()
            },
            create: {
                userId,
                podcastId,
                progress,
                listenedAt: new Date()
            }
        });
    }
    async getRecommendations(userId) {
        const user = await this.getUserProfile(userId);
        const history = await this.prisma.podcastHistory.findMany({
            where: { userId },
            include: { podcast: true }
        });
        // Implement recommendation logic based on:
        // 1. User's preferred subjects
        // 2. Listening history
        // 3. Similar users' preferences
        // 4. Popular content in user's areas of interest
        return []; // TODO: Implement recommendation algorithm
    }
    async updatePreferences(userId, preferences) {
        return this.prisma.userPreferences.update({
            where: { userId },
            data: preferences
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map