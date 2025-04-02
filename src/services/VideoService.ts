import { AbstractBaseService } from './BaseService';
import { ServiceOptions, ServiceResult } from '../types/service';
import {
  VideoServiceConfig,
  VideoGenerationOptions,
  VideoProcessingOptions,
  VideoGenerationResult,
  VideoProcessingResult,
  VideoMetadata,
  VideoEffect,
  VideoTransition,
  TextStyle,
  FormulaStyle,
  TextAnimation,
  FormulaAnimation
} from '../types/video';
import { VideoProcessingError } from '../utils/errors';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { getVideoMetadata } from 'get-video-metadata';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

type TextWithStyle = Required<VideoGenerationOptions>['text'][number] & { style: Required<TextStyle> };
type FormulaWithStyle = Required<VideoGenerationOptions>['formulas'][number] & { style: Required<FormulaStyle> };

/**
 * Video service implementation
 */
export class VideoService extends AbstractBaseService {
  protected config: VideoServiceConfig;

  constructor(options: ServiceOptions) {
    super(options);
    this.config = options.config as VideoServiceConfig;
  }

  /**
   * Generate video from audio and images
   */
  async generateVideo(options: VideoGenerationOptions): Promise<ServiceResult<VideoGenerationResult>> {
    const startTime = Date.now();

    try {
      // Create output file path
      const fileName = `video_${Date.now()}.${this.config.video.format}`;
      const outputPath = path.join(this.config.video.outputDir, fileName);

      // Create FFmpeg command
      let command = ffmpeg();

      // Add audio input
      command = command.input(options.audioPath);

      // Add image inputs with transitions
      for (const image of options.images) {
        command = command.input(image.path);
      }

      // Create complex filter for image transitions
      const filterComplex = this.createImageTransitions(options.images);
      command = command.complexFilter(filterComplex);

      // Add text overlays
      if (options.text) {
        for (const text of options.text) {
          command = this.addTextOverlay(command, text);
        }
      }

      // Add formula overlays
      if (options.formulas) {
        for (const formula of options.formulas) {
          command = await this.addFormulaOverlay(command, formula);
        }
      }

      // Set output format and quality
      command = command
        .videoCodec(this.config.video.format === 'mp4' ? 'libx264' : 'libvpx-vp9')
        .videoBitrate(this.config.video.quality * 1000)
        .size(`${this.config.video.width}x${this.config.video.height}`)
        .fps(this.config.video.fps)
        .audioCodec('aac')
        .audioBitrate(192000);

      // Execute FFmpeg command
      await new Promise<void>((resolve, reject) => {
        command
          .save(outputPath)
          .on('end', () => resolve())
          .on('error', reject);
      });

      // Get video metadata
      const metadata = await this.getVideoMetadata(outputPath);

      return {
        success: true,
        data: {
          filePath: outputPath,
          metadata,
          processingTime: Date.now() - startTime,
          cost: this.calculateCost(metadata.size)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: new VideoProcessingError(
          'Failed to generate video',
          'export',
          error
        )
      };
    }
  }

  /**
   * Process video with effects and enhancements
   */
  async processVideo(
    inputPath: string,
    options: VideoProcessingOptions
  ): Promise<ServiceResult<VideoProcessingResult>> {
    const startTime = Date.now();

    try {
      // Create output file path
      const fileName = path.basename(inputPath, path.extname(inputPath));
      const outputPath = path.join(
        this.config.video.outputDir,
        `${fileName}_processed.${this.config.video.format}`
      );

      // Create FFmpeg command
      let command = ffmpeg(inputPath);

      // Apply processing options
      if (options.trim) {
        command = command.setStartTime(options.trim.start).setDuration(options.trim.end - options.trim.start);
      }

      if (options.resize) {
        command = command.size(`${options.resize.width}x${options.resize.height}`);
      }

      if (options.crop) {
        command = command.videoFilters([
          `crop=${options.crop.width}:${options.crop.height}:${options.crop.x}:${options.crop.y}`
        ]);
      }

      if (options.rotate) {
        command = command.videoFilters([`rotate=${options.rotate}`]);
      }

      // Apply video effects
      if (options.effects) {
        for (const effect of options.effects) {
          command = this.applyVideoEffect(command, effect);
        }
      }

      // Set output format and quality
      command = command
        .videoCodec(this.config.video.format === 'mp4' ? 'libx264' : 'libvpx-vp9')
        .videoBitrate(this.config.video.quality * 1000)
        .fps(this.config.video.fps);

      // Execute FFmpeg command
      await new Promise<void>((resolve, reject) => {
        command
          .save(outputPath)
          .on('end', () => resolve())
          .on('error', reject);
      });

      // Get processed video metadata
      const metadata = await this.getVideoMetadata(outputPath);

      return {
        success: true,
        data: {
          filePath: outputPath,
          metadata,
          processingTime: Date.now() - startTime,
          effects: options.effects || []
        }
      };
    } catch (error) {
      return {
        success: false,
        error: new VideoProcessingError(
          'Failed to process video',
          'export',
          error
        )
      };
    }
  }

  /**
   * Create complex filter for image transitions
   */
  private createImageTransitions(images: VideoGenerationOptions['images']): string {
    const filters: string[] = [];
    let currentTime = 0;

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const transition = image.transition || { type: 'fade', duration: 1 };

      if (i === 0) {
        filters.push(`[0:v]scale=${this.config.video.width}:${this.config.video.height}:force_original_aspect_ratio=decrease,pad=${this.config.video.width}:${this.config.video.height}:(ow-iw)/2:(oh-ih)/2[v0]`);
      } else {
        const prevIndex = i - 1;
        const currentIndex = i;

        switch (transition.type) {
          case 'fade':
            filters.push(
              `[${currentIndex + 1}:v]scale=${this.config.video.width}:${this.config.video.height}:force_original_aspect_ratio=decrease,pad=${this.config.video.width}:${this.config.video.height}:(ow-iw)/2:(oh-ih)/2[v${currentIndex}]`,
              `[v${prevIndex}][v${currentIndex}]xfade=transition=fade:duration=${transition.duration}:offset=${currentTime}[v${currentIndex + 1}]`
            );
            break;
          case 'slide':
            const direction = transition.direction || 'right';
            const slideFilter = this.getSlideFilter(direction, transition.duration);
            filters.push(
              `[${currentIndex + 1}:v]scale=${this.config.video.width}:${this.config.video.height}:force_original_aspect_ratio=decrease,pad=${this.config.video.width}:${this.config.video.height}:(ow-iw)/2:(oh-ih)/2[v${currentIndex}]`,
              `[v${prevIndex}][v${currentIndex}]${slideFilter}[v${currentIndex + 1}]`
            );
            break;
          case 'zoom':
            filters.push(
              `[${currentIndex + 1}:v]scale=${this.config.video.width}:${this.config.video.height}:force_original_aspect_ratio=decrease,pad=${this.config.video.width}:${this.config.video.height}:(ow-iw)/2:(oh-ih)/2[v${currentIndex}]`,
              `[v${prevIndex}][v${currentIndex}]xfade=transition=zoom:duration=${transition.duration}:offset=${currentTime}[v${currentIndex + 1}]`
            );
            break;
          case 'wipe':
            const wipeDirection = transition.direction || 'right';
            const wipeFilter = this.getWipeFilter(wipeDirection, transition.duration);
            filters.push(
              `[${currentIndex + 1}:v]scale=${this.config.video.width}:${this.config.video.height}:force_original_aspect_ratio=decrease,pad=${this.config.video.width}:${this.config.video.height}:(ow-iw)/2:(oh-ih)/2[v${currentIndex}]`,
              `[v${prevIndex}][v${currentIndex}]${wipeFilter}[v${currentIndex + 1}]`
            );
            break;
        }
      }

      currentTime += image.duration;
    }

    return filters.join(';');
  }

