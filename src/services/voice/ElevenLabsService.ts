import { IVoiceService, VoiceSynthesisOptions, VoiceConfig, VoiceSettings } from "../../types/voice.js"; 
import { AudioResult, AudioSegment, AudioEnhancementOptions, AudioProcessingOptions } from "../../types/audio.js"; 
import {
  AudioProcessor,
  AudioEnhancer,
} from "../../utils/audioEffects.js";
import { Logger } from "../../utils/logger.js"; 
import { getAudioDurationInSeconds } from "get-audio-duration";
import path from "path";
import os from "os";
import fs from "fs-extra"; // Use fs-extra for remove
import { spawn } from "child_process";
import { execFileAsync } from "../../utils/execFileAsync.js";
import { v4 as uuidv4 } from "uuid";

const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1";

interface ElevenLabsVoiceSettings extends VoiceSettings {
  stability?: number;
  similarity_boost?: number;
  style?: number;
  use_speaker_boost?: boolean;
}

interface ElevenLabsVoiceConfig extends Omit<VoiceConfig, 'settings'> { 
  provider: "elevenlabs";
  settings?: ElevenLabsVoiceSettings; 
}

interface Voice {
  voice_id: string;
  name: string;
  category: string;
  labels: Record<string, string>;
  settings?: {
    stability: number;
    similarity_boost: number;
  };
  description?: string;
}

export class ElevenLabsService implements IVoiceService { 
  private readonly audioProcessor: AudioProcessor;
  private readonly audioEnhancer: AudioEnhancer;
  private backgroundMusic?: Buffer;
  private voiceMap: Map<string, ElevenLabsVoiceConfig> = new Map(); 
  private defaultVoiceId: string = "pNInz6obpgDQGcFmaJgB"; 
  private readonly logger: Logger;

  private static readonly HARDCODED_VOICES: Record<string, ElevenLabsVoiceConfig> = {
      host: { provider: "elevenlabs", voiceId: "pNInz6obpgDQGcFmaJgB", settings: { stability: 0.5, similarity_boost: 0.75 } }, 
      cohost: { provider: "elevenlabs", voiceId: "EXAVITQu4vr4xnSDxMaL", settings: { stability: 0.5, similarity_boost: 0.75 } }, 
      guest: { provider: "elevenlabs", voiceId: "21m00Tcm4TlvDq8ikWAM", settings: { stability: 0.5, similarity_boost: 0.75 } }, 
  };

  constructor(
    private apiKey: string,
    private processingOptions: AudioProcessingOptions = {},
    private enhancementOptions: AudioEnhancementOptions = {},
    loggerInstance: Logger 
  ) {
    this.audioProcessor = new AudioProcessor(loggerInstance); 
    this.audioEnhancer = new AudioEnhancer(loggerInstance);   
    this.logger = loggerInstance; 
    this.initializeVoiceMap();
    this.logger.info("ElevenLabsService initialized.");
  }

  private initializeVoiceMap(): void {
    this.logger.debug("Initializing voice map with hardcoded voices.");
    for (const [role, config] of Object.entries(ElevenLabsService.HARDCODED_VOICES)) {
        this.voiceMap.set(role, config);
    }
    this.logger.info(`Voice map initialized with ${this.voiceMap.size} roles.`);
  }

