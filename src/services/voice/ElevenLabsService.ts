import type { IVoiceService, VoiceSynthesisOptions, AudioSegment } from '../interfaces/IVoiceService.js';
import { AudioProcessor, AudioProcessingOptions } from '../../utils/audio.js';
import { AudioEnhancer, AudioEnhancementOptions } from '../../utils/audioEffects.js';
import { logger } from '../../utils/logger.js';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import { spawn } from 'child_process';

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

export interface VoiceConfig {
  voiceId: string;
  name: string;
  style?: number;
  stability?: number;
  similarity_boost?: number;
  speaking_rate?: number;
  description?: string;
}

export class ElevenLabsService implements IVoiceService {
  private readonly audioProcessor: AudioProcessor;
  private readonly audioEnhancer: AudioEnhancer;
  private backgroundMusic?: Buffer;
  private voiceMap: Map<string, VoiceConfig> = new Map([
    ['host', {
      voiceId: 'ErXwobaYiN019PkySvjV',  // Antoni's voice ID
      name: 'Antoni',
      style: 0.65,
      stability: 0.55,
      speaking_rate: 1.1,
      description: 'Host - warm, engaging'
    }],
    ['expert', {
      voiceId: '21m00Tcm4TlvDq8ikWAM',  // Rachel's voice ID for Charlotte
      name: 'Charlotte',
      style: 0.45,
      stability: 0.75,
      speaking_rate: 0.95,
      description: 'Expert - technical, precise'
    }],
    ['copernicus', {
      voiceId: '5KCLtmjBQSL8p6gtQvcj',  // Gary hoarse voice ID
      name: 'Copernicus',
      style: 0.70,
      stability: 0.60,
      speaking_rate: 0.90,
      description: 'Historical perspective - wise, authoritative'
    }]
  ]);

  constructor(
    private apiKey: string,
    private processingOptions: AudioProcessingOptions = {},
    private enhancementOptions: AudioEnhancementOptions = {}
  ) {
    this.audioProcessor = new AudioProcessor();
    this.audioEnhancer = new AudioEnhancer();
  }

  private async convertToMp3(inputBuffer: Buffer): Promise<Buffer> {
    try {
      // Create temporary files
      const tempInputFile = path.join(os.tmpdir(), `input-${Date.now()}.mp3`);
      const tempOutputFile = path.join(os.tmpdir(), `output-${Date.now()}.mp3`);

      // Write input buffer to temp file
      await fs.writeFile(tempInputFile, inputBuffer);

      return new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', [
          '-i', tempInputFile,
          '-f', 'mp3',
          '-acodec', 'libmp3lame',
          '-ab', '192k',
          '-ar', '44100',
          '-ac', '1',
          '-y',
          tempOutputFile
        ]);

        let errorMessage = '';

        ffmpeg.stderr.on('data', chunk => errorMessage += chunk.toString());
        
        ffmpeg.on('error', (err) => {
          reject(new Error(`FFmpeg error: ${err.message}`));
        });

