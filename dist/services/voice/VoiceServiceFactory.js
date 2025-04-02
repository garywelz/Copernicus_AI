"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceServiceFactory = void 0;
const GoogleTTSService_1 = require("./GoogleTTSService");
const OpenAITTSService_1 = require("./OpenAITTSService");
class VoiceServiceFactory {
    static createService(provider, projectId, apiKey) {
        switch (provider.toLowerCase()) {
            case 'google':
                return new GoogleTTSService_1.GoogleTTSService(projectId);
            case 'openai':
                if (!apiKey) {
                    throw new Error('OpenAI API key is required for OpenAI TTS service');
                }
                return new OpenAITTSService_1.OpenAITTSService(apiKey, projectId);
            default:
                throw new Error(`Unsupported voice provider: ${provider}`);
        }
    }
}
exports.VoiceServiceFactory = VoiceServiceFactory;
//# sourceMappingURL=VoiceServiceFactory.js.map