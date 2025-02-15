import { NextResponse } from 'next/server';
import type { Episode } from '@/types/episode';

// Sample data - replace with database call later
const episodes: Episode[] = [
  {
    id: '1',
    title: 'Understanding Large Language Models',
    description: 'An in-depth look at how large language models work and their impact on AI research.',
    thumbnailUrl: '/images/episode-1-thumb.jpg',
    duration: '32:15',
    date: '2024-01-15',
    url: 'https://youtube.com/watch?v=...',
    isFeatured: true
  },
  {
    id: '2',
    title: 'The Future of AI Research',
    description: 'Exploring upcoming trends and breakthrough possibilities in artificial intelligence.',
    thumbnailUrl: '/images/episode-2-thumb.jpg',
    duration: '28:45',
    date: '2024-01-22',
    url: 'https://youtube.com/watch?v=...',
    isFeatured: false
  }
];

export async function GET() {
  try {
    return NextResponse.json(episodes);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch episodes' },
      { status: 500 }
    );
  }
} 