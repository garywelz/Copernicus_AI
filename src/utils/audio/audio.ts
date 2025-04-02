import { AudioSegment, AudioProcessingOptions as AudioOptions } from '../types/audio';
import { logger } from './logger';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { Buffer } from 'buffer';

const execAsync = promisify(exec);

export interface AudioProcessingOptions {
  sampleRate?: number;
  bitDepth?: number;
  channels?: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
  pauseDuration?: number;
  backgroundVolume?: number;
  volume?: number;
}

export class AudioProcessor {
  private sampleRate: number;
  private bitDepth: number;
  private channels: number;
  private bytesPerSample: number;

  constructor(options: AudioOptions = {}) {
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
  addPause(duration: number): Buffer {
    const numSamples = Math.floor(duration * this.sampleRate);
    const bytesPerFrame = this.channels * 2; // Always use 16-bit samples
    return Buffer.alloc(numSamples * bytesPerFrame);
  }

  /**
   * Add fade in/out effects to audio
   */
  applyFade(
    audio: Buffer,
    fadeInDuration: number = 0,
    fadeOutDuration: number = 0
  ): Buffer {
    try {
      const bytesPerFrame = this.channels * 2; // Always use 16-bit samples
      const numFrames = audio.length / bytesPerFrame;
      
      const fadeInFrames = Math.floor(fadeInDuration * this.sampleRate);
      const fadeOutFrames = Math.floor(fadeOutDuration * this.sampleRate);
      
      const result = Buffer.from(audio);

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
    } catch (error) {
      logger.error('Error applying fade:', error);
      return audio; // Return original on error
    }
  }

  /**
   * Mix background music with speech
   */
  mixWithBackground(
    speech: Buffer,
    background: Buffer,
    backgroundVolume: number = 0.1
  ): Buffer {
    try {
      const bytesPerFrame = this.channels * 2; // Always use 16-bit samples
      const result = Buffer.from(speech);
      const numFrames = Math.min(
        speech.length / bytesPerFrame,
        background.length / bytesPerFrame
      );

      for (let i = 0; i < numFrames; i++) {
        const speechOffset = i * bytesPerFrame;
        const backgroundOffset = i * bytesPerFrame;
        this.mixFrames(result, background, speechOffset, backgroundOffset, backgroundVolume);
      }

      return result;
    } catch (error) {
      logger.error('Error mixing audio:', error);
      return speech; // Return original on error
    }
  }

  private applyGainToFrame(buffer: Buffer, offset: number, gain: number) {
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

  private mixFrames(
    target: Buffer,
    source: Buffer,
    targetOffset: number,
    sourceOffset: number,
    sourceGain: number
  ) {
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

  async concatenateAudio(audioBuffers: Buffer[]): Promise<Buffer> {
    logger.debug('Concatenating audio files...');
    
    // Create a temporary directory
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'podcast-'));
    
    try {
      // Write each buffer to a temporary file
      const tempFiles = await Promise.all(audioBuffers.map(async (buffer, index) => {
        const filePath = path.join(tempDir, `segment-${index}.mp3`);
        await fs.writeFile(filePath, buffer);
        logger.debug(`Written segment ${index} to ${filePath}`);
        return filePath;
      }));

      // Create a file list for ffmpeg
      const listPath = path.join(tempDir, 'files.txt');
      const fileList = tempFiles.map(file => `file '${file}'`).join('\n');
      await fs.writeFile(listPath, fileList);
      logger.debug(`Created file list at ${listPath}`);

      // Output path for combined audio
      const outputPath = path.join(tempDir, 'combined.mp3');

      // Use ffmpeg to concatenate files
      const ffmpegCmd = `ffmpeg -f concat -safe 0 -i "${listPath}" -c copy "${outputPath}"`;
      logger.debug(`Running ffmpeg command: ${ffmpegCmd}`);
      await execAsync(ffmpegCmd);

      // Read the combined file
      const combinedAudio = await fs.readFile(outputPath);
      logger.debug(`Combined audio size: ${combinedAudio.length} bytes`);

      return combinedAudio;
    } finally {
      // Cleanup temporary directory
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
        logger.debug(`Cleaned up temp directory: ${tempDir}`);
      } catch (error) {
        logger.warn('Failed to cleanup temp directory:', error);
      }
    }
  }

  async loadBackgroundTrack(trackPath: string): Promise<Buffer> {
    try {
      // Load and normalize background track
      const bgMusic = await fs.readFile(trackPath);
      return this.normalizeAudio(bgMusic);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to load background track: ${error.message}`);
      }
      throw new Error('Failed to load background track: Unknown error');
    }
  }

  async loopBackgroundTrack(track: Buffer, duration: number): Promise<Buffer> {
    // Use ffmpeg to loop the track to match conversation duration
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'podcast-bg-'));
    try {
      const inputPath = path.join(tempDir, 'input.mp3');
      const outputPath = path.join(tempDir, 'output.mp3');
      
      await fs.writeFile(inputPath, track);
      
      await execAsync(
        `ffmpeg -stream_loop -1 -i "${inputPath}" -t ${duration} -c copy "${outputPath}"`
      );

      return await fs.readFile(outputPath);
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  }

  /**
   * Normalize audio to a consistent volume level
   * @param audio Input audio buffer
   * @returns Normalized audio buffer
   */
  normalizeAudio(audio: Buffer): Buffer {
    try {
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
    } catch (error) {
      logger.error('Error normalizing audio:', error);
      return audio;
    }
  }

  async processAudio(audioBuffer: Buffer): Promise<Buffer> {
    // For now, just return the original buffer
    // In a real implementation, this would apply audio processing
    return audioBuffer;
  }
}

/**
 * Combines multiple audio buffers into a single buffer
 */
export function combineAudioBuffers(buffers: Buffer[]): Buffer {
  return Buffer.concat(buffers);
}

/**
 * Creates a silence buffer of specified duration
 * @param durationMs Duration in milliseconds
 * @param sampleRate Sample rate (default 44100)
 */
export function createSilence(durationMs: number, sampleRate: number = 44100): Buffer {
  const samples = Math.floor(durationMs * sampleRate / 1000);
  return Buffer.alloc(samples * 2); // 16-bit samples = 2 bytes per sample
}

/**
 * Normalizes audio levels across multiple segments
 */
export function normalizeAudio(buffer: Buffer): Buffer {
  // Basic implementation - could be enhanced with actual audio normalization
  return buffer;
} 