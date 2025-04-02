import { AbstractBaseService } from './BaseService';
import { ServiceOptions, ServiceResult } from '../types/service';
import { AudioServiceConfig, AudioGenerationOptions, AudioProcessingOptions, AudioGenerationResult, AudioProcessingResult, AudioMetadata, AudioEffect } from '../types/audio';
import { AudioProcessingError } from '../utils/errors';
import axios, { AxiosResponse } from 'axios';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { getAudioDurationInSeconds } from 'get-audio-duration';

/**
 * Audio service implementation
 */
export class AudioService extends AbstractBaseService {
  protected config: AudioServiceConfig;

  constructor(options: ServiceOptions) {
    super(options);
    this.config = options.config as AudioServiceConfig;
  }

  /**
   * Generate audio from text using ElevenLabs API
   */
  async generateAudio(options: AudioGenerationOptions): Promise<ServiceResult<AudioGenerationResult>> {
    const startTime = Date.now();

    try {
      // Prepare API request
      const voiceId = options.voiceId || this.config.elevenLabs.voiceId;
      const modelId = options.modelId || this.config.elevenLabs.modelId;

      const response = await this.withRetry(
        () => axios.post(
          `${this.config.elevenLabs.baseUrl}/text-to-speech/${voiceId}`,
          {
            text: options.text,
            model_id: modelId,
            voice_settings: {
              stability: options.stability || 0.5,
              similarity_boost: options.similarityBoost || 0.75,
              style: options.style || 0,
              use_speaker_boost: options.useSpeakerBoost || true
            }
          },
          {
            headers: {
              'xi-api-key': this.config.elevenLabs.apiKey,
              'Content-Type': 'application/json'
            },
            responseType: 'arraybuffer'
          }
        ),
        'ElevenLabs API request'
      );

      if (!response.success || !response.data) {
        return {
          success: false,
          error: new AudioProcessingError(
            'Failed to generate audio',
            'export',
            response.error
          )
        };
      }

      // Save audio file
      const fileName = `audio_${Date.now()}.${this.config.audio.format}`;
      const filePath = path.join(this.config.audio.outputDir, fileName);
      
      const audioData = (response.data as AxiosResponse).data;
      await fs.promises.writeFile(filePath, Buffer.from(audioData));

      // Get audio metadata
      const metadata = await this.getAudioMetadata(filePath);

      return {
        success: true,
        data: {
          filePath,
          metadata,
          processingTime: Date.now() - startTime,
          cost: this.calculateCost(audioData.length)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: new AudioProcessingError(
          'Failed to generate audio',
          'export',
          error
        )
      };
    }
  }

  /**
   * Process audio file with effects and enhancements
   */
  async processAudio(
    inputPath: string,
    options: AudioProcessingOptions
  ): Promise<ServiceResult<AudioProcessingResult>> {
    const startTime = Date.now();

    try {
      // Create output file path
      const fileName = path.basename(inputPath, path.extname(inputPath));
      const outputPath = path.join(
        this.config.audio.outputDir,
        `${fileName}_processed.${this.config.audio.format}`
      );

      // Create FFmpeg command
      let command = ffmpeg(inputPath);

      // Apply processing options
      if (options.normalize) {
        command = command.audioFilters('loudnorm');
      }

      if (options.trim) {
        command = command.audioFilters('atrim=start=0:end=-1');
      }

      if (options.fadeIn) {
        command = command.audioFilters(`afade=t=in:st=0:d=${options.fadeIn}`);
      }

      if (options.fadeOut) {
        command = command.audioFilters(`afade=t=out:st=-${options.fadeOut}:d=${options.fadeOut}`);
      }

      if (options.volume) {
        command = command.audioFilters(`volume=${options.volume}`);
      }

      // Apply audio effects
      if (options.effects) {
        for (const effect of options.effects) {
          command = this.applyAudioEffect(command, effect);
        }
      }

      // Set output format and quality
      command = command
        .audioCodec(this.config.audio.format === 'mp3' ? 'libmp3lame' : 'pcm_s16le')
        .audioBitrate(this.config.audio.quality * 1000)
        .audioChannels(this.config.audio.channels)
        .audioFrequency(this.config.audio.sampleRate);

      // Execute FFmpeg command
      await new Promise<void>((resolve, reject) => {
        command
          .save(outputPath)
          .on('end', resolve)
          .on('error', reject);
      });

      // Get processed audio metadata
      const metadata = await this.getAudioMetadata(outputPath);

      return {
        success: true,
        data: {
          filePath: outputPath,
          metadata,
          processingTime: Date.now() - startTime,
          effects: options.effects || []
        }
      };
    } catch (error) {
      return {
        success: false,
        error: new AudioProcessingError(
          'Failed to process audio',
          'export',
          error
        )
      };
    }
  }

  /**
   * Get audio file metadata
   */
  private async getAudioMetadata(filePath: string): Promise<AudioMetadata> {
    const stats = await fs.promises.stat(filePath);
    const duration = await getAudioDurationInSeconds(filePath);

    return {
      duration,
      sampleRate: this.config.audio.sampleRate,
      bitDepth: this.config.audio.bitDepth,
      channels: this.config.audio.channels,
      format: this.config.audio.format,
      size: stats.size,
      bitrate: Math.round((stats.size * 8) / duration)
    };
  }

  /**
   * Apply audio effect using FFmpeg
   */
  private applyAudioEffect(
    command: ffmpeg.FfmpegCommand,
    effect: AudioEffect
  ): ffmpeg.FfmpegCommand {
    switch (effect.type) {
      case 'reverb':
        return command.audioFilters(
          `aecho=${effect.params.delay || 0.1}:${effect.params.decay || 0.5}:${effect.params.volume || 0.5}`
        );
      case 'echo':
        return command.audioFilters(
          `aecho=${effect.params.delay || 0.1}:${effect.params.decay || 0.5}:${effect.params.volume || 0.5}`
        );
      case 'compression':
        return command.audioFilters(
          `acompressor=${effect.params.threshold || -20}:${effect.params.ratio || 4}:${effect.params.attack || 5}:${effect.params.release || 50}`
        );
      case 'equalizer':
        return command.audioFilters(
          `equalizer=f=${effect.params.frequency || 1000}:w=${effect.params.width || 1}:g=${effect.params.gain || 0}`
        );
      default:
        return command;
    }
  }

  /**
   * Calculate cost based on audio size
   */
  private calculateCost(bytes: number): number {
    // ElevenLabs pricing: $0.00003 per character
    const characters = Math.ceil(bytes / 2); // Rough estimate of characters
    return characters * 0.00003;
  }

  /**
   * Validate service configuration
   */
  async validate(): Promise<void> {
    await super.validate();

    // Validate output directory
    if (!fs.existsSync(this.config.audio.outputDir)) {
      await fs.promises.mkdir(this.config.audio.outputDir, { recursive: true });
    }

    // Validate temp directory
    if (!fs.existsSync(this.config.audio.tempDir)) {
      await fs.promises.mkdir(this.config.audio.tempDir, { recursive: true });
    }

    // Validate ElevenLabs configuration
    if (!this.config.elevenLabs.apiKey) {
      throw new AudioProcessingError(
        'Missing ElevenLabs API key',
        'normalization'
      );
    }

    // Validate audio settings
    if (this.config.audio.sampleRate < 8000 || this.config.audio.sampleRate > 48000) {
      throw new AudioProcessingError(
        'Invalid audio sample rate',
        'normalization'
      );
    }

    if (this.config.audio.bitDepth !== 16 && this.config.audio.bitDepth !== 24) {
      throw new AudioProcessingError(
        'Invalid audio bit depth',
        'normalization'
      );
    }
  }
} 