  /**
   * Creates a silent MP3 audio file of a specified duration using FFmpeg.
   * @param filePath The absolute path where the silent audio file will be saved.
   * @param durationSeconds The duration of the silence in seconds.
   * @private
   */
  private async createSilentAudio(filePath: string, durationSeconds: number): Promise<void> {
    this.logger.debug(`Creating silent audio file at: ${filePath} with duration: ${durationSeconds}s`);
    const ffmpegArgs = [
      '-f', 'lavfi',          // Input format: libavfilter graph
      '-i', `anullsrc=r=44100:cl=mono`, // Input source: null audio, 44.1kHz, mono
      '-t', `${durationSeconds}`, // Duration
      '-q:a', '5',              // Quality for VBR MP3 (approx 130kbps)
      '-acodec', 'libmp3lame',  // Output codec: MP3
      '-y',                    // Overwrite output file if it exists
      filePath                 // Output file path
    ];

    try {
      const { stdout, stderr } = await execFileAsync('ffmpeg', ffmpegArgs);
      this.logger.info(`Successfully created silent audio file: ${filePath}`);
      if (stdout) this.logger.debug(`ffmpeg stdout (silent audio): ${stdout}`);
      if (stderr) this.logger.debug(`ffmpeg stderr (silent audio): ${stderr}`);
    } catch (error: unknown) {
      let errorMessage = `Failed to create silent audio file ${filePath}.`;
      if (error instanceof Error) {
        errorMessage = `FFmpeg failed to create silent audio: ${error.message}`;
        const errorDetails = error as Error & { stderr?: string };
        if (errorDetails.stderr) errorMessage += `\nStderr: ${errorDetails.stderr}`;
      } else {
        errorMessage = `FFmpeg failed to create silent audio: ${String(error)}`;
      }
      this.logger.error(errorMessage);
      throw new Error(errorMessage); // Re-throw to signal failure
    }
  }

  private getVoiceConfig(role?: string): ElevenLabsVoiceConfig {
    const roleKey = role || 'host'; 
    const config = this.voiceMap.get(roleKey);
    if (config) {
      this.logger.debug(`getVoiceConfig: Found config for role "${roleKey}": voiceId ${config.voiceId}`);
      return config;
    } else {
      this.logger.warn(`getVoiceConfig: No config found for role "${roleKey}". Falling back to default voiceId ${this.defaultVoiceId}.`);
      // Fallback to default voice ID with default settings
      return { provider: "elevenlabs", voiceId: this.defaultVoiceId, settings: { stability: 0.5, similarity_boost: 0.75 } };
    }
  }

