import { PrismaClient, User, Subscription, PodcastRequest } from '@prisma/client';
import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';

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

export enum SubscriptionTier {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM'
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
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

export class UserService {
  private prisma: PrismaClient;
  private readonly JWT_SECRET: string;
  
  constructor() {
    this.prisma = new PrismaClient();
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  }

  async createUser(email: string, password: string, name: string): Promise<User> {
    const hashedPassword = await hash(password, 10);
    
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

  async authenticate(email: string, password: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');

    const valid = await compare(password, user.password);
    if (!valid) throw new Error('Invalid password');

    return sign({ userId: user.id }, this.JWT_SECRET, { expiresIn: '7d' });
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        podcastHistory: true,
        preferences: true
      }
    });
    
    if (!user) throw new Error('User not found');
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      subscription: user.subscription,
      podcastHistory: user.podcastHistory,
      preferences: user.preferences
    };
  }

  async updateSubscription(userId: string, tier: SubscriptionTier): Promise<Subscription> {
    return this.prisma.subscription.update({
      where: { userId },
      data: {
        tier,
        status: SubscriptionStatus.ACTIVE,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    });
  }

  async createPodcastRequest(userId: string, prompt: string, isPrivate: boolean): Promise<PodcastRequest> {
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

  async updatePodcastHistory(userId: string, podcastId: string, progress: number): Promise<void> {
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

  async getRecommendations(userId: string): Promise<any[]> {
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

  async updatePreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    return this.prisma.userPreferences.update({
      where: { userId },
      data: preferences
    });
  }
} 