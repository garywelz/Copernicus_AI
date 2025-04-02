import { ResearchPaper, PaperAnalysis, AnalyzeOptions } from '../types/paper.js';
import { OpenRouterService } from './llm/OpenRouterService.js';
import { logger } from '../utils/logger.js';

// Cache interface for storing analysis results
interface AnalysisCache {
  [key: string]: {
    analysis: PaperAnalysis;
    timestamp: number;
  };
}

// Cache duration in milliseconds (24 hours)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// Make cache exportable for testing
export const analysisCache: AnalysisCache = {};

// Store interval ID for cleanup
let cleanupInterval: NodeJS.Timeout | null = null;

/**
 * Validates a research paper object
 * @param paper Paper to validate
 * @throws Error if paper is invalid
 */
function validatePaper(paper: ResearchPaper): void {
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
function generateCacheKey(paper: ResearchPaper, options: AnalyzeOptions): string {
  return `${paper.title}-${JSON.stringify(options)}`;
}

/**
 * Checks if a cached analysis is still valid
 */
function isCacheValid(cacheEntry: { timestamp: number }): boolean {
  return Date.now() - cacheEntry.timestamp < CACHE_DURATION;
}

/**
 * Processes a research paper and returns analysis
 * @param paper The research paper to analyze
 * @param options Analysis options
 * @param apiKey OpenRouter API key
 * @returns Promise<PaperAnalysis>
 */
export async function processPaper(
  paper: ResearchPaper,
  options: AnalyzeOptions,
  apiKey: string
): Promise<PaperAnalysis> {
  try {
    validatePaper(paper);

    const cacheKey = generateCacheKey(paper, options);
    const cachedResult = analysisCache[cacheKey];
    
    if (cachedResult && isCacheValid(cachedResult)) {
      logger.info('Using cached analysis');
      return cachedResult.analysis;
    }

    logger.info('Starting new paper analysis');
    const llmService = new OpenRouterService(apiKey);
    const analysis = await llmService.analyzePaper(paper, options);

    if (analysis) {
      analysisCache[cacheKey] = {
        analysis,
        timestamp: Date.now()
      };
      logger.info('Analysis cached successfully');
    }

    return analysis;
  } catch (error) {
    logger.error('Error processing paper:', error);
    if (error instanceof Error) {
      throw new Error(`Paper processing failed: ${error.message}`);
    }
    throw new Error('Paper processing failed with unknown error');
  }
}

/**
 * Clears expired entries from the analysis cache
 */
export function cleanupCache(): void {
  Object.entries(analysisCache).forEach(([key, entry]) => {
    if (!isCacheValid(entry)) {
      delete analysisCache[key];
      logger.debug(`Cleaned up cached entry: ${key}`);
    }
  });
}

// Export functions to manage cleanup interval
export function startCleanupInterval(): void {
  stopCleanupInterval();
  cleanupInterval = setInterval(cleanupCache, CACHE_DURATION);
  cleanupInterval.unref();
  logger.debug('Started cache cleanup interval');
}

export function stopCleanupInterval(): void {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
    logger.debug('Stopped cache cleanup interval');
  }
}

// Start cleanup on module load
startCleanupInterval(); 