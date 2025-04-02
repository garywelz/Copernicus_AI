"""
Configuration package for Copernicus AI podcast generation system.
Contains settings for paths, templates, music, and subscription tiers.
"""

from .paths import AUDIO_PATHS
from .music_library import MUSIC_LIBRARY
from .podcast_templates import (
    SCIENTIFIC_PODCAST_TEMPLATE,
    TECHNICAL_PODCAST_TEMPLATE,
    SHORT_SAMPLE_PODCAST_TEMPLATE
)

__all__ = [
    'AUDIO_PATHS',
    'MUSIC_LIBRARY',
    'SCIENTIFIC_PODCAST_TEMPLATE',
    'TECHNICAL_PODCAST_TEMPLATE',
    'SHORT_SAMPLE_PODCAST_TEMPLATE'
] 