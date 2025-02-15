import { MusicTrack } from '../services/music/BackgroundMusicSelector.js';
import path from 'path';

export const musicLibrary: MusicTrack[] = [
  {
    id: 'science-discovery',
    path: path.join(process.cwd(), 'public/music/background/default-background.mp3'),
    mood: ['inspiring', 'uplifting', 'curious'],
    tempo: 'medium',
    intensity: 'medium'
  },
  // {
  //   id: 'breakthrough',
  //   path: '/music/breakthrough.mp3',
  //   mood: ['dramatic', 'intense', 'exciting'],
  //   tempo: 'fast',
  //   intensity: 'high'
  // },
  {
    id: 'deep-analysis',
    path: '/music/deep-analysis.mp3',
    mood: ['focused', 'thoughtful', 'analytical'],
    tempo: 'slow',
    intensity: 'low'
  },
  {
    id: 'tech-innovation',
    path: '/music/tech-innovation.mp3',
    mood: ['modern', 'progressive', 'dynamic'],
    tempo: 'medium',
    intensity: 'medium'
  },
  {
    id: 'nature-discovery',
    path: '/music/nature-discovery.mp3',
    mood: ['peaceful', 'organic', 'contemplative'],
    tempo: 'slow',
    intensity: 'low'
  }
]; 