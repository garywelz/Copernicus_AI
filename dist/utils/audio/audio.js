"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioProcessor = void 0;
exports.combineAudioBuffers = combineAudioBuffers;
exports.createSilence = createSilence;
exports.normalizeAudio = normalizeAudio;
const logger_1 = require("./logger");
const child_process_1 = require("child_process");
const util_1 = require("util");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const buffer_1 = require("buffer");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class AudioProcessor {
    constructor(options = {}) {
        this.sampleRate = options.sampleRate || 44100;
        this.bitDepth = options.bitDepth || 16;
        this.channels = options.channels || 2; // Default to stereo
        /**
         * 16-bit PCM audio = 2 bytes per sample per channel
         * Total frame size = bytesPerSample * channels
         */
        this.bytesPerSample = 2; // Always use 16-bit samples
    }
    /**
     * Add a pause between segments
     */
    addPause(duration) {
        const numSamples = Math.floor(duration * this.sampleRate);
        const bytesPerFrame = this.channels * 2; // Always use 16-bit samples
        return buffer_1.Buffer.alloc(numSamples * bytesPerFrame);
    }
    /**
     * Add fade in/out effects to audio
     */
    applyFade(audio, fadeInDuration = 0, fadeOutDuration = 0) {
        try {
            const bytesPerFrame = this.channels * 2; // Always use 16-bit samples
            const numFrames = audio.length / bytesPerFrame;
            const fadeInFrames = Math.floor(fadeInDuration * this.sampleRate);
            const fadeOutFrames = Math.floor(fadeOutDuration * this.sampleRate);
            const result = buffer_1.Buffer.from(audio);
            // Apply fade in
            for (let i = 0; i < fadeInFrames; i++) {
                const gain = i / fadeInFrames;
                const offset = i * bytesPerFrame;
                this.applyGainToFrame(result, offset, gain);
            }
            // Apply fade out
            for (let i = 0; i < fadeOutFrames; i++) {
                const gain = 1 - (i / fadeOutFrames);
                const offset = (numFrames - fadeOutFrames + i) * bytesPerFrame;
                this.applyGainToFrame(result, offset, gain);
            }
            return result;
        }
        catch (error) {
            logger_1.logger.error('Error applying fade:', error);
            return audio; // Return original on error
        }
    }
    /**
     * Mix background music with speech
     */
    mixWithBackground(speech, background, backgroundVolume = 0.1) {
        try {
            const bytesPerFrame = this.channels * 2; // Always use 16-bit samples
            const result = buffer_1.Buffer.from(speech);
            const numFrames = Math.min(speech.length / bytesPerFrame, background.length / bytesPerFrame);
            for (let i = 0; i < numFrames; i++) {
                const speechOffset = i * bytesPerFrame;
                const backgroundOffset = i * bytesPerFrame;
                this.mixFrames(result, background, speechOffset, backgroundOffset, backgroundVolume);
            }
            return result;
        }
        catch (error) {
            logger_1.logger.error('Error mixing audio:', error);
            return speech; // Return original on error
        }
    }
    applyGainToFrame(buffer, offset, gain) {
        const bytesPerFrame = this.channels * (this.bitDepth / 8);
        if (offset + bytesPerFrame > buffer.length) {
            return; // Skip if frame would be out of bounds
        }
        for (let channel = 0; channel < this.channels; channel++) {
            const sampleOffset = offset + (channel * (this.bitDepth / 8));
            const sample = buffer.readInt16LE(sampleOffset);
            // Clamp values between -32768 and 32767 (16-bit signed)
            const adjusted = Math.max(-32768, Math.min(32767, Math.floor(sample * gain)));
            buffer.writeInt16LE(adjusted, sampleOffset);
        }
    }
    mixFrames(target, source, targetOffset, sourceOffset, sourceGain) {
        const bytesPerFrame = this.channels * (this.bitDepth / 8);
        if (targetOffset + bytesPerFrame > target.length ||
            sourceOffset + bytesPerFrame > source.length) {
            return; // Skip if either frame would be out of bounds
        }
        for (let channel = 0; channel < this.channels; channel++) {
            const sampleSize = this.bitDepth / 8;
            const targetSampleOffset = targetOffset + (channel * sampleSize);
            const sourceSampleOffset = sourceOffset + (channel * sampleSize);
            const targetSample = target.readInt16LE(targetSampleOffset);
            const sourceSample = source.readInt16LE(sourceSampleOffset);
            const mixed = targetSample + (sourceSample * sourceGain);
            // Clamp values between -32768 and 32767 (16-bit signed)
            const clamped = Math.max(-32768, Math.min(32767, Math.floor(mixed)));
            target.writeInt16LE(Math.floor(clamped), targetSampleOffset);
        }
    }
    async concatenateAudio(audioBuffers) {
        logger_1.logger.debug('Concatenating audio files...');
        // Create a temporary directory
        const tempDir = await promises_1.default.mkdtemp(path_1.default.join(os_1.default.tmpdir(), 'podcast-'));
        try {
            // Write each buffer to a temporary file
            const tempFiles = await Promise.all(audioBuffers.map(async (buffer, index) => {
                const filePath = path_1.default.join(tempDir, `segment-${index}.mp3`);
                await promises_1.default.writeFile(filePath, buffer);
                logger_1.logger.debug(`Written segment ${index} to ${filePath}`);
                return filePath;
            }));
            // Create a file list for ffmpeg
            const listPath = path_1.default.join(tempDir, 'files.txt');
            const fileList = tempFiles.map(file => `file '${file}'`).join('\n');
            await promises_1.default.writeFile(listPath, fileList);
            logger_1.logger.debug(`Created file list at ${listPath}`);
            // Output path for combined audio
            const outputPath = path_1.default.join(tempDir, 'combined.mp3');
            // Use ffmpeg to concatenate files
            const ffmpegCmd = `ffmpeg -f concat -safe 0 -i "${listPath}" -c copy "${outputPath}"`;
            logger_1.logger.debug(`Running ffmpeg command: ${ffmpegCmd}`);
            await execAsync(ffmpegCmd);
            // Read the combined file
            const combinedAudio = await promises_1.default.readFile(outputPath);
            logger_1.logger.debug(`Combined audio size: ${combinedAudio.length} bytes`);
            return combinedAudio;
        }
        finally {
            // Cleanup temporary directory
            try {
                await promises_1.default.rm(tempDir, { recursive: true, force: true });
                logger_1.logger.debug(`Cleaned up temp directory: ${tempDir}`);
            }
            catch (error) {
                logger_1.logger.warn('Failed to cleanup temp directory:', error);
            }
        }
    }
    async loadBackgroundTrack(trackPath) {
        try {
            // Load and normalize background track
            const bgMusic = await promises_1.default.readFile(trackPath);
            return this.normalizeAudio(bgMusic);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to load background track: ${error.message}`);
            }
            throw new Error('Failed to load background track: Unknown error');
        }
    }
    async loopBackgroundTrack(track, duration) {
        // Use ffmpeg to loop the track to match conversation duration
        const tempDir = await promises_1.default.mkdtemp(path_1.default.join(os_1.default.tmpdir(), 'podcast-bg-'));
        try {
            const inputPath = path_1.default.join(tempDir, 'input.mp3');
            const outputPath = path_1.default.join(tempDir, 'output.mp3');
            await promises_1.default.writeFile(inputPath, track);
            await execAsync(`ffmpeg -stream_loop -1 -i "${inputPath}" -t ${duration} -c copy "${outputPath}"`);
            return await promises_1.default.readFile(outputPath);
        }
        finally {
            await promises_1.default.rm(tempDir, { recursive: true, force: true });
        }
    }
    /**
     * Normalize audio to a consistent volume level
     * @param audio Input audio buffer
     * @returns Normalized audio buffer
     */
    normalizeAudio(audio) {
        try {
            const result = buffer_1.Buffer.from(audio);
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
        catch (error) {
            logger_1.logger.error('Error normalizing audio:', error);
            return audio;
        }
    }
    async processAudio(audioBuffer) {
        // For now, just return the original buffer
        // In a real implementation, this would apply audio processing
        return audioBuffer;
    }
}
exports.AudioProcessor = AudioProcessor;
/**
 * Combines multiple audio buffers into a single buffer
 */
function combineAudioBuffers(buffers) {
    return buffer_1.Buffer.concat(buffers);
}
/**
 * Creates a silence buffer of specified duration
 * @param durationMs Duration in milliseconds
 * @param sampleRate Sample rate (default 44100)
 */
function createSilence(durationMs, sampleRate = 44100) {
    const samples = Math.floor(durationMs * sampleRate / 1000);
    return buffer_1.Buffer.alloc(samples * 2); // 16-bit samples = 2 bytes per sample
}
/**
 * Normalizes audio levels across multiple segments
 */
function normalizeAudio(buffer) {
    // Basic implementation - could be enhanced with actual audio normalization
    return buffer;
}
//# sourceMappingURL=audio.js.map