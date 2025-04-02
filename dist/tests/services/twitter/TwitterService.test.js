"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const TwitterService_1 = require("../../../services/twitter/TwitterService");
const twitter_api_v2_1 = require("twitter-api-v2");
globals_1.jest.mock('twitter-api-v2');
(0, globals_1.describe)('TwitterService', () => {
    let service;
    const mockBearerToken = 'test-token';
    const mockTweet = {
        data: {
            id: '123456',
            text: 'Test tweet'
        }
    };
    const mockTwitterApi = {
        v2: {
            tweet: globals_1.jest.fn()
        },
        v1: {
            uploadMedia: globals_1.jest.fn()
        }
    };
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.clearAllMocks();
        twitter_api_v2_1.TwitterApi
            .mockImplementation(() => mockTwitterApi);
        service = new TwitterService_1.TwitterService(mockBearerToken);
    });
    (0, globals_1.test)('posts tweet successfully', async () => {
        mockTwitterApi.v2.tweet.mockResolvedValueOnce(mockTweet);
        const result = await service.postTweet({ text: 'Test tweet' });
        (0, globals_1.expect)(result).toEqual({
            id: '123456',
            text: 'Test tweet',
            createdAt: globals_1.expect.any(String)
        });
    });
    (0, globals_1.test)('uploads media and posts tweet', async () => {
        mockTwitterApi.v1.uploadMedia.mockResolvedValueOnce('media123');
        mockTwitterApi.v2.tweet.mockResolvedValueOnce(mockTweet);
        const result = await service.postTweet({
            text: 'Test tweet with media',
            media: {
                imageData: Buffer.from('test'),
                mimeType: 'image/jpeg'
            }
        });
        (0, globals_1.expect)(mockTwitterApi.v1.uploadMedia).toHaveBeenCalled();
        (0, globals_1.expect)(mockTwitterApi.v2.tweet).toHaveBeenCalledWith({
            text: 'Test tweet with media',
            media: { media_ids: ['media123'] }
        });
    });
    (0, globals_1.test)('handles tweet error', async () => {
        mockTwitterApi.v2.tweet.mockRejectedValueOnce(new Error('Tweet failed'));
        await (0, globals_1.expect)(service.postTweet({ text: 'Test tweet' }))
            .rejects.toThrow('Failed to post tweet: Tweet failed');
    });
    (0, globals_1.test)('continues with tweet when media upload fails', async () => {
        mockTwitterApi.v1.uploadMedia.mockRejectedValueOnce(new Error('Upload failed'));
        mockTwitterApi.v2.tweet.mockResolvedValueOnce(mockTweet);
        const result = await service.postTweet({
            text: 'Test tweet with media',
            media: {
                imageData: Buffer.from('test'),
                mimeType: 'image/jpeg'
            }
        });
        (0, globals_1.expect)(mockTwitterApi.v1.uploadMedia).toHaveBeenCalled();
        (0, globals_1.expect)(mockTwitterApi.v2.tweet).toHaveBeenCalledWith({
            text: 'Test tweet with media'
        });
        (0, globals_1.expect)(result.text).toBe('Test tweet');
    });
});
//# sourceMappingURL=TwitterService.test.js.map