  /**
   * Get slide transition filter
   */
  private getSlideFilter(direction: string, duration: number): string {
    switch (direction) {
      case 'left':
        return `xfade=transition=slideleft:duration=${duration}`;
      case 'right':
        return `xfade=transition=slideright:duration=${duration}`;
      case 'up':
        return `xfade=transition=slideup:duration=${duration}`;
      case 'down':
        return `xfade=transition=slidedown:duration=${duration}`;
      default:
        return `xfade=transition=slideright:duration=${duration}`;
    }
  }

  /**
   * Get wipe transition filter
   */
  private getWipeFilter(direction: string, duration: number): string {
    switch (direction) {
      case 'left':
        return `xfade=transition=wipeleft:duration=${duration}`;
      case 'right':
        return `xfade=transition=wiperight:duration=${duration}`;
      case 'up':
        return `xfade=transition=wipeup:duration=${duration}`;
      case 'down':
        return `xfade=transition=wipedown:duration=${duration}`;
      default:
        return `xfade=transition=wiperight:duration=${duration}`;
    }
  }

  /**
   * Add text overlay to video
   */
  private addTextOverlay(
    command: ffmpeg.FfmpegCommand,
    text: Required<VideoGenerationOptions>['text'][number]
  ): ffmpeg.FfmpegCommand {
    const style = text.style || {
      font: 'Arial',
      size: 24,
      color: 'white',
      alignment: 'center',
      position: { x: 0, y: 0 }
    };

    const filter = `drawtext=text='${text.content}':fontfile=${style.font}:fontsize=${style.size}:fontcolor=${style.color}:x=${style.position.x}:y=${style.position.y}:enable='between(t,${text.startTime},${text.startTime + text.duration})'`;

    if (style.animation) {
      const animation = this.getTextAnimationFilter(style.animation);
      return command.complexFilter([filter, animation]);
    }

    return command.complexFilter(filter);
  }

