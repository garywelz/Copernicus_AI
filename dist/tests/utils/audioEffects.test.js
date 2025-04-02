"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const audioEffects_1 = require("../../utils/audioEffects");
globals_1.jest.mock('../../utils/logger');
(0, globals_1.describe)('AudioEnhancer', () => {
    const mockOptions = {
        sampleRate: 44100,
        channels: 2
    };
    const createTestBuffer = (length) => {
        const buffer = Buffer.alloc(length * 4); // 2 bytes per sample * 2 channels
        for (let i = 0; i < buffer.length; i += 2) {
            buffer.writeInt16LE(0x1000, i); // Write reasonable sample values
        }
        return buffer;
    };
    (0, globals_1.test)('enhances audio with all effects', () => {
        const enhancer = new audioEffects_1.AudioEnhancer(mockOptions);
        const testBuffer = createTestBuffer(4410); // 100ms of audio
        const enhancementOptions = {
            normalize: true,
            compression: {
                threshold: -20,
                ratio: 4
            },
            equalization: {
                bass: 1.2,
                mid: 1.0,
                treble: 0.8
            }
        };
        const result = enhancer.enhanceAudio(testBuffer, enhancementOptions);
        (0, globals_1.expect)(result).toBeDefined();
        (0, globals_1.expect)(result.length).toBe(testBuffer.length);
    });
    (0, globals_1.test)('handles normalization only', () => {
        const enhancer = new audioEffects_1.AudioEnhancer(mockOptions);
        const testBuffer = createTestBuffer(4410);
        const result = enhancer.normalizeAudio(testBuffer);
        (0, globals_1.expect)(result.length).toBe(testBuffer.length);
        // Check that values are normalized but not clipped
        for (let i = 0; i < result.length; i += 2) {
            const sample = Math.abs(result.readInt16LE(i));
            (0, globals_1.expect)(sample).toBeLessThanOrEqual(32767);
        }
    });
    (0, globals_1.test)('handles compression', () => {
        const enhancer = new audioEffects_1.AudioEnhancer(mockOptions);
        const testBuffer = createTestBuffer(4410);
        const result = enhancer.enhanceAudio(testBuffer, {
            compression: {
                threshold: -20,
                ratio: 4
            }
        });
        (0, globals_1.expect)(result.length).toBe(testBuffer.length);
    });
    (0, globals_1.test)('handles errors gracefully', () => {
        const enhancer = new audioEffects_1.AudioEnhancer(mockOptions);
        const invalidBuffer = Buffer.from([]);
        const result = enhancer.enhanceAudio(invalidBuffer);
        (0, globals_1.expect)(result).toBe(invalidBuffer); // Returns original on error
    });
});
//# sourceMappingURL=audioEffects.test.js.map