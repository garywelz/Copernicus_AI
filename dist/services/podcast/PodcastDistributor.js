"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodcastDistributor = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class PodcastDistributor {
    constructor(twitterService, audioProcessor) {
        this.twitterService = twitterService;
        this.audioProcessor = audioProcessor;
    }
    async shareToTwitter(podcast) {
        try {
            // Create a short preview clip
            const previewClip = await this.createPreviewClip(podcast.audioUrl, 60);
            // Post to Twitter with preview
            const tweetResponse = await this.twitterService.postTweet({
                text: `🎙️ New Episode: ${podcast.title}\n\nListen to the full episode here: ${podcast.url}\n\n#AIResearch #Podcast`,
                media: {
                    imageData: previewClip,
                    mimeType: 'video/mp4'
                }
            });
            return tweetResponse;
        }
        catch (error) {
            throw new Error(`Failed to share podcast to Twitter: ${error}`);
        }
    }
    async createPreviewClip(audioUrl, duration) {
        const tempDir = await promises_1.default.mkdtemp(path_1.default.join(os_1.default.tmpdir(), 'podcast-preview-'));
        const outputPath = path_1.default.join(tempDir, 'preview.mp4');
        try {
            // Download audio file if it's a URL
            const inputPath = audioUrl.startsWith('http')
                ? await this.downloadAudio(audioUrl, tempDir)
                : audioUrl;
            // Create video from audio with waveform visualization
            await execAsync(`ffmpeg -i "${inputPath}" -t ${duration} \
        -filter_complex "[0:a]showwaves=s=1280x720:mode=line:rate=25,format=yuv420p[v]" \
        -map "[v]" -map 0:a \
        -c:v libx264 -c:a aac \
        -shortest "${outputPath}"`);
            // Read the generated video file
            const videoBuffer = await promises_1.default.readFile(outputPath);
            return videoBuffer;
        }
        catch (error) {
            throw new Error(`Failed to create preview clip: ${error}`);
        }
        finally {
            // Cleanup temp directory
            await promises_1.default.rm(tempDir, { recursive: true, force: true });
        }
    }
    async downloadAudio(url, tempDir) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to download audio: ${response.statusText}`);
        }
        const audioPath = path_1.default.join(tempDir, 'input.mp3');
        const buffer = await response.arrayBuffer();
        await promises_1.default.writeFile(audioPath, Buffer.from(buffer));
        return audioPath;
    }
}
exports.PodcastDistributor = PodcastDistributor;
//# sourceMappingURL=PodcastDistributor.js.map