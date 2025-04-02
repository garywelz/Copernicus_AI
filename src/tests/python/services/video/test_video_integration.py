import pytest
import os
from pathlib import Path
import sys
import asyncio
import tempfile
import shutil
from unittest.mock import Mock, patch, AsyncMock, MagicMock
import numpy as np

# Add the project root directory to the Python path
project_root = str(Path(__file__).parent.parent.parent)
sys.path.append(project_root)

# Debug prints
print(f"Python path: {sys.path}")
print(f"Current working directory: {os.getcwd()}")
print(f"Project root: {project_root}")

try:
    from src.services.video.VideoIntegrationService import VideoIntegrationService
    print("Successfully imported VideoIntegrationService")
except ImportError as e:
    print(f"Import error: {e}")
    raise

# Test data
TEST_PODCAST_SCRIPT = {
    "title": "Test Podcast",
    "segments": [
        {
            "content": "This is a test segment about artificial intelligence.",
            "duration": 5.0,
            "generate_image": True,
            "show_text": True
        },
        {
            "content": "Now we are discussing machine learning.",
            "duration": 4.0,
            "generate_image": True,
            "show_text": True
        }
    ]
}

@pytest.fixture
def video_service():
    """Create a VideoIntegrationService instance for testing."""
    return VideoIntegrationService()

@pytest.fixture
def sample_podcast_script():
    """Create a sample podcast script for testing."""
    return {
        'title': 'Test Podcast',
        'segments': [
            {
                'content': 'Welcome to our podcast about technology and innovation.',
                'duration': 5.0,
                'generate_image': True,
                'show_text': True
            },
            {
                'content': 'Today we discuss the future of artificial intelligence.',
                'duration': 8.0,
                'generate_image': True,
                'show_text': True
            }
        ]
    }

@pytest.fixture
def sample_audio_file(tmp_path):
    """Create a temporary audio file for testing."""
    audio_path = tmp_path / "test_audio.mp3"
    # Create a small valid MP3 file for testing
    with open(audio_path, 'wb') as f:
        # Write a minimal valid MP3 header
        f.write(b'\x49\x44\x33\x03\x00\x00\x00\x00\x00\x00')
    return str(audio_path)

@pytest.fixture
def output_video_path(tmp_path):
    """Create a temporary output path for the video."""
    return str(tmp_path / "output_video.mp4")

@pytest.fixture
def test_audio(tmp_path):
    """Create a valid test audio file."""
    audio_path = tmp_path / "test_audio.mp3"
    
    # Create a 1-second sine wave using numpy
    sample_rate = 44100
    duration = 1.0
    t = np.linspace(0, duration, int(sample_rate * duration))
    audio_data = np.sin(2 * np.pi * 440 * t)
    
    # Save as WAV first
    wav_path = tmp_path / "test_audio.wav"
    import wave
    with wave.open(str(wav_path), 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)
        wav_file.writeframes((audio_data * 32767).astype(np.int16).tobytes())
    
    # Convert WAV to MP3 using ffmpeg
    import subprocess
    subprocess.run([
        'ffmpeg', '-i', str(wav_path),
        '-codec:a', 'libmp3lame',
        '-qscale:a', '2',
        str(audio_path)
    ], check=True)
    
    return str(audio_path)

@pytest.fixture
def test_images(tmp_path):
    """Create test image files."""
    image_paths = []
    for i in range(2):
        img_path = tmp_path / f"test_image_{i}.jpg"
        # Create a simple test image using numpy
        img_data = np.zeros((1080, 1920, 3), dtype=np.uint8)
        img_data[:, :, 0] = 255  # Red channel
        import cv2
        cv2.imwrite(str(img_path), img_data)
        image_paths.append(str(img_path))
    return image_paths

@pytest.fixture
def mock_openai():
    """Mock OpenAI client."""
    with patch('openai.OpenAI') as mock:
        mock_instance = MagicMock()
        mock_instance.images.generate.return_value = MagicMock(
            data=[MagicMock(url="https://example.com/image.jpg")]
        )
        mock.return_value = mock_instance
        yield mock

@pytest.fixture
def mock_google_vision():
    """Mock Google Cloud Vision client."""
    with patch('google.cloud.vision.ImageAnnotatorClient') as mock:
        mock_instance = MagicMock()
        mock_instance.label_detection.return_value = MagicMock(
            label_annotations=[MagicMock(description="test_label")]
        )
        mock.return_value = mock_instance
        yield mock

