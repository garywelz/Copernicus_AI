"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
class AuthService {
    constructor() {
        this.apiKeys = new Map();
        this.loadApiKeys();
    }
    static getInstance() {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }
    loadApiKeys() {
        this.apiKeys.set('core', process.env.CORE_API_KEY || '');
        this.apiKeys.set('nasa_ads', process.env.NASA_ADS_TOKEN || '');
        this.apiKeys.set('plos', process.env.PLOS_API_KEY || '');
        this.apiKeys.set('zenodo', process.env.ZENODO_API_KEY || '');
        this.apiKeys.set('figshare', process.env.FIGSHARE_API_KEY || '');
    }
    getAuthHeaders(source) {
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
                    'api-key': apiKey
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
    async validateApiKey(source) {
        if (!source.requiresAuth)
            return true;
        const apiKey = this.apiKeys.get(source.id);
        if (!apiKey)
            return false;
        try {
            const headers = this.getAuthHeaders(source);
            const response = await fetch(`${source.baseUrl}/test-auth`, {
                headers
            });
            return response.ok;
        }
        catch (error) {
            console.error(`Error validating API key for ${source.name}:`, error);
            return false;
        }
    }
    hasApiKey(sourceId) {
        return this.apiKeys.has(sourceId) && Boolean(this.apiKeys.get(sourceId));
    }
    getMissingApiKeys() {
        return Array.from(this.apiKeys.entries())
            .filter(([_, value]) => !value)
            .map(([key, _]) => key);
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map