  async listAvailableVoices(): Promise<Voice[]> {
    if (!this.apiKey) {
        this.logger.error("listAvailableVoices: API key is missing.");
        throw new Error("ElevenLabs API key is not configured.");
    }
    this.logger.info("Fetching available voices from ElevenLabs API...");
    try {
        const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "xi-api-key": this.apiKey,
            },
        });

        this.logger.debug(`listAvailableVoices: API response status: ${response.status}`);

        if (!response.ok) {
            const errorBody = await response.text();
            this.logger.error(`listAvailableVoices: Failed to fetch voices: ${response.status} ${response.statusText} - ${errorBody}`);
            throw new Error(`Failed to list voices: ${response.statusText} - ${errorBody}`);
        }

        const data = await response.json();
        const voicesData = (data as { voices?: Voice[] })?.voices;
        if (!voicesData || !Array.isArray(voicesData)) {
          this.logger.warn("No voices array found or invalid format in ElevenLabs API response.");
        }
        this.logger.info(`listAvailableVoices: Successfully fetched ${voicesData?.length || 0} voices.`);
        return voicesData || [];
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        this.logger.error(`listAvailableVoices: Error fetching voices: ${message}`);
        throw new Error(`Error listing available voices: ${message}`);
    }
  }

  async synthesize(
    text: string,
    options: VoiceSynthesisOptions,
  ): Promise<AudioSegment> {
      let voiceConfig: ElevenLabsVoiceConfig;
      if (options.voiceConfig && (options.voiceConfig as any)?.provider === 'elevenlabs') {
        // Ensure the passed config matches our specific ElevenLabs config type
        voiceConfig = options.voiceConfig as ElevenLabsVoiceConfig; 
        this.logger.info(`Using provided ElevenLabs voice config: ${voiceConfig.voiceId}`);
      } else {
        this.logger.warn(`No specific ElevenLabs voice config provided or provider mismatch. Using default.`);
        voiceConfig = this.voiceMap['narrator'] || { // Default to narrator or the service default
          provider: "elevenlabs", 
          voiceId: this.defaultVoiceId, // Use the class default ID
          settings: { stability: 0.5, similarity_boost: 0.75 } // Use explicit default settings
        };
      }

      const settings = { ...{ stability: 0.5, similarity_boost: 0.75 }, ...voiceConfig.settings }; // Ensure base defaults
      const voiceId = voiceConfig.voiceId;
      const modelId = (voiceConfig as any).modelId || "eleven_multilingual_v2"; // Get modelId from config or default

      if (!voiceId) {
          this.logger.error("synthesize: No valid voiceId provided or determined.");
          throw new Error("Voice ID is required for synthesis.");
      }
      if (!this.apiKey) {
           this.logger.error("synthesize: ElevenLabs API key is not configured.");
           throw new Error("ElevenLabs API key is missing.");
      }

       this.logger.info(`synthesize: Starting synthesis for voiceId: ${voiceId}`);
       // Avoid logging full text in production if it's sensitive or very long
       this.logger.debug(`synthesize: Text snippet: "${text.substring(0, 80)}..." (Length: ${text.length})`);
       this.logger.debug(`synthesize: Voice settings: ${JSON.stringify(settings)}`);

      try {
          const requestBody = {
              text: text,
              // Use a model compatible with the voice, default if needed
              model_id: modelId,
              voice_settings: settings,
          };
          this.logger.debug(`synthesize: API request body: ${JSON.stringify(requestBody)}`);

          // Request specific MP3 format for consistency
          const apiUrl = `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}?output_format=mp3_44100_128`;
          this.logger.debug(`synthesize: Requesting URL: ${apiUrl}`);

          const response = await fetch(apiUrl, {
              method: "POST",
              headers: {
                  "Accept": "audio/mpeg", 
                  "Content-Type": "application/json",
                  "xi-api-key": this.apiKey,
              },
              body: JSON.stringify(requestBody),
          });

          this.logger.debug(`synthesize: API response status: ${response.status}`);
          // Log response headers for debugging rate limits or other issues
          // response.headers.forEach((value, name) => {
          //   this.logger.debug(`synthesize: Response Header - ${name}: ${value}`);
          // });


          if (!response.ok) {
              let errorBody = "Could not read error body.";
              try {
                errorBody = await response.text();
              } catch (e) {}
              this.logger.error(`synthesize: ElevenLabs API error: ${response.status} ${response.statusText} - Body: ${errorBody}`);
              // Check for specific rate limit error
              if (response.status === 429) {
                  this.logger.warn("synthesize: Rate limit hit. Consider adding retry logic or pausing.");
              }
              throw new Error(`ElevenLabs API Error: ${response.status} ${response.statusText} - ${errorBody}`);
          }

          if (!response.body) {
             this.logger.error("synthesize: API response body is null.");
             throw new Error("ElevenLabs API returned an empty response body.");
          }

          // Convert ReadableStream to Buffer
          const reader = response.body.getReader();
          const chunks: Uint8Array[] = [];
          let totalLength = 0;

           while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              if (value) {
                 chunks.push(value);
                 totalLength += value.length;
              }
           }
           await reader.releaseLock(); 

           const audioBuffer = Buffer.concat(chunks, totalLength);
           this.logger.info(`synthesize: Received audio buffer, size: ${audioBuffer.length} bytes`);

           if (audioBuffer.length === 0) {
               this.logger.warn("synthesize: Received empty audio buffer from ElevenLabs. This might indicate an issue with the request or API.");
               // Returning an empty segment might be problematic downstream.
               throw new Error("Synthesized audio buffer is empty.");
           }

          // --- Get duration using ffprobe (more reliable) ---
          let duration = 0;
          const tempDir = path.join(os.tmpdir(), "copernicus-duration", uuidv4());
          await fs.ensureDir(tempDir);
          const tempFilePath = path.join(tempDir, `${uuidv4()}.mp3`);
          try {
            await fs.writeFile(tempFilePath, audioBuffer);
            duration = await getAudioDurationInSeconds(tempFilePath); // Pass file path
            this.logger.info(`synthesize: Calculated duration via ffprobe: ${duration} seconds`);
          } catch (durationError: unknown) {
            const errorMsg = durationError instanceof Error ? durationError.message : String(durationError);
            this.logger.error(`synthesize: Could not get audio duration via ffprobe: ${errorMsg}.`);
            // Decide if this is critical - perhaps throw error?
            // For now, we'll proceed with duration 0 but log the error.
          } finally {
            // Clean up temporary file and directory
            await fs.remove(tempDir).catch(cleanupError => {
              this.logger.warn(`Failed to cleanup duration temp directory: ${tempDir}`, cleanupError);
            });
          }

          // --- Construct AudioSegment ---
          const audioSegment: AudioSegment = {
              buffer: audioBuffer,
              format: "mp3", 
              sampleRate: 44100, 
              channels: 1, 
              duration: duration, 
              voiceId: voiceId, 
              text: text 
          };

          this.logger.info(`synthesize: Successfully synthesized audio segment for voice ${voiceId}. Duration: ${duration}s`);
          return audioSegment;

      } catch (error: unknown) {
           const message = error instanceof Error ? error.message : String(error);
           this.logger.error(`synthesize: Error during synthesis process: ${message}`, error instanceof Error ? error : undefined); 
           // Consider wrapping the error for more context if needed
           throw new Error(`Synthesis failed: ${message}`);
      }
  }

  async processAudioSegment(audioData: Buffer): Promise<Buffer> {
    if (!audioData || audioData.length === 0) {
      this.logger.warn("processAudioSegment: Received empty or null buffer. Skipping processing.");
      return Buffer.alloc(0); 
    }
    let currentAudioData = audioData;

    // --- Apply processing steps (Example: Normalization) ---
    if (this.processingOptions.normalize) {
      this.logger.debug("processAudioSegment: Applying normalization...");
      try {
        currentAudioData = await this.audioProcessor.normalize(currentAudioData);
        this.logger.debug(`processAudioSegment: Normalization applied. New size: ${currentAudioData.length}`);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        this.logger.error(`processAudioSegment: Error during normalization: ${message}. Continuing with unnormalized audio.`);
        // Decide: throw error or continue? For now, we continue.
      }
    }

    // --- Apply enhancement steps (Example: Background Music) ---
    if (this.enhancementOptions.addBackgroundMusic && this.backgroundMusic) {
      this.logger.debug("processAudioSegment: Adding background music...");
      try {
        currentAudioData = await this.audioEnhancer.mixBackgroundMusic(
          currentAudioData,
          this.backgroundMusic,
          this.enhancementOptions.backgroundMusicVolume || 0.1, 
        );
        this.logger.debug(`processAudioSegment: Background music added. New size: ${currentAudioData.length}`);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        this.logger.error(`processAudioSegment: Error adding background music: ${message}. Continuing without background music.`);
        // Decide: throw error or continue? For now, we continue.
      }
    }
    // Add other processing/enhancement steps here following the same pattern...

    this.logger.info(`processAudioSegment: Processing complete. Final buffer size: ${currentAudioData.length}`);
    return currentAudioData;
  }

  setBackgroundMusic(musicBuffer: Buffer): void {
    this.logger.info(`setBackgroundMusic: Setting background music buffer (${musicBuffer.length} bytes).`);
    this.backgroundMusic = musicBuffer;
  }

  async combineAudioSegments(
    segments: AudioSegment[],
    outputPath?: string,
    pauseDuration: number = 0.5,
  ): Promise<AudioResult> {
    this.logger.info(`combineAudioSegments: Starting combination of ${segments.length} segments.`);
    this.logger.debug(`combineAudioSegments: Pause duration: ${pauseDuration}s. Output path: ${outputPath || "Buffer"}`);


    if (segments.length === 0) {
      this.logger.warn("combineAudioSegments: No segments provided to combine.");
      // Return an empty result or throw error based on expected behavior
      return { buffer: Buffer.alloc(0), duration: 0, filePath: outputPath, format: 'mp3', sampleRate: 44100, channels: 1 };
    }

    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "copernicus-concat-"));
    const tempFiles: string[] = []; 
    const concatListPath = path.join(tempDir, "concat-list.txt");
    let fileListContent = "";
    let estimatedTotalDuration = 0; 

    this.logger.debug(`combineAudioSegments: Created temporary directory: ${tempDir}`);


    try {
      // 1. Validate segments, write temporary files, create concat list
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];

        // --- Segment Validation ---
        if (!segment || !segment.buffer || segment.buffer.length === 0) {
          this.logger.warn(`combineAudioSegments: Segment ${i} is invalid (missing or empty buffer). Skipping.`);
          continue; 
        }
        if (!segment.format || !segment.format.match(/^(mp3|wav|aac|ogg|flac)$/i)) { 
          this.logger.warn(`combineAudioSegments: Segment ${i} has unsupported format "${segment.format}". Skipping.`);
          continue;
        }

        this.logger.debug(`combineAudioSegments: Processing segment ${i}, size: ${segment.buffer.length}, format: ${segment.format}, duration: ${segment.duration || 'unknown'}`);

        // Write valid segment buffer to a temporary file
        const segmentPath = path.join(tempDir, `segment-${i}.${segment.format}`); 
        await fs.writeFile(segmentPath, segment.buffer);
        tempFiles.push(segmentPath);
        // IMPORTANT: Use relative paths in concat list if running ffmpeg with cwd=tempDir
        fileListContent += `file '${path.basename(segmentPath)}'\n`;

        // --- Verify/Recalculate Segment Duration (using temp file) ---
        if (!segment.duration || segment.duration <= 0) {
            this.logger.warn(`Segment ${i} has invalid duration. Recalculating...`);
            try {
                // No need to rewrite, use the file we just wrote
                const recalcDuration = await getAudioDurationInSeconds(segmentPath); // Pass file path
                segment.duration = recalcDuration;
                this.logger.info(`Recalculated duration for segment ${i}: ${recalcDuration.toFixed(2)}s`);
            } catch(recalcError: unknown) {
                const errorMsg = recalcError instanceof Error ? recalcError.message : String(recalcError);
                this.logger.error(`Failed to recalculate duration for segment ${i} (${segmentPath}): ${errorMsg}`);
                // Handle error: skip segment, use estimated duration, or throw?
                // For now, let's skip it by not adding to total duration and potentially excluding from list?
            }
        }
        estimatedTotalDuration += segment.duration || 0;
        this.logger.debug(`combineAudioSegments: Wrote segment ${i} to temp file: ${segmentPath}. Estimated duration: ${segment.duration}s`);


        // --- Add Pause ---
        if (i < segments.length - 1 && pauseDuration > 0) {
          const pauseFileName = `pause-${i}.mp3`; 
          const pauseFilePath = path.join(tempDir, pauseFileName);
          try {
            await this.createSilentAudio(pauseFilePath, pauseDuration); 
            tempFiles.push(pauseFilePath);
            fileListContent += `file '${pauseFileName}'\n`; 
            estimatedTotalDuration += pauseDuration; 
            this.logger.debug(`combineAudioSegments: Added pause of ${pauseDuration}s after segment ${i}.`);
          } catch (pauseError: unknown) {
            const message = pauseError instanceof Error ? pauseError.message : String(pauseError);
            this.logger.error(`combineAudioSegments: Failed to create pause file after segment ${i}: ${message}. Skipping pause.`);
            // Continue without the pause if creation fails
          }
        }
      } 

      // Check if any valid segments were processed
      if (!fileListContent) {
        this.logger.warn("combineAudioSegments: No valid segments found to concatenate after processing loop.");
        await fs.remove(tempDir).catch(err => {
          this.logger.error(`Failed to remove temporary directory ${tempDir}:`, err);
        });
        return { buffer: Buffer.alloc(0), duration: 0, filePath: outputPath, format: 'mp3', sampleRate: 44100, channels: 1 };
      }


      await fs.writeFile(concatListPath, fileListContent);
      this.logger.debug(`combineAudioSegments: Created concat list file: ${concatListPath}`);
      this.logger.debug(`combineAudioSegments: Concat list content:\n${fileListContent}`);


      // 2. Execute FFmpeg command for concatenation
      // Determine final output path (temporary if buffer is requested, final if path provided)
      // Ensure the output path directory exists if specified
      let finalOutputPath = "";
      if (outputPath) {
        const outputDir = path.dirname(outputPath);
        await fs.mkdir(outputDir, { recursive: true }); 
        finalOutputPath = outputPath;
      } else {
        // Outputting to buffer, use a temporary file first
        finalOutputPath = path.join(tempDir, `combined-output-${Date.now()}.mp3`); 
      }
      this.logger.debug(`combineAudioSegments: Final output path set to: ${finalOutputPath}`);


      const ffmpegArgs = [
        "-f", "concat",           
        "-safe", "0",             
        "-i", concatListPath,    
        "-c", "copy",            
        // If segments might differ (e.g., sample rate), remove "-c copy"
        // to force re-encoding (slower, handles incompatibility)
        // Example without copy: "-acodec", "libmp3lame", "-b:a", "192k", "-ar", "44100"
        "-y",                    
        finalOutputPath          
      ];

      this.logger.info(`combineAudioSegments: Running FFmpeg command: ffmpeg ${ffmpegArgs.join(" ")}`);
      // Run ffmpeg with cwd set to tempDir so relative paths in concat list work
      try {
        // Consider adding a timeout here if ffmpeg might hang
        const { stdout, stderr } = await execFileAsync("ffmpeg", ffmpegArgs, { cwd: tempDir });
        this.logger.info(`combineAudioSegments: FFmpeg concatenation successful.`);
        if (stdout) this.logger.debug(`combineAudioSegments: FFmpeg stdout: ${stdout}`);
        if (stderr) this.logger.debug(`combineAudioSegments: FFmpeg stderr: ${stderr}`); 
      } catch (ffmpegError: unknown) {
        // Handle potential errors from execFileAsync
        let errorMessage = "FFmpeg concatenation failed.";
        if (ffmpegError instanceof Error) {
          errorMessage = `FFmpeg concatenation failed: ${ffmpegError.message}`;
          const errorDetails = ffmpegError as Error & { stderr?: string };
          if (errorDetails.stderr) errorMessage += `\nStderr: ${errorDetails.stderr}`;
        } else {
          errorMessage = `FFmpeg concatenation failed: ${String(ffmpegError)}`;
        }
        this.logger.error(`combineAudioSegments: ${errorMessage}`);
        throw new Error(errorMessage); 
      }

      // 6. Read the final combined audio file into a buffer
      let finalAudioBuffer: Buffer;
      try {
        finalAudioBuffer = await fs.readFile(finalOutputPath);
        this.logger.info(
          `combineAudioSegments: Successfully read combined audio file: ${finalOutputPath}, size: ${finalAudioBuffer.length} bytes`,
        );
      } catch (readError) {
        this.logger.error(
          `combineAudioSegments: Failed to read final audio file ${finalOutputPath}: ${readError}`,
        );
        throw new Error(`Failed to read combined audio file: ${readError}`);
      }

      // 7. Calculate duration of the final audio
      let finalDuration = 0;
      try {
        finalDuration = await getAudioDurationInSeconds(finalOutputPath); // Pass file path
        this.logger.info(`combineAudioSegments: Final audio duration: ${finalDuration.toFixed(2)} seconds`);
      } catch (durationError) {
        this.logger.error(`combineAudioSegments: Failed to calculate final audio duration: ${durationError}`);
        // Continue without duration if calculation fails
      }

      // 8. Clean up temporary directory
      if (tempDir) { 
        try {
          await fs.remove(tempDir).catch(err => {
            this.logger.error(`Failed to remove temporary directory ${tempDir}:`, err);
          });
          this.logger.info(`combineAudioSegments: Cleaned up temporary directory: ${tempDir}`);
        } catch (cleanupError) {
          this.logger.error(
            `combineAudioSegments: Error cleaning up temp directory ${tempDir}: ${cleanupError}`,
          );
          // Log error but don't throw, combination was successful
        }
      }

      // 9. Return the result
      return {
        buffer: finalAudioBuffer,
        filePath: finalOutputPath,
        duration: finalDuration, 
        format: 'mp3', 
        sampleRate: 44100, 
        channels: 1, 
      };
    } catch (error) {
      // Top-level error handling
      this.logger.error(`combineAudioSegments: An error occurred during the process: ${error}`);

      // Ensure temporary directory is cleaned up even if an error occurred mid-process
      if (tempDir) {
        try {
          await fs.remove(tempDir).catch(err => {
            this.logger.error(`Failed to remove temporary directory ${tempDir}:`, err);
          });
          this.logger.info(`combineAudioSegments: Cleaned up temporary directory after error: ${tempDir}`);
        } catch (cleanupError) {
          this.logger.error(
            `combineAudioSegments: Error cleaning up temp directory ${tempDir} after main error: ${cleanupError}`,
          );
        }
      }

      // Re-throw the original error to propagate it
      throw error;
    }
  }
}