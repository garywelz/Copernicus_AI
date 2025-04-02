import { IVoiceService } from './IVoiceService';
import { GoogleTTSService } from './GoogleTTSService';
import { OpenAITTSService } from './OpenAITTSService';

export type VoiceProvider = 'google' | 'openai';

export class VoiceServiceFactory {
    static createService(provider: VoiceProvider, projectId: string, apiKey?: string): IVoiceService {
        switch (provider.toLowerCase()) {
            case 'google':
                return new GoogleTTSService(projectId);
            case 'openai':
                if (!apiKey) {
                    throw new Error('OpenAI API key is required for OpenAI TTS service');
                }
                return new OpenAITTSService(apiKey, projectId);
            default:
                throw new Error(`Unsupported voice provider: ${provider}`);
        }
    }
} 