        ffmpeg.on('close', async (code) => {
          try {
            if (code === 0) {
              const outputBuffer = await fs.readFile(tempOutputFile);
              resolve(outputBuffer);
            } else {
              reject(new Error(`FFmpeg failed with code ${code}: ${errorMessage}`));
            }
          } catch (error) {
            reject(error);
          } finally {
            // Clean up temp files
            fs.unlink(tempInputFile).catch(() => {});
            fs.unlink(tempOutputFile).catch(() => {});
          }
        });
      });
    } catch (error) {
      logger.error('Error in convertToMp3:', error);
      throw error;
    }
  }

  async synthesize(
    text: string,
    options: VoiceSynthesisOptions
  ): Promise<AudioSegment> {
    try {
      logger.info('Synthesizing speech with ElevenLabs:', options);
      
      const voiceConfig = this.voiceMap.get(options.model) || this.voiceMap.get('en_US-male-medium')!;
      
      // Log full text being sent
      console.log('Full text being sent to ElevenLabs:', text);

      const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${voiceConfig.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mp3',
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: this.getVoiceSettings(options.model)
        })
      });

      // Debug: Log the response
      console.log('Response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Full error response:', errorText);
        throw new Error(`Speech synthesis failed: ${response.statusText} - ${errorText}`);
      }

      let audioData = Buffer.from(await response.arrayBuffer());
      console.log('Received audio data size:', audioData.length);

      // Convert the audio to proper MP3 format
      audioData = await this.convertToMp3(audioData);
      console.log('Converted MP3 size:', audioData.length);

      const duration = await this.getAudioDuration(audioData);
      console.log('Audio duration:', duration);

      return {
        audioData,
        duration,
        speaker: options.model
      };
    } catch (error) {
      logger.error('Error in speech synthesis:', error);
      throw error;
    }
  }

  async setBackgroundMusic(musicBuffer: Buffer) {
    this.backgroundMusic = musicBuffer;
  }

  async combineAudio(segments: AudioSegment[]): Promise<Buffer> {
    try {
      const tempDir = path.join(os.tmpdir(), `podcast-${Date.now()}`);
      await fs.mkdir(tempDir, { recursive: true });
      
      // Write each segment to a temporary file
      const tempFiles = await Promise.all(segments.map(async (segment, index) => {
        const tempFile = path.join(tempDir, `segment-${index}.mp3`);
        await fs.writeFile(tempFile, segment.audioData);
        return tempFile;
      }));

      // Create concat file list
      const listFile = path.join(tempDir, 'files.txt');
      const fileList = tempFiles.map(f => `file '${f}'`).join('\n');
      await fs.writeFile(listFile, fileList);


      // Output file
      const outputFile = path.join(tempDir, 'output.mp3');

      // Simpler ffmpeg command without background music
      const ffmpegArgs = [
        '-f', 'concat',
        '-safe', '0',
        '-i', listFile,
        '-c:a', 'libmp3lame',
        '-q:a', '2',
        outputFile
      ];

      return new Promise((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', ffmpegArgs);

        let errorMessage = '';
        ffmpeg.stderr.on('data', chunk => {
          const msg = chunk.toString();
          errorMessage += msg;
          console.log('FFmpeg:', msg);
        });

        ffmpeg.on('close', async (code) => {
          try {
            if (code === 0) {
              const outputBuffer = await fs.readFile(outputFile);
              resolve(outputBuffer);
            } else {
              console.error('FFmpeg error:', errorMessage);
              reject(new Error(`FFmpeg failed with code ${code}: ${errorMessage}`));
            }
          } finally {
            // Clean up
            Promise.all([
              ...tempFiles.map(f => fs.unlink(f).catch(() => {})),
              fs.unlink(listFile).catch(() => {}),
              fs.unlink(outputFile).catch(() => {}),
              fs.rmdir(tempDir).catch(() => {})
            ]).catch(() => {});
          }
        });
      });
    } catch (error) {
      console.error('Error combining audio:', error);
      throw error;
    }
  }

  private async getAudioDuration(audioData: Buffer): Promise<number> {
    try {
      // Write buffer to temporary file
      const tempFile = path.join(os.tmpdir(), `temp-${Date.now()}.mp3`);
      await fs.writeFile(tempFile, audioData);
      
      // Get duration
      const duration = await getAudioDurationInSeconds(tempFile);
      
      // Clean up
      await fs.unlink(tempFile);
      
      return duration;
    } catch (error) {
      logger.error('Error getting audio duration:', error);
      // Fallback to rough estimation
      return Math.ceil(audioData.length / 32000);
    }
  }

  // Customize voice settings based on speaker
  private getVoiceSettings(model: string) {
    const voiceConfig = this.voiceMap.get(model) || this.voiceMap.get('en_US-male-medium')!;
    return {
      stability: voiceConfig.stability || 0.68,          // Balanced
      similarity_boost: voiceConfig.similarity_boost || 0.72,    // Clear
      style: voiceConfig.style || 0.40,              // Engaging
      speaking_rate: voiceConfig.speaking_rate || 0.95,      // Natural pace
    };
  }

  // Method to add/update voices
  public setVoice(key: string, config: VoiceConfig) {
    this.voiceMap.set(key, config);
  }

  // Method to get available voices
  public getAvailableVoices(): Map<string, VoiceConfig> {
    return new Map(this.voiceMap);
  }

  // New method for generating complete podcast episodes
  async generatePodcastEpisode(topic: string, outline: string) {
    const script = await this.generateScript(topic, outline);
    const segments = await this.generateAudioSegments(script);
    return this.combineSegments(segments);
  }

  // Generate podcast script using ElevenLabs' AI
  private async generateScript(topic: string, outline: string) {
    try {
      const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${this.voiceMap.get('host')?.voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: `Create a podcast script about ${topic}. 
                Use this outline: ${outline}
                
                Format as dialogue between three speakers:
                Antoni: [Host's lines]
                Charlotte: [Expert's lines]
                Copernicus: [Historical perspective lines]`,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Script generation failed: ${response.statusText}`);
      }

      const result = await response.text();
      console.log('Generated script:', result);

      // Ensure we have a valid script
      if (!result || typeof result !== 'string') {
        throw new Error('Invalid script generated');
      }

      return result;
    } catch (error) {
      console.error('Error generating script:', error);
      // Return a fallback script
      return `
        Antoni: Welcome to our podcast about ${topic}. Today we're exploring some fascinating concepts.
        Charlotte: Let's dive into the technical details.
        Copernicus: And I'll provide some historical context.
      `;
    }
  }

  // Generate audio for each segment with appropriate voice
  private async generateAudioSegments(script: string) {
    if (!script) {
      throw new Error('No script provided for audio generation');
    }

    console.log('Processing script:', script);

    // Split by speaker markers
    const segments = script.split(/\n(?=(?:Antoni|Charlotte|Copernicus):)/);
    console.log('Found segments:', segments.length);

    const audioSegments = [];

    for (const segment of segments) {
      if (!segment.trim()) continue;

      // Determine speaker
      let speaker = 'host';
      if (segment.trim().startsWith('Charlotte:')) {
        speaker = 'expert';
      } else if (segment.trim().startsWith('Copernicus:')) {
        speaker = 'copernicus';
      }

      const voice = this.voiceMap.get(speaker)!;
      console.log(`Generating audio for ${speaker} with voice ${voice.voiceId}`);

      const audio = await this.synthesize(segment, {
        model: speaker,
        speed: voice.speaking_rate
      });

      audioSegments.push(audio);
    }

    return audioSegments;
  }
} 