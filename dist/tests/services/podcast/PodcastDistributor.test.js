"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const PodcastDistributor_1 = require("../../../services/podcast/PodcastDistributor");
const child_process_1 = require("child_process");
globals_1.jest.mock('child_process');
globals_1.jest.mock('fs/promises');
(0, globals_1.describe)('PodcastDistributor', () => {
    let distributor;
    let mockTwitterService;
    let mockAudioProcessor;
    const mockPodcast = {
        title: 'Test Podcast',
        url: 'https://example.com/podcast/123',
        audioUrl: 'https://example.com/audio/123.mp3',
        duration: 300
    };
    (0, globals_1.beforeEach)(() => {
        mockTwitterService = {
            postTweet: globals_1.jest.fn().mockResolvedValue({ id: '123', text: 'Test', createdAt: new Date().toISOString() })
        };
        mockAudioProcessor = {
            normalizeAudio: globals_1.jest.fn().mockReturnValue(Buffer.from('test')),
            addPause: globals_1.jest.fn().mockReturnValue(Buffer.from('test')),
            concatenateAudio: globals_1.jest.fn().mockResolvedValue(Buffer.from('test'))
        };
        distributor = new PodcastDistributor_1.PodcastDistributor(mockTwitterService, mockAudioProcessor);
    });
    (0, globals_1.test)('shares podcast to Twitter successfully', async () => {
        const mockExec = child_process_1.exec;
        mockExec.mockImplementation((cmd, callback) => {
            callback?.(null, { stdout: '', stderr: '' });
            return {};
        });
        await distributor.shareToTwitter(mockPodcast);
        (0, globals_1.expect)(mockTwitterService.postTweet).toHaveBeenCalledWith(globals_1.expect.objectContaining({
            text: globals_1.expect.stringContaining(mockPodcast.title),
            media: globals_1.expect.objectContaining({
                mimeType: 'video/mp4'
            })
        }));
    });
    (0, globals_1.test)('handles errors gracefully', async () => {
        mockTwitterService.postTweet.mockRejectedValue(new Error('Tweet failed'));
        await (0, globals_1.expect)(distributor.shareToTwitter(mockPodcast))
            .rejects.toThrow('Failed to share podcast to Twitter');
    });
});
//# sourceMappingURL=PodcastDistributor.test.js.map