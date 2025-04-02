import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { SubscriptionTier } from '../user/UserService';

interface SubscriptionPlan {
  tier: SubscriptionTier;
  priceId: string;
  features: string[];
}

export class PaymentService {
  private stripe: Stripe;
  private prisma: PrismaClient;
  private subscriptionPlans: Record<SubscriptionTier, SubscriptionPlan>;
  
  constructor() {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) throw new Error('Stripe secret key not found');
    
    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16'
    });
    
    this.prisma = new PrismaClient();
    
    // Define subscription plans
    this.subscriptionPlans = {
      [SubscriptionTier.FREE]: {
        tier: SubscriptionTier.FREE,
        priceId: 'free',
        features: [
          'Access to public podcasts',
          'Basic recommendation system',
          'Limited podcast history'
        ]
      },
      [SubscriptionTier.BASIC]: {
        tier: SubscriptionTier.BASIC,
        priceId: process.env.STRIPE_BASIC_PRICE_ID || '',
        features: [
          'All FREE features',
          'Custom podcast requests (5/month)',
          'Advanced recommendations',
          'Ad-free experience',
          'Full podcast history'
        ]
      },
      [SubscriptionTier.PREMIUM]: {
        tier: SubscriptionTier.PREMIUM,
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

  async createCustomer(userId: string, email: string): Promise<string> {
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

  async createSubscription(userId: string, tier: SubscriptionTier): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) throw new Error('User not found');
    if (!user.stripeCustomerId) throw new Error('Stripe customer not found');
    
    const plan = this.subscriptionPlans[tier];
    if (!plan.priceId) throw new Error('Invalid subscription tier');
    
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

  async handleWebhook(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await this.prisma.user.findFirst({
          where: { stripeCustomerId: subscription.customer as string }
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
        const subscription = event.data.object as Stripe.Subscription;
        const user = await this.prisma.user.findFirst({
          where: { stripeCustomerId: subscription.customer as string }
        });
        
        if (user) {
          await this.prisma.subscription.update({
            where: { userId: user.id },
            data: {
              status: 'CANCELLED',
              tier: SubscriptionTier.FREE
            }
          });
        }
        break;
      }
    }
  }

  async cancelSubscription(userId: string): Promise<void> {
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
        tier: SubscriptionTier.FREE
      }
    });
  }

  getSubscriptionPlans(): Record<SubscriptionTier, SubscriptionPlan> {
    return this.subscriptionPlans;
  }

  async createPortalSession(userId: string): Promise<string> {
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