"""
Core data models for podcast generation and management.
"""
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class PodcastType(Enum):
    """Types of podcasts we can generate."""
    NEWS = "news"
    SCIENTIFIC = "scientific"
    TECHNICAL = "technical"
    EDUCATIONAL = "educational"

class AudioQuality(Enum):
    """Audio quality levels matching our subscription tiers."""
    STANDARD = "standard"  # 128kbps MP3
    HIGH = "high"         # 256kbps MP3
    ULTRA = "ultra"       # 320kbps MP3

@dataclass
class Speaker:
    """Represents a podcast speaker/voice."""
    name: str
    voice_id: str
    role: str  # 'host', 'expert', or 'questioner'
    language: str = "en-US"
    voice_settings: Dict[str, Any] = field(default_factory=dict)  # Provider-specific settings

@dataclass
class AudioSegment:
    """Represents a segment of podcast audio."""
    text: str
    speaker: Speaker
    duration: float  # in seconds
    audio_path: Optional[str] = None
    is_intro: bool = False
    is_outro: bool = False
    is_main_break: bool = False
    background_music: Optional[str] = None
    pause_after: bool = False
    volume: float = 1.0

@dataclass
class PodcastMetadata:
    """Metadata for podcast episodes."""
    keywords: List[str] = field(default_factory=list)
    categories: List[str] = field(default_factory=list)
    target_audience: str = "general"
    complexity_level: str = "intermediate"
    language: str = "en-US"
    explicit: bool = False
    season: Optional[int] = None
    episode: Optional[int] = None

@dataclass
class PodcastEpisode:
    """Represents a complete podcast episode."""
    title: str
    description: str
    speakers: List[Speaker]
    segments: List[AudioSegment]
    podcast_type: PodcastType
    metadata: PodcastMetadata = field(default_factory=PodcastMetadata)
    created_at: datetime = field(default_factory=datetime.now)
    duration: Optional[float] = None  # Total duration in seconds
    audio_path: Optional[str] = None  # Path to final audio file
    transcript_path: Optional[str] = None
    show_notes_path: Optional[str] = None
    audio_quality: AudioQuality = AudioQuality.STANDARD
    background_music: Optional[str] = None
    thumbnail_path: Optional[str] = None
    tags: List[str] = field(default_factory=list)

@dataclass
class NewsPodcast(PodcastEpisode):
    """Represents a news-specific podcast episode."""
    subject: str  # 'biology', 'chemistry', 'physics', etc.
    news_date: datetime
    sources: List[str] = field(default_factory=list)  # URLs or references
    episode_number: int = 1
    is_breaking: bool = False
    summary_length: str = "medium"  # short, medium, long
    coverage_period: str = "week"  # day, week, month

@dataclass
class ScientificPodcast(PodcastEpisode):
    """Represents a scientific deep-dive podcast episode."""
    topic: str
    research_papers: List[str] = field(default_factory=list)  # DOIs or URLs
    experts_cited: List[str] = field(default_factory=list)
    key_concepts: List[str] = field(default_factory=list)
    difficulty_level: str = "intermediate"  # basic, intermediate, advanced
    prerequisites: List[str] = field(default_factory=list) 