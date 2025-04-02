"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodcastGenerator = void 0;
const logger_1 = require("../../utils/logger");
const DescriptService_1 = require("../descript/DescriptService");
class PodcastGenerator {
    constructor(ttsService, descriptConfig) {
        this.ttsService = ttsService;
        if (descriptConfig) {
            this.descriptService = new DescriptService_1.DescriptService(descriptConfig);
        }
    }
    async generatePodcast(template) {
        try {
            // Generate speech segments sequentially with pauses
            const segments = [];
            let previousEndTime = 0;
            for (const segment of template.segments) {
                try {
                    console.log('Generating segment:', segment.text.substring(0, 50) + '...');
                    const voiceConfig = template.voices[segment.speaker];
                    if (!voiceConfig) {
                        throw new Error(`No voice config found for speaker: ${segment.speaker}`);
                    }
                    const audioSegment = await this.ttsService.synthesize(segment.text, {
                        model: voiceConfig.id,
                        settings: voiceConfig.settings,
                        speed: 1.0
                    });
                    // Add small gap between segments
                    if (segments.length > 0) {
                        const gap = Buffer.alloc(22050); // 0.5 seconds of silence at 44.1kHz
                        audioSegment.audioData = Buffer.concat([gap, audioSegment.audioData]);
                        audioSegment.duration += 0.5;
                    }
                    segments.push(audioSegment);
                }
                catch (segmentError) {
                    console.error('Failed to generate segment:', segmentError);
                    throw segmentError;
                }
            }
            // Combine all segments
            console.log('Combining', segments.length, 'segments');
            const finalAudio = await this.ttsService.combineAudio(segments);
            console.log('Final audio size:', finalAudio.length);
            if (this.descriptService) {
                // Upload to Descript for additional processing
                const audioId = await this.descriptService.uploadPodcastAudio('path/to/output.mp3', { name: template.title });
                // Create as podcast episode
                const episode = await this.descriptService.createPodcastEpisode(audioId, { name: template.title });
                logger_1.logger.info('Audio uploaded to Descript for processing:', episode.id);
            }
            return finalAudio;
        }
        catch (error) {
            console.error('Detailed error in podcast generation:', error);
            if (error instanceof Error) {
                throw new Error('Failed to generate podcast audio: ' + error.message);
            }
            else {
                throw new Error('Failed to generate podcast audio: Unknown error');
            }
        }
    }
}
exports.PodcastGenerator = PodcastGenerator;
//# sourceMappingURL=PodcastGenerator.js.map