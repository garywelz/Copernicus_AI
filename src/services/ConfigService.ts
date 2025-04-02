import { AbstractBaseService } from './BaseService';
import { ServiceConfig, ServiceOptions, ServiceResult } from '../types/service';
import { ConfigurationError } from '../utils/errors';

/**
 * Configuration interface
 */
export interface AppConfig extends ServiceConfig {
  environment: 'development' | 'production' | 'test';
  api: {
    elevenLabs: {
      apiKey: string;
      baseUrl: string;
    };
    twitter: {
      apiKey: string;
      apiSecret: string;
      accessToken: string;
      accessTokenSecret: string;
    };
    youtube: {
      apiKey: string;
      clientId: string;
      clientSecret: string;
    };
  };
  audio: {
    sampleRate: number;
    bitDepth: number;
    channels: number;
    format: 'mp3' | 'wav';
    quality: number;
  };
  video: {
    width: number;
    height: number;
    fps: number;
    format: 'mp4' | 'webm';
    quality: number;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    format: 'json' | 'text';
    destination: 'console' | 'file';
    filePath?: string;
  };
}

/**
 * Configuration service implementation
 */
export class ConfigService extends AbstractBaseService {
  private appConfig: AppConfig;

  constructor(options: ServiceOptions) {
    super(options);
    this.appConfig = this.loadConfig();
  }

  /**
   * Load configuration from environment variables
   */
  private loadConfig(): AppConfig {
    try {
      return {
        ...this.config, // Include base ServiceConfig properties
        environment: this.getEnvVar('NODE_ENV', 'development') as AppConfig['environment'],
        api: {
          elevenLabs: {
            apiKey: this.getEnvVar('ELEVENLABS_API_KEY'),
            baseUrl: this.getEnvVar('ELEVENLABS_BASE_URL', 'https://api.elevenlabs.io/v1')
          },
          twitter: {
            apiKey: this.getEnvVar('TWITTER_API_KEY'),
            apiSecret: this.getEnvVar('TWITTER_API_SECRET'),
            accessToken: this.getEnvVar('TWITTER_ACCESS_TOKEN'),
            accessTokenSecret: this.getEnvVar('TWITTER_ACCESS_TOKEN_SECRET')
          },
          youtube: {
            apiKey: this.getEnvVar('YOUTUBE_API_KEY'),
            clientId: this.getEnvVar('YOUTUBE_CLIENT_ID'),
            clientSecret: this.getEnvVar('YOUTUBE_CLIENT_SECRET')
          }
        },
        audio: {
          sampleRate: parseInt(this.getEnvVar('AUDIO_SAMPLE_RATE', '44100')),
          bitDepth: parseInt(this.getEnvVar('AUDIO_BIT_DEPTH', '16')),
          channels: parseInt(this.getEnvVar('AUDIO_CHANNELS', '2')),
          format: this.getEnvVar('AUDIO_FORMAT', 'mp3') as AppConfig['audio']['format'],
          quality: parseInt(this.getEnvVar('AUDIO_QUALITY', '320'))
        },
        video: {
          width: parseInt(this.getEnvVar('VIDEO_WIDTH', '1920')),
          height: parseInt(this.getEnvVar('VIDEO_HEIGHT', '1080')),
          fps: parseInt(this.getEnvVar('VIDEO_FPS', '30')),
          format: this.getEnvVar('VIDEO_FORMAT', 'mp4') as AppConfig['video']['format'],
          quality: parseInt(this.getEnvVar('VIDEO_QUALITY', '8'))
        },
        logging: {
          level: this.getEnvVar('LOG_LEVEL', 'info') as AppConfig['logging']['level'],
          format: this.getEnvVar('LOG_FORMAT', 'json') as AppConfig['logging']['format'],
          destination: this.getEnvVar('LOG_DESTINATION', 'console') as AppConfig['logging']['destination'],
          filePath: this.getEnvVar('LOG_FILE_PATH')
        }
      };
    } catch (error) {
      throw new ConfigurationError(
        'Failed to load configuration',
        'CONFIG_LOAD_ERROR',
        error
      );
    }
  }

  /**
   * Get environment variable with optional default value
   */
  private getEnvVar(key: string, defaultValue?: string): string {
    const value = process.env[key];
    
    if (!value && defaultValue === undefined) {
      throw new ConfigurationError(
        `Missing required environment variable: ${key}`,
        key
      );
    }

    return value || defaultValue!;
  }

  /**
   * Get configuration value by path
   */
  get<T>(path: string): ServiceResult<T> {
    try {
      const value = path.split('.').reduce((obj, key) => obj[key], this.appConfig as any);
      return { success: true, data: value };
    } catch (error) {
      return {
        success: false,
        error: new ConfigurationError(
          `Invalid configuration path: ${path}`,
          path,
          error
        )
      };
    }
  }

  /**
   * Validate configuration
   */
  async validate(): Promise<void> {
    // Validate required API keys
    if (!this.appConfig.api.elevenLabs.apiKey) {
      throw new ConfigurationError(
        'Missing ElevenLabs API key',
        'ELEVENLABS_API_KEY'
      );
    }

    // Validate audio settings
    if (this.appConfig.audio.sampleRate < 8000 || this.appConfig.audio.sampleRate > 48000) {
      throw new ConfigurationError(
        'Invalid audio sample rate',
        'AUDIO_SAMPLE_RATE'
      );
    }

    // Validate video settings
    if (this.appConfig.video.width < 640 || this.appConfig.video.height < 480) {
      throw new ConfigurationError(
        'Invalid video dimensions',
        'VIDEO_DIMENSIONS'
      );
    }

    // Validate logging settings
    if (this.appConfig.logging.destination === 'file' && !this.appConfig.logging.filePath) {
      throw new ConfigurationError(
        'Missing log file path',
        'LOG_FILE_PATH'
      );
    }
  }
} 