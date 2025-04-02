import { ServiceManager } from './services/ServiceManager';
import { ServiceConfig } from './types/service';
import { LoggingService } from './services/LoggingService';
import { ConfigService } from './services/ConfigService';

/**
 * Application configuration
 */
const appConfig: ServiceConfig = {
  enabled: true,
  debug: process.env.NODE_ENV === 'development',
  timeout: 30000,
  retries: 3,
  retryDelay: 1000
};

/**
 * Service manager configuration
 */
const serviceManagerConfig = {
  ...appConfig,
  services: {
    config: {
      ...appConfig,
      debug: true // Always enable debug for config service
    },
    logging: {
      ...appConfig,
      debug: true // Always enable debug for logging service
    }
  }
};

/**
 * Main application entry point
 */
async function main() {
  const serviceManager = new ServiceManager(serviceManagerConfig);

  try {
    // Initialize service manager
    await serviceManager.initialize();

    // Get services
    const configService = serviceManager.getService<ConfigService>('config');
    const loggingService = serviceManager.getService<LoggingService>('logging');

    // Log application startup
    loggingService.info('Copernicus AI application started', {
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version
    });

    // TODO: Initialize additional services and start application logic

    // Handle graceful shutdown
    process.on('SIGTERM', async () => {
      loggingService.info('Received SIGTERM signal, initiating graceful shutdown');
      await serviceManager.cleanup();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      loggingService.info('Received SIGINT signal, initiating graceful shutdown');
      await serviceManager.cleanup();
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

// Start the application
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 