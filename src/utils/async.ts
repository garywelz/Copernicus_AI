import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { logger } from './logger';

export const execAsync = promisify(exec);

export const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export const retry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error | undefined;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await sleep(delay * Math.pow(2, i));
        continue;
      }
      throw error;
    }
  }
  
  throw lastError || new Error('Operation failed after retries');
};

export const timeout = async <T>(
  promise: Promise<T>,
  ms: number,
  errorMessage: string = 'Operation timed out'
): Promise<T> => {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), ms);
  });
  return Promise.race([promise, timeoutPromise]);
};

export const parallel = async <T>(
  operations: (() => Promise<T>)[],
  maxConcurrent: number = 3
): Promise<T[]> => {
  const results: T[] = [];
  const chunks = [];
  
  for (let i = 0; i < operations.length; i += maxConcurrent) {
    chunks.push(operations.slice(i, i + maxConcurrent));
  }
  
  for (const chunk of chunks) {
    const chunkResults = await Promise.all(chunk.map(op => op()));
    results.push(...chunkResults);
  }
  
  return results;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}; 