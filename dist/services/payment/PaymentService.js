"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const client_1 = require("@prisma/client");
const UserService_1 = require("../user/UserService");
class PaymentService {
    constructor() {
        const stripeKey = process.env.STRIPE_SECRET_KEY;
        if (!stripeKey)
            throw new Error('Stripe secret key not found');
        this.stripe = new stripe_1.default(stripeKey, {
            apiVersion: '2023-10-16'
        });
        this.prisma = new client_1.PrismaClient();
        // Define subscription plans
        this.subscriptionPlans = {
            [UserService_1.SubscriptionTier.FREE]: {
                tier: UserService_1.SubscriptionTier.FREE,
                priceId: 'free',
                features: [
                    'Access to public podcasts',
                    'Basic recommendation system',
                    'Limited podcast history'
                ]
            },
            [UserService_1.SubscriptionTier.BASIC]: {
                tier: UserService_1.SubscriptionTier.BASIC,
                priceId: process.env.STRIPE_BASIC_PRICE_ID || '',
                features: [
                    'All FREE features',
                    'Custom podcast requests (5/month)',
                    'Advanced recommendations',
                    'Ad-free experience',
                    'Full podcast history'
                ]
            },
            [UserService_1.SubscriptionTier.PREMIUM]: {
                tier: UserService_1.SubscriptionTier.PREMIUM,
                priceId: process.env.STRIPE_PREMIUM_PRICE_ID || '',
                features: [
                    'All BASIC features',
                    'Unlimited custom podcast requests',
                    'Priority processing',
                    'Private podcasts',
                    'API access',
                    'Early access to new features'
                ]
            }
        };
    }
    async createCustomer(userId, email) {
        const customer = await this.stripe.customers.create({
            email,
            metadata: {
                userId
            }
        });
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                stripeCustomerId: customer.id
            }
        });
        return customer.id;
    }
    async createSubscription(userId, tier) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user)
            throw new Error('User not found');
        if (!user.stripeCustomerId)
            throw new Error('Stripe customer not found');
        const plan = this.subscriptionPlans[tier];
        if (!plan.priceId)
            throw new Error('Invalid subscription tier');
        const subscription = await this.stripe.subscriptions.create({
            customer: user.stripeCustomerId,
            items: [{ price: plan.priceId }],
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent']
        });
        await this.prisma.subscription.update({
            where: { userId },
            data: {
                stripeSubscriptionId: subscription.id,
                tier,
                status: 'PENDING'
            }
        });
        return subscription.id;
    }
    async handleWebhook(event) {
        switch (event.type) {
            case 'customer.subscription.created':
            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                const user = await this.prisma.user.findFirst({
                    where: { stripeCustomerId: subscription.customer }
                });
                if (user) {
                    await this.prisma.subscription.update({
                        where: { userId: user.id },
                        data: {
                            status: subscription.status === 'active' ? 'ACTIVE' : 'EXPIRED',
                            validUntil: new Date(subscription.current_period_end * 1000)
                        }
                    });
                }
                break;
            }
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                const user = await this.prisma.user.findFirst({
                    where: { stripeCustomerId: subscription.customer }
                });
                if (user) {
                    await this.prisma.subscription.update({
                        where: { userId: user.id },
                        data: {
                            status: 'CANCELLED',
                            tier: UserService_1.SubscriptionTier.FREE
                        }
                    });
                }
                break;
            }
        }
    }
    async cancelSubscription(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { subscription: true }
        });
        if (!user?.subscription?.stripeSubscriptionId) {
            throw new Error('No active subscription found');
        }
        await this.stripe.subscriptions.cancel(user.subscription.stripeSubscriptionId);
        await this.prisma.subscription.update({
            where: { userId },
            data: {
                status: 'CANCELLED',
                tier: UserService_1.SubscriptionTier.FREE
            }
        });
    }
    getSubscriptionPlans() {
        return this.subscriptionPlans;
    }
    async createPortalSession(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user?.stripeCustomerId) {
            throw new Error('Stripe customer not found');
        }
        const session = await this.stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`
        });
        return session.url;
    }
}
exports.PaymentService = PaymentService;
//# sourceMappingURL=PaymentService.js.map