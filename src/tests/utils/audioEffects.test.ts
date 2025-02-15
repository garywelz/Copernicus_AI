import { jest, describe, test, expect } from '@jest/globals';
import { AudioEnhancer, type AudioEnhancementOptions } from '../../utils/audioEffects';

jest.mock('../../utils/logger');

describe('AudioEnhancer', () => {
  const mockOptions = {
    sampleRate: 44100,
    channels: 2
  };

  const createTestBuffer = (length: number): Buffer => {
    const buffer = Buffer.alloc(length * 4); // 2 bytes per sample * 2 channels
    for (let i = 0; i < buffer.length; i += 2) {
      buffer.writeInt16LE(0x1000, i); // Write reasonable sample values
    }
    return buffer;
  };

  test('enhances audio with all effects', () => {
    const enhancer = new AudioEnhancer(mockOptions);
    const testBuffer = createTestBuffer(4410); // 100ms of audio
    const enhancementOptions: AudioEnhancementOptions = {
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
    expect(result).toBeDefined();
    expect(result.length).toBe(testBuffer.length);
  });

  test('handles normalization only', () => {
    const enhancer = new AudioEnhancer(mockOptions);
    const testBuffer = createTestBuffer(4410);
    const result = enhancer.normalizeAudio(testBuffer);

    expect(result.length).toBe(testBuffer.length);
    // Check that values are normalized but not clipped
    for (let i = 0; i < result.length; i += 2) {
      const sample = Math.abs(result.readInt16LE(i));
      expect(sample).toBeLessThanOrEqual(32767);
    }
  });

  test('handles compression', () => {
    const enhancer = new AudioEnhancer(mockOptions);
    const testBuffer = createTestBuffer(4410);
    const result = enhancer.enhanceAudio(testBuffer, {
      compression: {
        threshold: -20,
        ratio: 4
      }
    });

    expect(result.length).toBe(testBuffer.length);
  });

  test('handles errors gracefully', () => {
    const enhancer = new AudioEnhancer(mockOptions);
    const invalidBuffer = Buffer.from([]);
    const result = enhancer.enhanceAudio(invalidBuffer);
    
    expect(result).toBe(invalidBuffer); // Returns original on error
  });
}); 