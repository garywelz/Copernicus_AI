import pytest
import os
from src.services.descript.DescriptService import DescriptService, DescriptAPIError

@pytest.fixture
def descript_service():
    """Create a DescriptService instance for testing."""
    api_key = os.getenv('DESCRIPT_API_KEY')
    if not api_key:
        pytest.skip("DESCRIPT_API_KEY environment variable not set")
    return DescriptService(api_key)

@pytest.mark.asyncio
async def test_create_project(descript_service):
    """Test creating a new project."""
    project = await descript_service.create_project(
        name="Test Project",
        description="Test project for API testing"
    )
    assert project is not None
    assert "id" in project
    assert project["name"] == "Test Project"
    return project["id"]

@pytest.mark.asyncio
async def test_upload_audio(descript_service):
    """Test uploading an audio file."""
    # First create a project
    project_id = await test_create_project(descript_service)
    
    # Create a test audio file
    test_file = "test_audio.mp3"
    with open(test_file, "wb") as f:
        f.write(b"dummy audio data")
    
    try:
        # Upload the audio file
        upload_result = await descript_service.upload_audio(
            project_id=project_id,
            file_path=test_file,
            name="Test Audio"
        )
        assert upload_result is not None
        assert "id" in upload_result
        return project_id, upload_result["id"]
    finally:
        # Clean up test file
        if os.path.exists(test_file):
            os.remove(test_file)

@pytest.mark.asyncio
async def test_transcribe_audio(descript_service):
    """Test starting a transcription job."""
    project_id, audio_id = await test_upload_audio(descript_service)
    
    # Start transcription
    transcribe_result = await descript_service.transcribe_audio(
        project_id=project_id,
        audio_id=audio_id,
        language="en",
        diarization=True
    )
    assert transcribe_result is not None
    assert "job_id" in transcribe_result
    return project_id, audio_id, transcribe_result["job_id"]

@pytest.mark.asyncio
async def test_get_transcription_status(descript_service):
    """Test getting transcription status."""
    project_id, audio_id, job_id = await test_transcribe_audio(descript_service)
    
    # Get transcription status
    status = await descript_service.get_transcription_status(
        project_id=project_id,
        audio_id=audio_id,
        job_id=job_id
    )
    assert status is not None
    assert "status" in status

@pytest.mark.asyncio
async def test_get_transcript(descript_service):
    """Test getting transcript."""
    project_id, audio_id, _ = await test_transcribe_audio(descript_service)
    
    # Get transcript
    transcript = await descript_service.get_transcript(
        project_id=project_id,
        audio_id=audio_id
    )
    assert transcript is not None
    assert "text" in transcript

@pytest.mark.asyncio
async def test_export_audio(descript_service):
    """Test exporting audio."""
    project_id, audio_id, _ = await test_transcribe_audio(descript_service)
    
    # Export audio
    export_result = await descript_service.export_audio(
        project_id=project_id,
        audio_id=audio_id,
        format="mp3",
        quality="high"
    )
    assert export_result is not None
    assert "job_id" in export_result
    return project_id, audio_id, export_result["job_id"]

@pytest.mark.asyncio
async def test_get_export_status(descript_service):
    """Test getting export status."""
    project_id, audio_id, job_id = await test_export_audio(descript_service)
    
    # Get export status
    status = await descript_service.get_export_status(
        project_id=project_id,
        audio_id=audio_id,
        job_id=job_id
    )
    assert status is not None
    assert "status" in status 