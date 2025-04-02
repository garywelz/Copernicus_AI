import { BaseService, ServiceConfig, ServiceStatus, ServiceResult, ServiceEvent, ServiceEventHandler, ServiceOptions } from '../types/service';
import { CopernicusError, handleError } from '../utils/errors';

/**
 * Abstract base service implementation
 */
export abstract class AbstractBaseService implements BaseService {
  protected config: ServiceConfig;
  protected status: ServiceStatus;
  protected eventHandler?: ServiceEventHandler;
  protected logger: Console;
  protected startTime: number;

  constructor(options: ServiceOptions) {
    this.config = options.config;
    this.eventHandler = options.onEvent;
    this.logger = options.logger || console;
    this.startTime = Date.now();
    
    this.status = {
      isInitialized: false,
      isRunning: false,
      uptime: 0,
      metrics: {}
    };
  }

  /**
   * Initialize the service
   */
  async initialize(): Promise<void> {
    try {
      await this.validate();
      this.status.isInitialized = true;
      this.emit('initialized');
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Validate service configuration and dependencies
   */
  async validate(): Promise<void> {
    if (!this.config.enabled) {
      throw new CopernicusError(
        'Service is disabled',
        'SERVICE_DISABLED'
      );
    }
  }

  /**
   * Clean up service resources
   */
  async cleanup(): Promise<void> {
    try {
      this.status.isRunning = false;
      this.emit('cleanup');
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Get current service status
   */
  getStatus(): ServiceStatus {
    return {
      ...this.status,
      uptime: Date.now() - this.startTime
    };
  }

  /**
   * Emit service events
   */
  protected emit(event: ServiceEvent, data?: unknown): void {
    if (this.eventHandler) {
      this.eventHandler(event, data);
    }
  }

  /**
   * Handle service errors
   */
  protected handleError(error: unknown): void {
    const copernicusError = error instanceof CopernicusError
      ? error
      : new CopernicusError(
          'An unexpected error occurred',
          'UNKNOWN_ERROR',
          error
        );

    this.status.lastError = copernicusError;
    this.emit('error', copernicusError);
    handleError(copernicusError);
  }

  /**
   * Execute service operation with retry logic
   */
  protected async withRetry<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<ServiceResult<T>> {
    let lastError: CopernicusError | undefined;
    
    for (let attempt = 1; attempt <= this.config.retries; attempt++) {
      try {
        const data = await operation();
        return { success: true, data };
      } catch (error) {
        lastError = error instanceof CopernicusError
          ? error
          : new CopernicusError(
              `Operation failed: ${context}`,
              'OPERATION_FAILED',
              error
            );

        if (attempt < this.config.retries) {
          await new Promise(resolve => 
            setTimeout(resolve, this.config.retryDelay * attempt)
          );
          continue;
        }
      }
    }

    return {
      success: false,
      error: lastError
    };
  }

  /**
   * Execute service operation with timeout
   */
  protected async withTimeout<T>(
    operation: () => Promise<T>,
    timeout: number
  ): Promise<T> {
    return Promise.race([
      operation(),
      new Promise<T>((_, reject) =>
        setTimeout(() => {
          reject(new CopernicusError(
            'Operation timed out',
            'TIMEOUT_ERROR'
          ));
        }, timeout)
      )
    ]);
  }
} 