import { OpenRouterService } from '../../services/llm/OpenRouterService';
import 'dotenv/config';

describe('OpenRouterService', () => {
    let service: OpenRouterService;

    beforeEach(() => {
        if (!process.env.OPENROUTER_API_KEY) {
            throw new Error('OPENROUTER_API_KEY is required for tests');
        }
        service = new OpenRouterService(process.env.OPENROUTER_API_KEY);
    });

    it('should initialize with API key', () => {
        expect(service).toBeDefined();
    });

    it('should throw error when API key is missing', () => {
        expect(() => new OpenRouterService('')).toThrow('OpenRouter API key is required');
    });
});