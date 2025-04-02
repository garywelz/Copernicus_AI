import asyncio
import os
import sys
import logging
from pathlib import Path
from datetime import datetime

# Create logs directory if it doesn't exist
os.makedirs('logs', exist_ok=True)

# Configure logging
log_file = f'logs/podcast_enhancement_{datetime.now().strftime("%Y%m%d_%H%M%S")}.log'
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Add the project root directory to the Python path
project_root = str(Path(__file__).parent.parent.parent)
sys.path.append(project_root)

from src.services.video.VideoIntegrationService import VideoIntegrationService

async def main():
    """Example usage of the VideoIntegrationService with a podcast."""
    try:
        # Initialize the service
        logger.info("Initializing VideoIntegrationService...")
        video_service = VideoIntegrationService()
        
        # Example podcast script
        podcast_script = {
            'title': 'The Future of AI',
            'segments': [
                {
                    'content': 'Artificial Intelligence is transforming every aspect of our lives.',
                    'duration': 10.0
                },
                {
                    'content': 'From healthcare to transportation, AI is making remarkable advances.',
                    'duration': 15.0
                },
                {
                    'content': 'But what does this mean for the future of humanity?',
                    'duration': 12.0
                }
            ]
        }
        
        # Path to your podcast audio file
        audio_path = "path/to/your/podcast.mp3"
        
        # Create output directory if it doesn't exist
        os.makedirs("output", exist_ok=True)
        
        # Generate video
        logger.info("Creating video from podcast...")
        output_path = await video_service.create_video_from_podcast(
            audio_path=audio_path,
            podcast_script=podcast_script,
            output_path="output/enhanced_podcast.mp4",
            style={
                'background_color': '#1a1a1a',
                'text_color': '#ffffff',
                'font_size': 40
            }
        )
        
        logger.info(f"Successfully created video at: {output_path}")
        
    except Exception as e:
        logger.error(f"Error enhancing podcast: {str(e)}")
        raise

if __name__ == "__main__":
    asyncio.run(main()) 