  /**
   * Add formula overlay to video
   */
  private async addFormulaOverlay(
    command: ffmpeg.FfmpegCommand,
    formula: Required<VideoGenerationOptions>['formulas'][number]
  ): Promise<ffmpeg.FfmpegCommand> {
    const style = formula.style || {
      size: 24,
      color: 'white',
      position: { x: 0, y: 0 }
    };

    // Generate formula image using LaTeX
    const tempPath = path.join(this.config.video.tempDir, `formula_${Date.now()}.png`);
    await this.generateFormulaImage(formula.latex, style, tempPath);

    const filter = `movie=filename=${tempPath}:format=image2:enable='between(t,${formula.startTime},${formula.startTime + formula.duration})':overlay=${style.position.x}:${style.position.y}`;

    if (style.animation) {
      const animation = this.getFormulaAnimationFilter(style.animation);
      return command.complexFilter([filter, animation]);
    }

    return command.complexFilter(filter);
  }

  /**
   * Generate formula image using LaTeX
   */
  private async generateFormulaImage(
    latex: string,
    style: FormulaStyle,
    outputPath: string
  ): Promise<void> {
    const template = `
      \\documentclass[12pt]{article}
      \\usepackage{amsmath}
      \\usepackage{amssymb}
      \\usepackage{color}
      \\begin{document}
      \\fontsize{${style.size}}{${style.size * 1.2}}
      \\color{${style.color}}
      ${latex}
      \\end{document}
    `;

    const texPath = path.join(this.config.video.tempDir, `formula_${Date.now()}.tex`);
    await fs.promises.writeFile(texPath, template);

    // Compile LaTeX to PDF
    await execAsync(`pdflatex -output-directory ${this.config.video.tempDir} ${texPath}`);

    // Convert PDF to PNG
    const pdfPath = texPath.replace('.tex', '.pdf');
    await execAsync(`convert -density 300 ${pdfPath} ${outputPath}`);
  }

