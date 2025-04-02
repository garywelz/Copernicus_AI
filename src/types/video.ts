import { ServiceConfig } from './service';

export interface VideoServiceConfig extends ServiceConfig {
  name: string;
  version: string;
  video: {
    width: number;
    height: number;
    fps: number;
    format: 'mp4' | 'webm';
    quality: number;
    outputDir: string;
    tempDir: string;
  };
  ffmpeg: {
    path: string;
    threads: number;
  };
}

export interface VideoGenerationOptions {
  audioPath: string;
  images: Array<{
    path: string;
    duration: number;
    transition?: VideoTransition;
  }>;
  text?: Array<{
    content: string;
    startTime: number;
    duration: number;
    style?: TextStyle;
  }>;
  formulas?: Array<{
    latex: string;
    startTime: number;
    duration: number;
    style?: FormulaStyle;
  }>;
  background?: {
    color: string;
    opacity: number;
  };
  outputFormat?: 'mp4' | 'webm';
}

export interface VideoProcessingOptions {
  trim?: {
    start: number;
    end: number;
  };
  resize?: {
    width: number;
    height: number;
  };
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  rotate?: number;
  effects?: VideoEffect[];
}

export interface VideoTransition {
  type: 'fade' | 'slide' | 'zoom' | 'wipe';
  duration: number;
  direction?: 'left' | 'right' | 'up' | 'down';
}

export interface TextStyle {
  font: string;
  size: number;
  color: string;
  alignment: 'left' | 'center' | 'right';
  position: {
    x: number;
    y: number;
  };
  animation?: TextAnimation;
}

export interface FormulaStyle {
  size: number;
  color: string;
  position: {
    x: number;
    y: number;
  };
  background?: {
    color: string;
    opacity: number;
  };
  animation?: FormulaAnimation;
}

export interface TextAnimation {
  type: 'fade' | 'slide' | 'bounce';
  duration: number;
  delay: number;
}

export interface FormulaAnimation {
  type: 'fade' | 'slide' | 'bounce';
  duration: number;
  delay: number;
}

export interface VideoEffect {
  type: 'blur' | 'sharpen' | 'colorize' | 'contrast' | 'brightness';
  params: Record<string, number>;
}

export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  fps: number;
  format: string;
  size: number;
  bitrate: number;
}

export interface VideoGenerationResult {
  filePath: string;
  metadata: VideoMetadata;
  processingTime: number;
  cost: number;
}

export interface VideoProcessingResult {
  filePath: string;
  metadata: VideoMetadata;
  processingTime: number;
  effects: VideoEffect[];
} 