"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analysisCache = void 0;
exports.processPaper = processPaper;
exports.cleanupCache = cleanupCache;
exports.startCleanupInterval = startCleanupInterval;
exports.stopCleanupInterval = stopCleanupInterval;
const OpenRouterService_js_1 = require("./llm/OpenRouterService.js");
const logger_js_1 = require("../utils/logger.js");
// Cache duration in milliseconds (24 hours)
const CACHE_DURATION = 24 * 60 * 60 * 1000;
// Make cache exportable for testing
exports.analysisCache = {};
// Store interval ID for cleanup
let cleanupInterval = null;
/**
 * Validates a research paper object
 * @param paper Paper to validate
 * @throws Error if paper is invalid
 */
function validatePaper(paper) {
    if (!paper.title || typeof paper.title !== 'string') {
        throw new Error('Paper must have a valid title');
    }
    if (!Array.isArray(paper.authors) || paper.authors.length === 0) {
        throw new Error('Paper must have at least one author');
    }
    if (!paper.content || typeof paper.content !== 'string') {
        throw new Error('Paper must have content');
    }
}
/**
 * Generates a cache key for a paper and options combination
 */
function generateCacheKey(paper, options) {
    return `${paper.title}-${JSON.stringify(options)}`;
}
/**
 * Checks if a cached analysis is still valid
 */
function isCacheValid(cacheEntry) {
    return Date.now() - cacheEntry.timestamp < CACHE_DURATION;
}
/**
 * Processes a research paper and returns analysis
 * @param paper The research paper to analyze
 * @param options Analysis options
 * @param apiKey OpenRouter API key
 * @returns Promise<PaperAnalysis>
 */
async function processPaper(paper, options, apiKey) {
    try {
        validatePaper(paper);
        const cacheKey = generateCacheKey(paper, options);
        const cachedResult = exports.analysisCache[cacheKey];
        if (cachedResult && isCacheValid(cachedResult)) {
            logger_js_1.logger.info('Using cached analysis');
            return cachedResult.analysis;
        }
        logger_js_1.logger.info('Starting new paper analysis');
        const llmService = new OpenRouterService_js_1.OpenRouterService(apiKey);
        const analysis = await llmService.analyzePaper(paper, options);
        if (analysis) {
            exports.analysisCache[cacheKey] = {
                analysis,
                timestamp: Date.now()
            };
            logger_js_1.logger.info('Analysis cached successfully');
        }
        return analysis;
    }
    catch (error) {
        logger_js_1.logger.error('Error processing paper:', error);
        if (error instanceof Error) {
            throw new Error(`Paper processing failed: ${error.message}`);
        }
        throw new Error('Paper processing failed with unknown error');
    }
}
/**
 * Clears expired entries from the analysis cache
 */
function cleanupCache() {
    Object.entries(exports.analysisCache).forEach(([key, entry]) => {
        if (!isCacheValid(entry)) {
            delete exports.analysisCache[key];
            logger_js_1.logger.debug(`Cleaned up cached entry: ${key}`);
        }
    });
}
// Export functions to manage cleanup interval
function startCleanupInterval() {
    stopCleanupInterval();
    cleanupInterval = setInterval(cleanupCache, CACHE_DURATION);
    cleanupInterval.unref();
    logger_js_1.logger.debug('Started cache cleanup interval');
}
function stopCleanupInterval() {
    if (cleanupInterval) {
        clearInterval(cleanupInterval);
        cleanupInterval = null;
        logger_js_1.logger.debug('Stopped cache cleanup interval');
    }
}
// Start cleanup on module load
startCleanupInterval();
//# sourceMappingURL=paperProcessor.js.map