  /**
   * Get text animation filter
   */
  private getTextAnimationFilter(animation: TextAnimation): string {
    switch (animation.type) {
      case 'fade':
        return `fade=t=in:st=${animation.delay}:d=${animation.duration}`;
      case 'slide':
        return `slide=slide=right:st=${animation.delay}:d=${animation.duration}`;
      case 'bounce':
        return `bounce=st=${animation.delay}:d=${animation.duration}`;
      default:
        return `fade=t=in:st=${animation.delay}:d=${animation.duration}`;
    }
  }

  /**
   * Get formula animation filter
   */
  private getFormulaAnimationFilter(animation: FormulaAnimation): string {
    switch (animation.type) {
      case 'fade':
        return `fade=t=in:st=${animation.delay}:d=${animation.duration}`;
      case 'slide':
        return `slide=slide=right:st=${animation.delay}:d=${animation.duration}`;
      case 'bounce':
        return `bounce=st=${animation.delay}:d=${animation.duration}`;
      default:
        return `fade=t=in:st=${animation.delay}:d=${animation.duration}`;
    }
  }

  /**
   * Apply video effect using FFmpeg
   */
  private applyVideoEffect(
    command: ffmpeg.FfmpegCommand,
    effect: VideoEffect
  ): ffmpeg.FfmpegCommand {
    switch (effect.type) {
      case 'blur':
        return command.videoFilters(`boxblur=${effect.params.radius || 5}:${effect.params.power || 1}`);
      case 'sharpen':
        return command.videoFilters(`unsharp=${effect.params.amount || 1}:${effect.params.lx || 3}:${effect.params.ly || 3}`);
      case 'colorize':
        return command.videoFilters(`colorbalance=rs=${effect.params.red || 0}:gs=${effect.params.green || 0}:bs=${effect.params.blue || 0}`);
      case 'contrast':
        return command.videoFilters(`eq=contrast=${effect.params.value || 1}`);
      case 'brightness':
        return command.videoFilters(`eq=brightness=${effect.params.value || 0}`);
      default:
        return command;
    }
  }

  /**
   * Get video metadata
   */
  private async getVideoMetadata(filePath: string): Promise<VideoMetadata> {
    const stats = await fs.promises.stat(filePath);
    const metadata = await getVideoMetadata(filePath);

    return {
      duration: metadata.duration || 0,
      width: metadata.width || this.config.video.width,
      height: metadata.height || this.config.video.height,
      fps: this.config.video.fps,
      format: this.config.video.format,
      size: stats.size,
      bitrate: Math.round((stats.size * 8) / (metadata.duration || 1))
    };
  }

  /**
   * Calculate cost based on video size
   */
  private calculateCost(bytes: number): number {
    // Video processing cost: $0.0001 per MB
    return (bytes / (1024 * 1024)) * 0.0001;
  }

  /**
   * Validate service configuration
   */
  async validate(): Promise<void> {
    await super.validate();

    // Validate output directory
    if (!fs.existsSync(this.config.video.outputDir)) {
      await fs.promises.mkdir(this.config.video.outputDir, { recursive: true });
    }

    // Validate temp directory
    if (!fs.existsSync(this.config.video.tempDir)) {
      await fs.promises.mkdir(this.config.video.tempDir, { recursive: true });
    }

    // Validate FFmpeg configuration
    if (!this.config.ffmpeg.path) {
      throw new VideoProcessingError(
        'Missing FFmpeg path',
        'export'
      );
    }

    // Validate video settings
    if (this.config.video.width < 640 || this.config.video.width > 3840) {
      throw new VideoProcessingError(
        'Invalid video width',
        'export'
      );
    }

    if (this.config.video.height < 480 || this.config.video.height > 2160) {
      throw new VideoProcessingError(
        'Invalid video height',
        'export'
      );
    }

    if (this.config.video.fps < 24 || this.config.video.fps > 60) {
      throw new VideoProcessingError(
        'Invalid video FPS',
        'export'
      );
    }
  }
} 