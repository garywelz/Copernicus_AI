import { TextToSpeechService } from '../voice/TextToSpeechService';
import { BackgroundMusicSelector } from '../music/BackgroundMusicSelector';
import { musicLibrary } from '../../config/musicLibrary';
import { PodcastScript } from '../../types/podcast';
import { logger } from '../../utils/logger';
import fs from 'fs/promises';
import { IVoiceService } from '../voice/IVoiceService';

export class PodcastGenerator {
  constructor(
    private ttsService: IVoiceService,
    private backgroundMusicSelector?: BackgroundMusicSelector
  ) {}

  async generatePodcast(template: any): Promise<Buffer> {
    try {
      // Load and verify background music
      const backgroundMusic = await fs.readFile('assets/music/science-background.mp3');
      console.log('Background music loaded:', backgroundMusic.length, 'bytes');
      
      // Verify intro/outro exist
      const introExists = await fs.access('assets/music/intro-sting.mp3').then(() => true).catch(() => false);
      const outroExists = await fs.access('assets/music/outro-sting.mp3').then(() => true).catch(() => false);
      console.log('Music files present:', { introExists, outroExists });

      await this.ttsService.setBackgroundMusic(backgroundMusic);

      // Generate speech segments sequentially with pauses
      const segments = [];
      for (const segment of template.segments) {
        const audioSegment = await this.ttsService.synthesize(segment.text, {
          model: segment.speaker,
          speed: 1.0,
          pauseAfter: true  // Add pause after each segment
        });
        segments.push(audioSegment);
        
        // Add longer pauses between main sections
        if (segment.isMainBreak) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      // Combine segments with background music
      const finalAudio = await this.ttsService.combineAudio(segments, {
        backgroundMusicVolume: 0.15,  // Subtle background music
        crossFadeDuration: 0.8,       // Smooth transitions
        pauseDuration: 0.5            // Consistent pauses
      });

      return finalAudio;
    } catch (error) {
      logger.error('Error generating podcast:', error);
      throw new Error('Failed to generate podcast audio');
    }
  }
} 