import { AbstractBaseService } from './BaseService';
import { ServiceConfig, ServiceOptions, ServiceResult } from '../types/service';
import { ConfigService } from './ConfigService';
import { LoggingService } from './LoggingService';
import { CopernicusError } from '../utils/errors';

/**
 * Service manager configuration
 */
export interface ServiceManagerConfig extends ServiceConfig {
  services: {
    config: ServiceConfig;
    logging: ServiceConfig;
  };
}

/**
 * Service manager implementation
 */
export class ServiceManager {
  private services: Map<string, AbstractBaseService> = new Map();
  private config: ServiceManagerConfig;
  private logger: LoggingService;

  constructor(config: ServiceManagerConfig) {
    this.config = config;
    this.logger = new LoggingService({
      config: config.services.logging
    });
  }

  /**
   * Initialize all services
   */
  async initialize(): Promise<void> {
    try {
      // Initialize config service first
      const configService = new ConfigService({
        config: this.config.services.config
      });
      await configService.initialize();
      this.services.set('config', configService);

      // Initialize logging service
      await this.logger.initialize();
      this.services.set('logging', this.logger);

      // Log successful initialization
      this.logger.info('Service manager initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize service manager', error as Error);
      throw error;
    }
  }

  /**
   * Register a new service
   */
  async registerService(
    name: string,
    service: AbstractBaseService
  ): Promise<void> {
    if (this.services.has(name)) {
      throw new CopernicusError(
        `Service ${name} is already registered`,
        'SERVICE_ALREADY_REGISTERED'
      );
    }

    try {
      await service.initialize();
      this.services.set(name, service);
      this.logger.info(`Service ${name} registered successfully`);
    } catch (error) {
      this.logger.error(`Failed to register service ${name}`, error as Error);
      throw error;
    }
  }

  /**
   * Get a registered service
   */
  getService<T extends AbstractBaseService>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new CopernicusError(
        `Service ${name} is not registered`,
        'SERVICE_NOT_REGISTERED'
      );
    }
    return service as T;
  }

  /**
   * Clean up all services
   */
  async cleanup(): Promise<void> {
    const cleanupPromises: Promise<void>[] = [];

    for (const [name, service] of this.services) {
      cleanupPromises.push(
        service.cleanup().catch(error => {
          this.logger.error(`Failed to cleanup service ${name}`, error as Error);
        })
      );
    }

    await Promise.all(cleanupPromises);
    this.services.clear();
    this.logger.info('Service manager cleaned up successfully');
  }

  /**
   * Get service status
   */
  getStatus(): Record<string, unknown> {
    const status: Record<string, unknown> = {};

    for (const [name, service] of this.services) {
      status[name] = service.getStatus();
    }

    return status;
  }
} 