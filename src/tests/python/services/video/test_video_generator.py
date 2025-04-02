import pytest
import os
from src.services.video.VideoGeneratorService import VideoGeneratorService
import json
import tempfile
from src.scripts.video.generate_video import VideoGenerator

@pytest.fixture
def video_generator():
    """Create a VideoGeneratorService instance for testing."""
    return VideoGeneratorService()

@pytest.fixture
def test_audio():
    """Create a test audio file."""
    test_file = "test_audio.mp3"
    with open(test_file, "wb") as f:
        f.write(b"dummy audio data")
    yield test_file
    if os.path.exists(test_file):
        os.remove(test_file)

@pytest.fixture
def test_images():
    """Create test image files."""
    image_files = []
    for i in range(3):
        filename = f"test_image_{i}.jpg"
        with open(filename, "wb") as f:
            f.write(b"dummy image data")
        image_files.append(filename)
    yield image_files
    for file in image_files:
        if os.path.exists(file):
            os.remove(file)

@pytest.fixture
def temp_dir():
    with tempfile.TemporaryDirectory() as tmp_dir:
        yield tmp_dir

@pytest.fixture
def sample_audio(temp_dir):
    # Create a dummy audio file
    audio_path = os.path.join(temp_dir, 'test_audio.mp3')
    with open(audio_path, 'wb') as f:
        f.write(b'dummy audio content')
    return audio_path

@pytest.fixture
def sample_elements(temp_dir):
    elements = [
        {
            'type': 'text',
            'content': 'Test Title',
            'startTime': 0,
            'duration': 5,
            'style': {
                'fontSize': 40,
                'textColor': 'white',
                'position': 'center'
            }
        },
        {
            'type': 'image',
            'content': 'https://example.com/test-image.jpg',
            'startTime': 5,
            'duration': 5,
            'style': {
                'size': 'medium',
                'position': 'center'
            }
        },
        {
            'type': 'formula',
            'content': 'x^2 + y^2 = r^2',
            'startTime': 10,
            'duration': 5,
            'style': {
                'position': 'center'
            }
        }
    ]
    elements_path = os.path.join(temp_dir, 'elements.json')
    with open(elements_path, 'w') as f:
        json.dump(elements, f)
    return elements_path

@pytest.fixture
def sample_options(temp_dir):
    options = {
        'width': 1920,
        'height': 1080,
        'fps': 30,
        'backgroundColor': '#000000',
        'elements': [
            {
                'type': 'text',
                'content': 'Test Title',
                'startTime': 0,
                'duration': 5
            }
        ]
    }
    options_path = os.path.join(temp_dir, 'options.json')
    with open(options_path, 'w') as f:
        json.dump(options, f)
    return options_path

@pytest.mark.asyncio
async def test_generate_video(video_generator, test_audio):
    """Test basic video generation."""
    output_path = "test_output.mp4"
    try:
        result = await video_generator.generate_video(
            audio_path=test_audio,
            title="Test Video",
            description="This is a test video",
            output_path=output_path
        )
        assert result == output_path
        assert os.path.exists(output_path)
    finally:
        if os.path.exists(output_path):
            os.remove(output_path)

@pytest.mark.asyncio
async def test_generate_video_with_images(video_generator, test_audio, test_images):
    """Test video generation with image slideshow."""
    output_path = "test_output_with_images.mp4"
    try:
        result = await video_generator.generate_video_with_images(
            audio_path=test_audio,
            title="Test Video with Images",
            description="This is a test video with image slideshow",
            output_path=output_path,
            image_paths=test_images
        )
        assert result == output_path
        assert os.path.exists(output_path)
    finally:
        if os.path.exists(output_path):
            os.remove(output_path)

@pytest.mark.asyncio
async def test_generate_video_with_ai_images(video_generator, test_audio):
    """Test video generation with AI-generated images."""
    output_path = "test_output_with_ai_images.mp4"
    try:
        result = await video_generator.generate_video_with_ai_images(
            audio_path=test_audio,
            title="Test Video with AI Images",
            description="This is a test video with AI-generated images",
            output_path=output_path,
            num_images=3
        )
        assert result == output_path
        assert os.path.exists(output_path)
    finally:
        if os.path.exists(output_path):
            os.remove(output_path)

def test_video_generator_initialization(sample_audio, sample_elements, sample_options):
    generator = VideoGenerator(sample_audio, sample_elements, sample_options)
    assert generator.audio_path == sample_audio
    assert os.path.exists(generator.temp_dir)

def test_video_generation(sample_audio, sample_elements, sample_options):
    generator = VideoGenerator(sample_audio, sample_elements, sample_options)
    output_path = generator.generate()
    assert os.path.exists(output_path)
    assert output_path.endswith('.mp4')

def test_invalid_element_type(sample_audio, temp_dir):
    # Create elements with invalid type
    elements = [{
        'type': 'invalid',
        'content': 'test',
        'startTime': 0,
        'duration': 5
    }]
    elements_path = os.path.join(temp_dir, 'elements.json')
    with open(elements_path, 'w') as f:
        json.dump(elements, f)

    # Create options
    options = {
        'width': 1920,
        'height': 1080,
        'fps': 30,
        'backgroundColor': '#000000',
        'elements': elements
    }
    options_path = os.path.join(temp_dir, 'options.json')
    with open(options_path, 'w') as f:
        json.dump(options, f)

    generator = VideoGenerator(sample_audio, elements_path, options_path)
    output_path = generator.generate()
    assert os.path.exists(output_path)

def test_formula_rendering(sample_audio, temp_dir):
    # Create elements with mathematical formula
    elements = [{
        'type': 'formula',
        'content': 'x^2 + y^2 = r^2',
        'startTime': 0,
        'duration': 5,
        'style': {
            'position': 'center'
        }
    }]
    elements_path = os.path.join(temp_dir, 'elements.json')
    with open(elements_path, 'w') as f:
        json.dump(elements, f)

    # Create options
    options = {
        'width': 1920,
        'height': 1080,
        'fps': 30,
        'backgroundColor': '#000000',
        'elements': elements
    }
    options_path = os.path.join(temp_dir, 'options.json')
    with open(options_path, 'w') as f:
        json.dump(options, f)

    generator = VideoGenerator(sample_audio, elements_path, options_path)
    output_path = generator.generate()
    assert os.path.exists(output_path)

def test_diagram_generation(sample_audio, temp_dir):
    # Create elements with Mandelbrot diagram
    elements = [{
        'type': 'diagram',
        'content': 'mandelbrot',
        'startTime': 0,
        'duration': 5,
        'style': {
            'position': 'center'
        }
    }]
    elements_path = os.path.join(temp_dir, 'elements.json')
    with open(elements_path, 'w') as f:
        json.dump(elements, f)

    # Create options
    options = {
        'width': 1920,
        'height': 1080,
        'fps': 30,
        'backgroundColor': '#000000',
        'elements': elements
    }
    options_path = os.path.join(temp_dir, 'options.json')
    with open(options_path, 'w') as f:
        json.dump(options, f)

    generator = VideoGenerator(sample_audio, elements_path, options_path)
    output_path = generator.generate()
    assert os.path.exists(output_path)

def test_cleanup(sample_audio, sample_elements, sample_options):
    generator = VideoGenerator(sample_audio, sample_elements, sample_options)
    temp_dir = generator.temp_dir
    output_path = generator.generate()
    
    # Verify output exists
    assert os.path.exists(output_path)
    
    # Clean up
    generator.cleanup()
    
    # Verify temp directory is removed
    assert not os.path.exists(temp_dir) 