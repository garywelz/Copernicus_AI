import { VideoService } from '../services/VideoService';
import { ServiceOptions } from '../types/service';
import { VideoServiceConfig } from '../types/video';
import path from 'path';

async function testVideoService() {
  // Create service configuration
  const config: VideoServiceConfig = {
    name: 'video-service',
    version: '1.0.0',
    enabled: true,
    debug: true,
    timeout: 30000,
    retries: 3,
    retryDelay: 1000,
    video: {
      width: 1920,
      height: 1080,
      fps: 30,
      format: 'mp4',
      quality: 8,
      outputDir: path.join(__dirname, '../../output/content/video'),
      tempDir: path.join(__dirname, '../../output/cache/temp')
    },
    ffmpeg: {
      path: '/usr/bin/ffmpeg',
      threads: 4
    }
  };

  // Create service options
  const options: ServiceOptions = {
    config,
    logger: console
  };

  // Initialize service
  const service = new VideoService(options);
  await service.initialize();

  // Test video generation
  const audioPath = path.join(__dirname, '../../output/content/audio/test.mp3');
  const imagePath = path.join(__dirname, '../../output/content/images/test.jpg');

  const result = await service.generateVideo({
    audioPath,
    images: [
      {
        path: imagePath,
        duration: 5,
        transition: {
          type: 'fade',
          duration: 1
        }
      }
    ],
    text: [
      {
        content: 'Test Text Overlay',
        startTime: 1,
        duration: 3,
        style: {
          font: 'Arial',
          size: 48,
          color: 'white',
          alignment: 'center',
          position: { x: 0, y: 0 }
        }
      }
    ],
    formulas: [
      {
        latex: 'E = mc^2',
        startTime: 2,
        duration: 3,
        style: {
          size: 48,
          color: 'white',
          position: { x: 0, y: 100 }
        }
      }
    ]
  });

  if (result.success && result.data) {
    console.log('Video generation successful:', result.data);
  } else {
    console.error('Video generation failed:', result.error);
  }

  // Test video processing
  if (result.success && result.data) {
    const processResult = await service.processVideo(result.data.filePath, {
      effects: [
        {
          type: 'contrast',
          params: { value: 1.2 }
        },
        {
          type: 'brightness',
          params: { value: 0.1 }
        }
      ]
    });

    if (processResult.success && processResult.data) {
      console.log('Video processing successful:', processResult.data);
    } else {
      console.error('Video processing failed:', processResult.error);
    }
  }
}

// Run test
testVideoService().catch(console.error); 