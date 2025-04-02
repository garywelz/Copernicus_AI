import { SourceConfig } from '../../models/types';

export class AuthService {
  private static instance: AuthService;
  private apiKeys: Map<string, string>;

  private constructor() {
    this.apiKeys = new Map();
    this.loadApiKeys();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private loadApiKeys(): void {
    this.apiKeys.set('core', process.env.CORE_API_KEY || '');
    this.apiKeys.set('nasa_ads', process.env.NASA_ADS_TOKEN || '');
    this.apiKeys.set('plos', process.env.PLOS_API_KEY || '');
    this.apiKeys.set('zenodo', process.env.ZENODO_API_KEY || '');
    this.apiKeys.set('figshare', process.env.FIGSHARE_API_KEY || '');
  }

  public getAuthHeaders(source: SourceConfig): Record<string, string> {
    const apiKey = this.apiKeys.get(source.id);
    
    if (!apiKey && source.requiresAuth) {
      throw new Error(`API key not found for ${source.name}`);
    }

    switch (source.id) {
      case 'core':
        return {
          'Authorization': `Bearer ${apiKey}`
        };
      case 'nasa_ads':
        return {
          'Authorization': `Bearer:${apiKey}`
        };
      case 'plos':
        return {
          'api-key': apiKey!
        };
      case 'zenodo':
        return {
          'Authorization': `Bearer ${apiKey}`
        };
      case 'figshare':
        return {
          'Authorization': `token ${apiKey}`
        };
      default:
        return {};
    }
  }

  public async validateApiKey(source: SourceConfig): Promise<boolean> {
    if (!source.requiresAuth) return true;

    const apiKey = this.apiKeys.get(source.id);
    if (!apiKey) return false;

    try {
      const headers = this.getAuthHeaders(source);
      const response = await fetch(`${source.baseUrl}/test-auth`, {
        headers
      });
      return response.ok;
    } catch (error) {
      console.error(`Error validating API key for ${source.name}:`, error);
      return false;
    }
  }

  public hasApiKey(sourceId: string): boolean {
    return this.apiKeys.has(sourceId) && Boolean(this.apiKeys.get(sourceId));
  }

  public getMissingApiKeys(): string[] {
    return Array.from(this.apiKeys.entries())
      .filter(([_, value]) => !value)
      .map(([key, _]) => key);
  }
} 