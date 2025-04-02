import { exec } from 'child_process';
export declare const execAsync: typeof exec.__promisify__;
export declare const sleep: (ms: number) => Promise<void>;
export declare const retry: <T>(operation: () => Promise<T>, maxRetries?: number, delay?: number) => Promise<T>;
export declare const timeout: <T>(promise: Promise<T>, ms: number, errorMessage?: string) => Promise<T>;
export declare const parallel: <T>(operations: (() => Promise<T>)[], maxConcurrent?: number) => Promise<T[]>;
export declare const debounce: <T extends (...args: any[]) => any>(func: T, wait: number) => ((...args: Parameters<T>) => void);
export declare const throttle: <T extends (...args: any[]) => any>(func: T, limit: number) => ((...args: Parameters<T>) => void);
