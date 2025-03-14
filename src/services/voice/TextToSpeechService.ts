import { IVoiceService } from '../interfaces/IVoiceService';
import { VoiceSettings, VoiceSynthesisOptions } from '../../types/voice';
import { AudioSegment, AudioProcessingOptions } from '../../types/audio';
import { AudioProcessor } from '../../utils/audio';
import { AudioEnhancer } from '../../utils/audioEffects';
import { logger } from '../../utils/logger';
import fetch from 'node-fetch';

export class TextToSpeechService implements IVoiceService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.elevenlabs.io/v1';
  private readonly audioProcessor: AudioProcessor;
  private readonly audioEnhancer: AudioEnhancer;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.audioProcessor = new AudioProcessor();
    this.audioEnhancer = new AudioEnhancer();
  }

  async synthesize(text: string, options: VoiceSynthesisOptions): Promise<AudioSegment> {
    try {
      const response = await fetch(`${this.baseUrl}/text-to-speech/${options.model}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: options.settings || {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.7,
            use_speaker_boost: true,
            volume: 1.0
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to synthesize speech: ${response.status} - ${errorText}`);
      }

      const audioBuffer = Buffer.from(await response.arrayBuffer());
      
      // Process the audio
      let processedAudio = await this.audioProcessor.processAudio(audioBuffer);
      
      // Enhance the audio
      processedAudio = await this.audioEnhancer.enhance(processedAudio);

      // Estimate duration (assuming 16kHz 16-bit audio)
      const duration = Math.ceil(processedAudio.length / 32000);

      return {
        audioData: processedAudio,
        duration,
        speaker: options.model
      };
    } catch (error) {
      logger.error('Error in synthesize:', error);
      throw error;
    }
  }

  async combineAudio(segments: AudioSegment[]): Promise<Buffer> {
    try {
      const processedSegments: Buffer[] = [];
      
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        processedSegments.push(segment.audioData);

        // Add a small pause between segments (0.5 seconds)
        if (i < segments.length - 1) {
          const pause = Buffer.alloc(22050); // 0.5 seconds at 44.1kHz
          processedSegments.push(pause);
        }
      }

      return Buffer.concat(processedSegments);
    } catch (error) {
      logger.error('Error combining audio segments:', error);
      throw error;
    }
  }
} 