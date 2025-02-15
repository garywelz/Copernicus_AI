import { logger } from '../../utils/logger';
import { AudioProcessor } from '../../utils/audio';

export interface MusicTrack {
  id: string;
  path: string;
  mood: string[];
  tempo: 'slow' | 'medium' | 'fast';
  intensity: 'low' | 'medium' | 'high';
}

export class BackgroundMusicSelector {
  constructor(private musicLibrary: MusicTrack[]) {}

  selectTrackForContent(
    content: string,
    mood: string[],
    preferredTempo?: string
  ): MusicTrack {
    try {
      // Score each track based on content and preferences
      const scoredTracks = this.musicLibrary.map(track => ({
        track,
        score: this.calculateTrackScore(track, content, mood, preferredTempo)
      }));

      // Sort by score and return best match
      scoredTracks.sort((a, b) => b.score - a.score);
      return scoredTracks[0].track;
    } catch (error) {
      logger.error('Error selecting background music:', error);
      return this.getDefaultTrack();
    }
  }

  private calculateTrackScore(
    track: MusicTrack,
    content: string,
    mood: string[],
    preferredTempo?: string
  ): number {
    let score = 0;

    // Match mood
    score += mood.filter(m => track.mood.includes(m)).length * 2;

    // Match tempo if specified
    if (preferredTempo && track.tempo === preferredTempo) {
      score += 1;
    }

    // Consider content intensity
    const contentIntensity = this.analyzeContentIntensity(content);
    if (track.intensity === contentIntensity) {
      score += 1;
    }

    return score;
  }

  private analyzeContentIntensity(content: string): 'low' | 'medium' | 'high' {
    // Simple analysis based on keywords and punctuation
    const exclamationCount = (content.match(/!/g) || []).length;
    const intensityWords = ['revolutionary', 'breakthrough', 'dramatic', 'significant'];
    const intensityWordCount = intensityWords.filter(word => 
      content.toLowerCase().includes(word)
    ).length;

    if (exclamationCount > 3 || intensityWordCount > 2) return 'high';
    if (exclamationCount > 1 || intensityWordCount > 0) return 'medium';
    return 'low';
  }

  private getDefaultTrack(): MusicTrack {
    return {
      id: 'default',
      path: '/music/default-background.mp3',
      mood: ['neutral'],
      tempo: 'medium',
      intensity: 'low'
    };
  }
} 