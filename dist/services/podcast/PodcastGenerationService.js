"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodcastGenerationService = void 0;
const OpenAITTSService_js_1 = require("../voice/OpenAITTSService.js");
const logger_js_1 = require("../../utils/logger.js");
class PodcastGenerationService {
    constructor(llmService, voices) {
        this.llmService = llmService;
        this.voices = voices;
        this.targetWordsPerMinute = 150; // Average speaking pace
        this.ttsService = new OpenAITTSService_js_1.OpenAITTSService(process.env.OPENAI_API_KEY);
    }
    async generatePodcastScript(content, options) {
        try {
            logger_js_1.logger.info('Generating podcast script with options:', options);
            const prompt = options.type === 'research'
                ? this.createResearchScriptPrompt(content, options)
                : this.createNewsScriptPrompt(content, options);
            const response = await this.llmService.generateStructuredOutput(prompt, this.getPodcastSchema());
            const scriptWithDurations = this.calculateSegmentDurations(response);
            logger_js_1.logger.info('Generated podcast script with duration:', scriptWithDurations.totalDuration);
            return scriptWithDurations;
        }
        catch (error) {
            logger_js_1.logger.error('Error generating podcast script:', error);
            throw new Error('Failed to generate podcast script');
        }
    }
    async generateAudio(script) {
        try {
            const audioSegments = [];
            // Generate intro
            const introAudio = await this.ttsService.generateSpeech(script.introduction, this.voices.host);
            audioSegments.push(introAudio);
            // Generate segments
            for (const segment of script.segments) {
                const voiceConfig = this.voices[segment.speaker.toLowerCase()];
                const audio = await this.ttsService.generateSpeech(segment.content, voiceConfig);
                audioSegments.push(audio);
                if (segment.pauseAfter) {
                    audioSegments.push(await this.ttsService.generatePause(1.5));
                }
            }
            // Generate conclusion
            const outroAudio = await this.ttsService.generateSpeech(script.conclusion, this.voices.host);
            audioSegments.push(outroAudio);
            return await this.ttsService.combineAudioSegments(audioSegments);
        }
        catch (error) {
            logger_js_1.logger.error('Error generating audio:', error);
            throw new Error('Failed to generate audio');
        }
    }
    createResearchScriptPrompt(analysis, options) {
        return `Create a research discussion podcast script about a scientific paper.
The podcast should be approximately ${options.targetDuration} minutes long
and aimed at a ${options.complexity} audience.

Use these roles:
${Object.entries(this.voices).map(([role, config]) => `- ${role}: ${config.role}`).join('\n')}

Paper Analysis:
${JSON.stringify(analysis, null, 2)}

Format the script with clear speaker labels and include natural interaction points.
Add pause points after significant revelations or complex explanations.
Include citations when referencing specific findings.`;
    }
    createNewsScriptPrompt(newsItems, options) {
        return `Create a news program script about recent developments in ${options.subject}.
The program should be approximately ${options.targetDuration} minutes long
and aimed at a ${options.complexity} audience.

Use these roles:
${Object.entries(this.voices).map(([role, config]) => `- ${role}: ${config.role}`).join('\n')}

News Items:
${newsItems.map(item => `- ${item}`).join('\n')}

Format the script as a news program with:
- An engaging introduction
- Clear transitions between stories
- Expert commentary and analysis
- A concise conclusion
Include citations and links to sources.`;
    }
    getPodcastSchema() {
        return {
            type: 'object',
            properties: {
                title: { type: 'string' },
                introduction: { type: 'string' },
                segments: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            content: { type: 'string' },
                            speaker: { type: 'string' },
                            pauseAfter: { type: 'boolean', optional: true }
                        }
                    }
                },
                conclusion: { type: 'string' },
                references: {
                    type: 'array',
                    items: { type: 'string' }
                },
                hashtags: {
                    type: 'array',
                    items: { type: 'string' }
                }
            }
        };
    }
    calculateSegmentDurations(script) {
        const calculateDuration = (text) => {
            const words = text.split(/\s+/).length;
            return Math.ceil((words / this.targetWordsPerMinute) * 60);
        };
        const segments = script.segments.map(segment => ({
            ...segment,
            duration: calculateDuration(segment.content)
        }));
        const totalDuration = segments.reduce((total, segment) => total + segment.duration, calculateDuration(script.introduction) + calculateDuration(script.conclusion));
        return {
            ...script,
            segments,
            totalDuration
        };
    }
}
exports.PodcastGenerationService = PodcastGenerationService;
//# sourceMappingURL=PodcastGenerationService.js.map