"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockVoiceService = void 0;
class MockVoiceService {
    constructor() {
        this.mockResults = new Map();
        this.mockSegments = [];
        // Initialize with some mock data
        this.mockResults.set('test', {
            duration: 1.5,
            url: 'https://example.com/test.mp3',
            metadata: { format: 'mp3' }
        });
    }
    async generateAudio(text, speaker) {
        const result = this.mockResults.get(text) || {
            duration: 1.0,
            url: `https://example.com/${text}.mp3`,
            metadata: { format: 'mp3', speaker }
        };
        return result;
    }
    async combineAudioSegments(segments, outputPath, pauseDuration = 0.5) {
        this.mockSegments = segments;
        const totalDuration = segments.reduce((acc, seg) => acc + seg.duration, 0) +
            (segments.length - 1) * pauseDuration;
        return {
            duration: totalDuration,
            url: outputPath || 'https://example.com/combined.mp3',
            metadata: {
                segmentCount: segments.length,
                pauseDuration
            }
        };
    }
    // Helper methods for testing
    setMockResult(text, result) {
        this.mockResults.set(text, result);
    }
    getMockSegments() {
        return this.mockSegments;
    }
}
exports.MockVoiceService = MockVoiceService;
//# sourceMappingURL=MockVoiceService.js.map