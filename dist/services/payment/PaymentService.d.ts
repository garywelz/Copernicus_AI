import Stripe from 'stripe';
import { SubscriptionTier } from '../user/UserService';
interface SubscriptionPlan {
    tier: SubscriptionTier;
    priceId: string;
    features: string[];
}
export declare class PaymentService {
    private stripe;
    private prisma;
    private subscriptionPlans;
    constructor();
    createCustomer(userId: string, email: string): Promise<string>;
    createSubscription(userId: string, tier: SubscriptionTier): Promise<string>;
    handleWebhook(event: Stripe.Event): Promise<void>;
    cancelSubscription(userId: string): Promise<void>;
    getSubscriptionPlans(): Record<SubscriptionTier, SubscriptionPlan>;
    createPortalSession(userId: string): Promise<string>;
}
export {};
