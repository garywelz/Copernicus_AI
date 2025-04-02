"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const BackgroundMusicSelector_1 = require("../../../services/music/BackgroundMusicSelector");
globals_1.jest.mock('../../../utils/logger');
(0, globals_1.describe)('BackgroundMusicSelector', () => {
    let selector;
    const mockLibrary = [
        {
            id: 'track1',
            path: '/music/track1.mp3',
            mood: ['inspiring', 'uplifting'],
            tempo: 'medium',
            intensity: 'high'
        },
        {
            id: 'track2',
            path: '/music/track2.mp3',
            mood: ['calm', 'focused'],
            tempo: 'slow',
            intensity: 'low'
        }
    ];
    (0, globals_1.beforeEach)(() => {
        selector = new BackgroundMusicSelector_1.BackgroundMusicSelector(mockLibrary);
    });
    (0, globals_1.test)('selects track based on content and mood', () => {
        const result = selector.selectTrackForContent('A calm and focused study shows interesting results.', ['calm', 'focused'], 'slow');
        (0, globals_1.expect)(result.id).toBe('track2');
        (0, globals_1.expect)(result.mood).toContain('calm');
        (0, globals_1.expect)(result.tempo).toBe('slow');
    });
    (0, globals_1.test)('falls back to default track when no match found', () => {
        const emptySelector = new BackgroundMusicSelector_1.BackgroundMusicSelector([]);
        const result = emptySelector.selectTrackForContent('content', ['nonexistent'], 'medium');
        (0, globals_1.expect)(result).toEqual({
            id: 'default',
            path: '/music/default-background.mp3',
            mood: ['neutral'],
            tempo: 'medium',
            intensity: 'low'
        });
    });
    (0, globals_1.test)('handles content intensity analysis', () => {
        const result = selector.selectTrackForContent('This is a revolutionary breakthrough! Dramatic results! Significant findings!', ['inspiring'], 'medium');
        (0, globals_1.expect)(result.intensity).toBe('high');
    });
});
//# sourceMappingURL=BackgroundMusicSelector.test.js.map