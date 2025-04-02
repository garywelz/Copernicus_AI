import { IVoiceService } from '../../../../../services/voice/IVoiceService';
import { AudioResult, AudioSegment } from '../../../../../types/voice';

export class MockVoiceService implements IVoiceService {
  private mockResults: Map<string, AudioResult> = new Map();
  private mockSegments: AudioSegment[] = [];

  constructor() {
    // Initialize with some mock data
    this.mockResults.set('test', {
      duration: 1.5,
      url: 'https://example.com/test.mp3',
      metadata: { format: 'mp3' }
    });
  }

  async generateAudio(text: string, speaker?: string): Promise<AudioResult> {
    const result = this.mockResults.get(text) || {
      duration: 1.0,
      url: `https://example.com/${text}.mp3`,
      metadata: { format: 'mp3', speaker }
    };
    return result;
  }

  async combineAudioSegments(
    segments: AudioSegment[],
    outputPath?: string,
    pauseDuration: number = 0.5
  ): Promise<AudioResult> {
    this.mockSegments = segments;
    const totalDuration = segments.reduce((acc, seg) => acc + seg.duration, 0) +
      (segments.length - 1) * pauseDuration;
    
    return {
      duration: totalDuration,
      url: outputPath || 'https://example.com/combined.mp3',
      metadata: {
        segmentCount: segments.length,
        pauseDuration
      }
    };
  }

  // Helper methods for testing
  setMockResult(text: string, result: AudioResult): void {
    this.mockResults.set(text, result);
  }

  getMockSegments(): AudioSegment[] {
    return this.mockSegments;
  }
} 