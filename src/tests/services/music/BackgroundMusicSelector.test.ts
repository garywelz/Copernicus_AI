import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import { BackgroundMusicSelector, type MusicTrack } from '../../../services/music/BackgroundMusicSelector';

jest.mock('../../../utils/logger');

describe('BackgroundMusicSelector', () => {
  let selector: BackgroundMusicSelector;
  
  const mockLibrary: MusicTrack[] = [
    {
      id: 'track1',
      path: '/music/track1.mp3',
      mood: ['inspiring', 'uplifting'],
      tempo: 'medium' as const,
      intensity: 'high' as const
    },
    {
      id: 'track2',
      path: '/music/track2.mp3',
      mood: ['calm', 'focused'],
      tempo: 'slow' as const,
      intensity: 'low' as const
    }
  ];

  beforeEach(() => {
    selector = new BackgroundMusicSelector(mockLibrary);
  });

  test('selects track based on content and mood', () => {
    const result = selector.selectTrackForContent(
      'A calm and focused study shows interesting results.',
      ['calm', 'focused'],
      'slow' as const
    );

    expect(result.id).toBe('track2');
    expect(result.mood).toContain('calm');
    expect(result.tempo).toBe('slow');
  });

  test('falls back to default track when no match found', () => {
    const emptySelector = new BackgroundMusicSelector([]);
    const result = emptySelector.selectTrackForContent(
      'content',
      ['nonexistent'],
      'medium' as const
    );

    expect(result).toEqual({
      id: 'default',
      path: '/music/default-background.mp3',
      mood: ['neutral'],
      tempo: 'medium',
      intensity: 'low'
    } as MusicTrack);
  });

  test('handles content intensity analysis', () => {
    const result = selector.selectTrackForContent(
      'This is a revolutionary breakthrough! Dramatic results! Significant findings!',
      ['inspiring'],
      'medium' as const
    );

    expect(result.intensity).toBe('high');
  });
}); 