"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const PodcastAnnouncer_1 = require("../../../services/podcast/PodcastAnnouncer");
globals_1.jest.mock('../../../utils/logger');
(0, globals_1.describe)('PodcastAnnouncer', () => {
    let announcer;
    let mockTwitterService;
    const mockPodcast = {
        title: 'Test Podcast',
        url: 'https://example.com/podcast/123',
        duration: 300,
        audioUrl: 'https://example.com/audio/123.mp3'
    };
    const mockTweetResponse = {
        id: '123456',
        text: 'Test tweet',
        createdAt: new Date().toISOString()
    };
    (0, globals_1.beforeEach)(() => {
        mockTwitterService = {
            postTweet: globals_1.jest.fn()
                .mockResolvedValue(mockTweetResponse)
        };
        announcer = new PodcastAnnouncer_1.PodcastAnnouncer(mockTwitterService);
    });
    (0, globals_1.test)('announces podcast successfully', async () => {
        await announcer.announcePodcast(mockPodcast);
        (0, globals_1.expect)(mockTwitterService.postTweet).toHaveBeenCalledWith({
            text: globals_1.expect.stringContaining(mockPodcast.title)
        });
    });
    (0, globals_1.test)('announces podcast with thumbnail', async () => {
        const mockThumbnail = Buffer.from('test-image');
        await announcer.announcePodcast(mockPodcast, mockThumbnail);
        (0, globals_1.expect)(mockTwitterService.postTweet).toHaveBeenCalledWith({
            text: globals_1.expect.stringContaining(mockPodcast.title),
            media: {
                imageData: mockThumbnail,
                mimeType: 'image/jpeg'
            }
        });
    });
    (0, globals_1.test)('handles announcement error', async () => {
        mockTwitterService.postTweet.mockRejectedValue(new Error('Tweet failed'));
        await (0, globals_1.expect)(announcer.announcePodcast(mockPodcast))
            .rejects.toThrow('Failed to announce podcast: Tweet failed');
    });
    (0, globals_1.test)('creates correct announcement text', async () => {
        await announcer.announcePodcast(mockPodcast);
        (0, globals_1.expect)(mockTwitterService.postTweet).toHaveBeenCalledWith(globals_1.expect.objectContaining({
            text: globals_1.expect.stringMatching(/🎙️ New AI Research Podcast!.*Test Podcast.*Listen now:.*#AI #Research #Podcast/s)
        }));
    });
});
//# sourceMappingURL=PodcastAnnouncer.test.js.map