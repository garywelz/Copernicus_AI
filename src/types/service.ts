import { CopernicusError } from '../utils/errors';

/**
 * Base service interface
 */
export interface BaseService {
  initialize(): Promise<void>;
  validate(): Promise<void>;
  cleanup(): Promise<void>;
}

/**
 * Service configuration interface
 */
export interface ServiceConfig {
  enabled: boolean;
  debug: boolean;
  timeout: number;
  retries: number;
  retryDelay: number;
}

/**
 * Service status interface
 */
export interface ServiceStatus {
  isInitialized: boolean;
  isRunning: boolean;
  lastError?: CopernicusError;
  uptime: number;
  metrics: Record<string, number>;
}

/**
 * Service result interface
 */
export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: CopernicusError;
  metadata?: Record<string, unknown>;
}

/**
 * Service event types
 */
export type ServiceEvent = 
  | 'initialized'
  | 'started'
  | 'stopped'
  | 'error'
  | 'cleanup';

/**
 * Service event handler
 */
export type ServiceEventHandler = (event: ServiceEvent, data?: unknown) => void;

/**
 * Service options
 */
export interface ServiceOptions {
  config: ServiceConfig;
  onEvent?: ServiceEventHandler;
  logger?: Console;
} 