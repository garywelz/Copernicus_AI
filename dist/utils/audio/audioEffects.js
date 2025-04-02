"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioEnhancer = void 0;
class AudioEnhancer {
    constructor(options = {}) {
        this.options = options;
    }
    /**
     * Enhance audio quality for podcast
     */
    async enhance(audioBuffer) {
        try {
            let enhanced = audioBuffer;
            if (this.options.normalize) {
                enhanced = this.normalizeAudio(enhanced);
            }
            if (this.options.compression) {
                enhanced = this.applyCompression(enhanced, this.options.compression.threshold, this.options.compression.ratio);
            }
            if (this.options.equalization) {
                enhanced = this.applyEQ(enhanced, this.options.equalization);
            }
            return enhanced;
        }
        catch (error) {
            console.error('Error enhancing audio:', error);
            return audioBuffer;
        }
    }
    normalizeAudio(audio) {
        const result = Buffer.from(audio);
        let maxAmplitude = 0;
        // Find maximum amplitude
        for (let i = 0; i < result.length; i += 2) {
            const amplitude = Math.abs(result.readInt16LE(i));
            maxAmplitude = Math.max(maxAmplitude, amplitude);
        }
        // Calculate normalization factor
        const factor = maxAmplitude > 0 ? 32767 / maxAmplitude : 1;
        // Apply normalization
        for (let i = 0; i < result.length; i += 2) {
            const sample = result.readInt16LE(i);
            const normalized = Math.floor(sample * factor);
            result.writeInt16LE(normalized, i);
        }
        return result;
    }
    applyCompression(audio, threshold, ratio) {
        const result = Buffer.from(audio);
        for (let i = 0; i < result.length; i += 2) {
            const sample = result.readInt16LE(i);
            const amplitude = Math.abs(sample);
            if (amplitude > threshold) {
                const excess = amplitude - threshold;
                const reduction = excess * (1 - 1 / ratio);
                const compressed = Math.sign(sample) * (amplitude - reduction);
                result.writeInt16LE(Math.floor(compressed), i);
            }
        }
        return result;
    }
    applyEQ(audio, eq) {
        // Simple 3-band EQ implementation
        // In practice, you'd use a proper DSP library
        const result = Buffer.from(audio);
        for (let i = 0; i < result.length; i += 2) {
            const sample = result.readInt16LE(i);
            // Apply EQ gains (simplified)
            const adjusted = sample * ((eq.bass + eq.mid + eq.treble) / 3);
            result.writeInt16LE(Math.floor(adjusted), i);
        }
        return result;
    }
}
exports.AudioEnhancer = AudioEnhancer;
//# sourceMappingURL=audioEffects.js.map