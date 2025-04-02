/**
 * Base error class for all Copernicus errors
 */
export class CopernicusError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'CopernicusError';
  }
}

/**
 * API-related errors
 */
export class APIError extends CopernicusError {
  constructor(
    message: string,
    public statusCode: number,
    details?: unknown
  ) {
    super(message, 'API_ERROR', details);
    this.name = 'APIError';
  }
}

/**
 * Content generation errors
 */
export class ContentGenerationError extends CopernicusError {
  constructor(
    message: string,
    public contentType: 'audio' | 'video' | 'text',
    details?: unknown
  ) {
    super(message, 'CONTENT_GENERATION_ERROR', details);
    this.name = 'ContentGenerationError';
  }
}

/**
 * Audio processing errors
 */
export class AudioProcessingError extends CopernicusError {
  constructor(
    message: string,
    public stage: 'normalization' | 'mixing' | 'export',
    details?: unknown
  ) {
    super(message, 'AUDIO_PROCESSING_ERROR', details);
    this.name = 'AudioProcessingError';
  }
}

/**
 * Video processing errors
 */
export class VideoProcessingError extends CopernicusError {
  constructor(
    message: string,
    public stage: 'rendering' | 'encoding' | 'export',
    details?: unknown
  ) {
    super(message, 'VIDEO_PROCESSING_ERROR', details);
    this.name = 'VideoProcessingError';
  }
}

/**
 * Database errors
 */
export class DatabaseError extends CopernicusError {
  constructor(
    message: string,
    public operation: 'read' | 'write' | 'update' | 'delete',
    details?: unknown
  ) {
    super(message, 'DATABASE_ERROR', details);
    this.name = 'DatabaseError';
  }
}

/**
 * Configuration errors
 */
export class ConfigurationError extends CopernicusError {
  constructor(
    message: string,
    public configKey: string,
    details?: unknown
  ) {
    super(message, 'CONFIGURATION_ERROR', details);
    this.name = 'ConfigurationError';
  }
}

/**
 * Validation errors
 */
export class ValidationError extends CopernicusError {
  constructor(
    message: string,
    public field: string,
    details?: unknown
  ) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

/**
 * Error handler utility
 */
export const handleError = (error: unknown): never => {
  if (error instanceof CopernicusError) {
    // Log the error with appropriate context
    console.error(`[${error.name}] ${error.message}`, {
      code: error.code,
      details: error.details
    });
    throw error;
  }
  
  // Handle unknown errors
  console.error('[UNKNOWN_ERROR]', error);
  throw new CopernicusError(
    'An unexpected error occurred',
    'UNKNOWN_ERROR',
    error
  );
}; 