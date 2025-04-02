"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElevenLabsService = void 0;
const audio_1 = require("../../utils/audio");
const audioEffects_1 = require("../../utils/audioEffects");
const logger_1 = require("../../utils/logger");
const get_audio_duration_1 = require("get-audio-duration");
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const promises_1 = __importDefault(require("fs/promises"));
const child_process_1 = require("child_process");
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';
class ElevenLabsService {
    constructor(apiKey, processingOptions = {}, enhancementOptions = {}) {
        this.apiKey = apiKey;
        this.processingOptions = processingOptions;
        this.enhancementOptions = enhancementOptions;
        this.voiceMap = new Map([
            ['host', {
                    voiceId: 'ErXwobaYiN019PkySvjV', // Antoni's voice ID
                    name: 'Antoni',
                    style: 0.65,
                    stability: 0.55,
                    speaking_rate: 1.1,
                    description: 'Host - warm, engaging'
                }],
            ['expert', {
                    voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel's voice ID for Charlotte
                    name: 'Charlotte',
                    style: 0.45,
                    stability: 0.75,
                    speaking_rate: 0.95,
                    description: 'Expert - technical, precise'
                }],
            ['copernicus', {
                    voiceId: '5KCLtmjBQSL8p6gtQvcj', // Gary hoarse voice ID
                    name: 'Copernicus',
                    style: 0.70,
                    stability: 0.60,
                    speaking_rate: 0.90,
                    description: 'Historical perspective - wise, authoritative'
                }]
        ]);
        this.audioProcessor = new audio_1.AudioProcessor();
        this.audioEnhancer = new audioEffects_1.AudioEnhancer();
    }
    async convertToMp3(inputBuffer) {
        try {
            // Create temporary files
            const tempInputFile = path_1.default.join(os_1.default.tmpdir(), `input-${Date.now()}.mp3`);
            const tempOutputFile = path_1.default.join(os_1.default.tmpdir(), `output-${Date.now()}.mp3`);
            // Write input buffer to temp file
            await promises_1.default.writeFile(tempInputFile, inputBuffer);
            return new Promise((resolve, reject) => {
                const ffmpeg = (0, child_process_1.spawn)('ffmpeg', [
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
                            const outputBuffer = await promises_1.default.readFile(tempOutputFile);
                            resolve(outputBuffer);
                        }
                        else {
                            reject(new Error(`FFmpeg failed with code ${code}: ${errorMessage}`));
                        }
                    }
                    catch (error) {
                        reject(error);
                    }
                    finally {
                        // Clean up temp files
                        promises_1.default.unlink(tempInputFile).catch(() => { });
                        promises_1.default.unlink(tempOutputFile).catch(() => { });
                    }
                });
            });
        }
        catch (error) {
            logger_1.logger.error('Error in convertToMp3:', error);
            throw error;
        }
    }
    async synthesize(text, options) {
        try {
            logger_1.logger.info('Synthesizing speech with ElevenLabs:', options);
            const voiceConfig = this.voiceMap.get(options.model) || this.voiceMap.get('en_US-male-medium');
            // Log full text being sent
            console.log('Full text being sent to ElevenLabs:', text);
            const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${voiceConfig.voiceId}`, {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'xi-api-key': this.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text,
                    model_id: 'eleven_monolingual_v1',
                    voice_settings: {
                        ...this.getVoiceSettings(options.model),
                        optimize_streaming_latency: 0,
                        output_format: 'mp3_44100_128'
                    }
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
            // Add additional FFmpeg processing for each segment
            audioData = await this.processAudioSegment(audioData);
            const duration = await this.getAudioDuration(audioData);
            console.log('Audio duration:', duration);
            return {
                audioData,
                duration,
                speaker: options.model
            };
        }
        catch (error) {
            logger_1.logger.error('Error in speech synthesis:', error);
            throw error;
        }
    }
    async processAudioSegment(audioData) {
        const tempDir = path_1.default.join(os_1.default.tmpdir(), `segment-${Date.now()}`);
        await promises_1.default.mkdir(tempDir, { recursive: true });
        const inputFile = path_1.default.join(tempDir, 'input.mp3');
        const outputFile = path_1.default.join(tempDir, 'output.mp3');
        await promises_1.default.writeFile(inputFile, audioData);
        // More compatible settings
        const ffmpegArgs = [
            '-i', inputFile,
            '-acodec', 'libmp3lame',
            '-ar', '48000', // Changed to 48kHz
            '-ac', '2', // Changed to stereo
            '-b:a', '192k', // Increased bitrate
            '-af', 'aresample=48000:async=1000,apad,volume=1.5,loudnorm=I=-16:TP=-1.5:LRA=11',
            '-y',
            outputFile
        ];
        return new Promise((resolve, reject) => {
            const ffmpeg = (0, child_process_1.spawn)('ffmpeg', ffmpegArgs);
            ffmpeg.on('close', async (code) => {
                try {
                    if (code === 0) {
                        const processedAudio = await promises_1.default.readFile(outputFile);
                        resolve(processedAudio);
                    }
                    else {
                        reject(new Error('Failed to process audio segment'));
                    }
                }
                finally {
                    // Cleanup
                    promises_1.default.unlink(inputFile).catch(() => { });
                    promises_1.default.unlink(outputFile).catch(() => { });
                    promises_1.default.rmdir(tempDir).catch(() => { });
                }
            });
        });
    }
    async setBackgroundMusic(musicBuffer) {
        this.backgroundMusic = musicBuffer;
    }
    async combineAudio(segments) {
        try {
            const tempDir = path_1.default.join(os_1.default.tmpdir(), `podcast-${Date.now()}`);
            await promises_1.default.mkdir(tempDir, { recursive: true });
            // Write each segment to a temporary file
            const tempFiles = await Promise.all(segments.map(async (segment, index) => {
                const tempFile = path_1.default.join(tempDir, `segment-${index}.mp3`);
                await promises_1.default.writeFile(tempFile, segment.audioData);
                return tempFile;
            }));
            // Create concat file list
            const listFile = path_1.default.join(tempDir, 'files.txt');
            const fileList = tempFiles.map(f => `file '${f}'`).join('\n');
            await promises_1.default.writeFile(listFile, fileList);
            const outputFile = path_1.default.join(tempDir, 'output.mp3');
            const ffmpegArgs = [
                '-f', 'concat',
                '-safe', '0',
                '-i', listFile,
                '-acodec', 'libmp3lame',
                '-ar', '48000', // Changed to 48kHz
                '-ac', '2', // Changed to stereo
                '-b:a', '192k', // Increased bitrate
                '-af', 'aresample=48000:async=1000,apad,volume=1.5,loudnorm=I=-16:TP=-1.5:LRA=11',
                '-y',
                outputFile
            ];
            return new Promise((resolve, reject) => {
                const ffmpeg = (0, child_process_1.spawn)('ffmpeg', ffmpegArgs);
                let errorMessage = '';
                ffmpeg.stderr.on('data', chunk => {
                    const msg = chunk.toString();
                    errorMessage += msg;
                    console.log('FFmpeg:', msg);
                });
                ffmpeg.on('close', async (code) => {
                    try {
                        if (code === 0) {
                            const outputBuffer = await promises_1.default.readFile(outputFile);
                            resolve(outputBuffer);
                        }
                        else {
                            console.error('FFmpeg error:', errorMessage);
                            reject(new Error(`FFmpeg failed with code ${code}: ${errorMessage}`));
                        }
                    }
                    finally {
                        // Clean up
                        Promise.all([
                            ...tempFiles.map(f => promises_1.default.unlink(f).catch(() => { })),
                            promises_1.default.unlink(listFile).catch(() => { }),
                            promises_1.default.unlink(outputFile).catch(() => { }),
                            promises_1.default.rmdir(tempDir).catch(() => { })
                        ]).catch(() => { });
                    }
                });
            });
        }
        catch (error) {
            console.error('Error combining audio:', error);
            throw error;
        }
    }
    async getAudioDuration(audioData) {
        try {
            // Write buffer to temporary file
            const tempFile = path_1.default.join(os_1.default.tmpdir(), `temp-${Date.now()}.mp3`);
            await promises_1.default.writeFile(tempFile, audioData);
            // Get duration
            const duration = await (0, get_audio_duration_1.getAudioDurationInSeconds)(tempFile);
            // Clean up
            await promises_1.default.unlink(tempFile);
            return duration;
        }
        catch (error) {
            logger_1.logger.error('Error getting audio duration:', error);
            // Fallback to rough estimation
            return Math.ceil(audioData.length / 32000);
        }
    }
    // Customize voice settings based on speaker
    getVoiceSettings(model) {
        const voiceConfig = this.voiceMap.get(model) || this.voiceMap.get('en_US-male-medium');
        return {
            stability: voiceConfig.stability || 0.68, // Balanced
            similarity_boost: voiceConfig.similarity_boost || 0.72, // Clear
            style: voiceConfig.style || 0.40, // Engaging
            speaking_rate: voiceConfig.speaking_rate || 0.95, // Natural pace
        };
    }
    // Method to add/update voices
    setVoice(key, config) {
        this.voiceMap.set(key, config);
    }
    // Method to get available voices
    getAvailableVoices() {
        return new Map(this.voiceMap);
    }
    // New method for generating complete podcast episodes
    async generatePodcastEpisode(topic, outline) {
        const script = await this.generateScript(topic, outline);
        const segments = await this.generateAudioSegments(script);
        return this.combineAudio(segments);
    }
    // Generate podcast script using ElevenLabs' AI
    async generateScript(topic, outline) {
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
        }
        catch (error) {
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
    async generateAudioSegments(script) {
        if (!script) {
            throw new Error('No script provided for audio generation');
        }
        console.log('Processing script:', script);
        // Split by speaker markers
        const segments = script.split(/\n(?=(?:Antoni|Charlotte|Copernicus):)/);
        console.log('Found segments:', segments.length);
        const audioSegments = [];
        for (const segment of segments) {
            if (!segment.trim())
                continue;
            // Determine speaker
            let speaker = 'host';
            if (segment.trim().startsWith('Charlotte:')) {
                speaker = 'expert';
            }
            else if (segment.trim().startsWith('Copernicus:')) {
                speaker = 'copernicus';
            }
            const voice = this.voiceMap.get(speaker);
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
exports.ElevenLabsService = ElevenLabsService;
//# sourceMappingURL=ElevenLabsService.js.map