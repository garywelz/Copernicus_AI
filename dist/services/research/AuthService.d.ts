import { SourceConfig } from '../../models/types';
export declare class AuthService {
    private static instance;
    private apiKeys;
    private constructor();
    static getInstance(): AuthService;
    private loadApiKeys;
    getAuthHeaders(source: SourceConfig): Record<string, string>;
    validateApiKey(source: SourceConfig): Promise<boolean>;
    hasApiKey(sourceId: string): boolean;
    getMissingApiKeys(): string[];
}
