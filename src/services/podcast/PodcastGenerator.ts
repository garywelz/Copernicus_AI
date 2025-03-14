import { TextToSpeechService } from '../voice/TextToSpeechService';
import { BackgroundMusicSelector } from '../music/BackgroundMusicSelector';
import { musicLibrary } from '../../config/musicLibrary';
import { PodcastScript } from '../../types/podcast';
import { logger } from '../../utils/logger';
import fs from 'fs/promises';
import { IVoiceService } from '../interfaces/IVoiceService';
import { DescriptService } from '../descript/DescriptService';

export class PodcastGenerator {
  private descriptService?: DescriptService;

  constructor(
    private ttsService: IVoiceService,
    descriptConfig?: { apiKey: string }
  ) {
    if (descriptConfig) {
      this.descriptService = new DescriptService(descriptConfig);
    }
  }

  async generatePodcast(template: PodcastScript): Promise<Buffer> {
    try {
      // Generate speech segments sequentially with pauses
      const segments = [];
      let previousEndTime = 0;

      for (const segment of template.segments) {
        try {
          console.log('Generating segment:', segment.text.substring(0, 50) + '...');
          const voiceConfig = template.voices[segment.speaker];
          if (!voiceConfig) {
            throw new Error(`No voice config found for speaker: ${segment.speaker}`);
          }

          const audioSegment = await this.ttsService.synthesize(segment.text, {
            model: voiceConfig.id,
            settings: voiceConfig.settings,
            speed: 1.0
          });

          // Add small gap between segments
          if (segments.length > 0) {
            const gap = Buffer.alloc(22050); // 0.5 seconds of silence at 44.1kHz
            audioSegment.audioData = Buffer.concat([gap, audioSegment.audioData]);
            audioSegment.duration += 0.5;
          }

          segments.push(audioSegment);
        } catch (segmentError) {
          console.error('Failed to generate segment:', segmentError);
          throw segmentError;
        }
      }

      // Combine all segments
      console.log('Combining', segments.length, 'segments');
      const finalAudio = await this.ttsService.combineAudio(segments);
      console.log('Final audio size:', finalAudio.length);

      if (this.descriptService) {
        // Upload to Descript for additional processing
        const audioId = await this.descriptService.uploadPodcastAudio(
          'path/to/output.mp3',
          { name: template.title }
        );
        
        // Create as podcast episode
        const episode = await this.descriptService.createPodcastEpisode(
          audioId,
          { name: template.title }
        );
        
        logger.info('Audio uploaded to Descript for processing:', episode.id);
      }

      return finalAudio;
    } catch (error: unknown) {
      console.error('Detailed error in podcast generation:', error);
      if (error instanceof Error) {
        throw new Error('Failed to generate podcast audio: ' + error.message);
      } else {
        throw new Error('Failed to generate podcast audio: Unknown error');
      }
    }
  }
} 