@pytest.fixture
def mock_google_tts():
    """Mock Google Cloud TTS client."""
    with patch('google.cloud.texttospeech.TextToSpeechClient') as mock:
        mock_instance = MagicMock()
        mock_instance.synthesize_speech.return_value = MagicMock(
            audio_content=b"test_audio_content"
        )
        mock.return_value = mock_instance
        yield mock

@pytest.fixture
def test_podcast_script():
    """Create a test podcast script."""
    return {
        'title': 'Test Podcast',
        'segments': [
            {
                'content': 'Welcome to our podcast about technology and innovation.',
                'duration': 5.0,
                'generate_image': True,
                'show_text': True
            },
            {
                'content': 'Today we discuss the future of artificial intelligence.',
                'duration': 8.0,
                'generate_image': True,
                'show_text': True
            }
        ]
    }

@pytest.mark.asyncio
async def test_create_video_from_podcast(video_service, test_audio, mock_openai, mock_google_vision, test_images):
    """Test video creation from podcast script and audio."""
    output_path = "output/test_video.mp4"
    
    # Create output directory
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Create video
    video_path = await video_service.create_video_from_podcast(
        audio_path=test_audio,
        podcast_script=TEST_PODCAST_SCRIPT,
        output_path=output_path,
        style={'image_path': test_images[0]}  # Use the first test image
    )
    
    assert video_path == output_path
    assert os.path.exists(video_path)

@pytest.mark.asyncio
async def test_create_video_with_custom_style(video_service, test_audio, mock_openai, mock_google_vision, test_images):
    """Test video creation with custom style settings."""
    output_path = "output/test_video_custom.mp4"
    
    # Create output directory
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Custom style settings
    custom_style = {
        'resolution': (1280, 720),
        'fps': 24,
        'background_color': '#000000',
        'font_size': 32,
        'font_color': '#ffffff',
        'text_duration': 2.0,
        'text_position': ('center', 'bottom'),
        'text_bg_color': 'rgba(0, 0, 0, 0.7)',
        'text_bg_padding': 10,
        'image_path': test_images[0]
    }
    
    # Create video with custom style
    video_path = await video_service.create_video_from_podcast(
        audio_path=test_audio,
        podcast_script=TEST_PODCAST_SCRIPT,
        output_path=output_path,
        style=custom_style
    )
    
    assert video_path == output_path
    assert os.path.exists(video_path)

@pytest.mark.asyncio
async def test_generate_visual_elements(video_service, mock_openai):
    """Test visual elements generation."""
    elements = await video_service._generate_visual_elements(TEST_PODCAST_SCRIPT)
    
    assert len(elements) == 4  # 2 images + 2 text elements
    assert all(e['type'] in ['image', 'text'] for e in elements)
    assert all('duration' in e for e in elements)

@pytest.mark.asyncio
async def test_generate_image_prompt(video_service, mock_openai):
    """Test image prompt generation."""
    content = "This is a test content about technology."
    prompt = await video_service._generate_image_prompt(content)
    
    assert isinstance(prompt, str)
    assert len(prompt) > 0

@pytest.mark.asyncio
async def test_error_handling(video_service):
    """Test error handling for invalid inputs."""
    # Test with non-existent audio file
    with pytest.raises(FileNotFoundError):
        await video_service.create_video_from_podcast(
            audio_path="nonexistent.mp3",
            podcast_script=TEST_PODCAST_SCRIPT,
            output_path="output/test_video.mp4"
        )
    
    # Test with invalid podcast script
    with pytest.raises(KeyError):
        await video_service.create_video_from_podcast(
            audio_path="test_audio.mp3",
            podcast_script={},  # Missing required fields
            output_path="output/test_video.mp4"
        )

@pytest.mark.asyncio
async def test_create_video_integration(video_service, test_audio, mock_openai, mock_google_vision, test_images):
    """Test complete video creation workflow."""
    output_path = "output/test_video_integration.mp4"
    
    # Create output directory
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Create video with all components
    video_path = await video_service.create_video_from_podcast(
        audio_path=test_audio,
        podcast_script=TEST_PODCAST_SCRIPT,
        output_path=output_path,
        style={'image_path': test_images[0]}
    )
    
    # Verify output
    assert video_path == output_path
    assert os.path.exists(video_path)
    assert os.path.getsize(video_path) > 0 