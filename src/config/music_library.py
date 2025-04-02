"""
Music library configuration for podcast background music.
"""

from pathlib import Path

MUSIC_LIBRARY = [
    {
        'id': 'science-discovery',
        'path': str(Path('public/music/background/default-background.mp3')),
        'mood': ['inspiring', 'uplifting', 'curious'],
        'tempo': 'medium',
        'intensity': 'medium'
    },
    {
        'id': 'deep-analysis',
        'path': str(Path('public/music/deep-analysis.mp3')),
        'mood': ['focused', 'thoughtful', 'analytical'],
        'tempo': 'slow',
        'intensity': 'low'
    },
    {
        'id': 'tech-innovation',
        'path': str(Path('public/music/tech-innovation.mp3')),
        'mood': ['modern', 'progressive', 'dynamic'],
        'tempo': 'medium',
        'intensity': 'medium'
    },
    {
        'id': 'nature-discovery',
        'path': str(Path('public/music/nature-discovery.mp3')),
        'mood': ['peaceful', 'organic', 'contemplative'],
        'tempo': 'slow',
        'intensity': 'low'
    }
] 