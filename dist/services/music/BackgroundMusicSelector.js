"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundMusicSelector = void 0;
const logger_1 = require("../../utils/logger");
class BackgroundMusicSelector {
    constructor(musicLibrary) {
        this.musicLibrary = musicLibrary;
    }
    selectTrackForContent(content, mood, preferredTempo) {
        try {
            // Score each track based on content and preferences
            const scoredTracks = this.musicLibrary.map(track => ({
                track,
                score: this.calculateTrackScore(track, content, mood, preferredTempo)
            }));
            // Sort by score and return best match
            scoredTracks.sort((a, b) => b.score - a.score);
            return scoredTracks[0].track;
        }
        catch (error) {
            logger_1.logger.error('Error selecting background music:', error);
            return this.getDefaultTrack();
        }
    }
    calculateTrackScore(track, content, mood, preferredTempo) {
        let score = 0;
        // Match mood
        score += mood.filter(m => track.mood.includes(m)).length * 2;
        // Match tempo if specified
        if (preferredTempo && track.tempo === preferredTempo) {
            score += 1;
        }
        // Consider content intensity
        const contentIntensity = this.analyzeContentIntensity(content);
        if (track.intensity === contentIntensity) {
            score += 1;
        }
        return score;
    }
    analyzeContentIntensity(content) {
        // Simple analysis based on keywords and punctuation
        const exclamationCount = (content.match(/!/g) || []).length;
        const intensityWords = ['revolutionary', 'breakthrough', 'dramatic', 'significant'];
        const intensityWordCount = intensityWords.filter(word => content.toLowerCase().includes(word)).length;
        if (exclamationCount > 3 || intensityWordCount > 2)
            return 'high';
        if (exclamationCount > 1 || intensityWordCount > 0)
            return 'medium';
        return 'low';
    }
    getDefaultTrack() {
        return {
            id: 'default',
            path: '/music/default-background.mp3',
            mood: ['neutral'],
            tempo: 'medium',
            intensity: 'low'
        };
    }
}
exports.BackgroundMusicSelector = BackgroundMusicSelector;
//# sourceMappingURL=BackgroundMusicSelector.js.map