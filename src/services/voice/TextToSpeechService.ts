import type { IVoiceService, VoiceSynthesisOptions, AudioSegment } from '../interfaces/IVoiceService.js';
import { AudioProcessor, AudioProcessingOptions } from '../../utils/audio.js';
import { logger } from '../../utils/logger.js';
import { AudioEnhancer, AudioEnhancementOptions } from '../../utils/audioEffects.js';

export class TextToSpeechService implements IVoiceService {
  private readonly audioProcessor: AudioProcessor;
  private readonly audioEnhancer: AudioEnhancer;
  private backgroundMusic?: Buffer;

  constructor(
    private apiKey: string,
    private processingOptions: AudioProcessingOptions = {},
    private enhancementOptions: AudioEnhancementOptions = {}
  ) {
    this.audioProcessor = new AudioProcessor();
    this.audioEnhancer = new AudioEnhancer();
  }

  async setBackgroundMusic(musicBuffer: Buffer) {
    this.backgroundMusic = musicBuffer;
  }

  async synthesize(
    text: string,
    options: VoiceSynthesisOptions
  ): Promise<AudioSegment> {
    try {
      logger.info('Synthesizing speech with options:', options);

      const response = await fetch('https://api.tts-service.com/v1/synthesize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          model: options.model,
          speed: options.speed ?? 1.0,
          pitch: options.pitch ?? 1.0,
          emphasis: options.emphasis ?? 1.0
        })
      });

      if (!response.ok) {
        throw new Error(`Speech synthesis failed: ${response.statusText}`);
      }

      let audioData = Buffer.from(await response.arrayBuffer());

      // Apply audio processing
      if (this.processingOptions.fadeInDuration || this.processingOptions.fadeOutDuration) {
        audioData = this.audioProcessor.applyFade(
          audioData,
          this.processingOptions.fadeInDuration,
          this.processingOptions.fadeOutDuration
        );
      }

      // Mix with background if available
      if (this.backgroundMusic && this.processingOptions.backgroundVolume) {
        audioData = this.audioProcessor.mixWithBackground(
          audioData,
          this.backgroundMusic,
          this.processingOptions.backgroundVolume
        );
      }

      // Add enhancement step
      audioData = this.audioEnhancer.enhanceAudio(audioData, this.enhancementOptions);

      const duration = await this.getAudioDuration(audioData);

      return {
        audioData,
        duration,
        speaker: options.model
      };
    } catch (error) {
      logger.error('Error in speech synthesis:', error);
      throw new Error('Speech synthesis failed');
    }
  }

  async combineAudio(segments: AudioSegment[]): Promise<Buffer> {
    try {
      const processedSegments: Buffer[] = [];
      
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        processedSegments.push(segment.audioData);

        // Add pause after segment if configured
        if (this.processingOptions.pauseDuration && i < segments.length - 1) {
          const pause = this.audioProcessor.addPause(this.processingOptions.pauseDuration);
          processedSegments.push(pause);
        }
      }

      return Buffer.concat(processedSegments);
    } catch (error) {
      logger.error('Error combining audio segments:', error);
      throw new Error('Failed to combine audio segments');
    }
  }

  private async getAudioDuration(audioData: Buffer): Promise<number> {
    // Here we would use an audio library to get actual duration
    // For now, estimate based on buffer size
    return Math.ceil(audioData.length / 32000); // Rough estimate for 16kHz 16-bit audio
  }
} 