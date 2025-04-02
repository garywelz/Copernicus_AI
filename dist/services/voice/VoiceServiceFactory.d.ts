import { IVoiceService } from './IVoiceService';
export type VoiceProvider = 'google' | 'openai';
export declare class VoiceServiceFactory {
    static createService(provider: VoiceProvider, projectId: string, apiKey?: string): IVoiceService;
}
