declare module 'get-video-metadata' {
  export interface VideoMetadata {
    duration?: number;
    width?: number;
    height?: number;
    fps?: number;
    format?: string;
    bitrate?: number;
    size?: number;
    codec?: string;
    audioCodec?: string;
    videoCodec?: string;
    audioBitrate?: number;
    videoBitrate?: number;
    audioChannels?: number;
    audioSampleRate?: number;
    rotation?: number;
    aspectRatio?: number;
    container?: string;
    containerFormat?: string;
    containerFormatLong?: string;
    startTime?: number;
    endTime?: number;
    chapters?: Array<{
      id: number;
      start: number;
      end: number;
      title: string;
    }>;
    streams?: Array<{
      index: number;
      codec: string;
      codecLong: string;
      type: string;
      language?: string;
      bitrate?: number;
      sampleRate?: number;
      channels?: number;
      width?: number;
      height?: number;
      fps?: number;
      aspectRatio?: number;
      rotation?: number;
    }>;
  }

  export function getVideoMetadata(filePath: string): Promise<VideoMetadata>;
} 