export interface StorageOptions {
  bucket: string;
  projectId: string;
  credentials?: Record<string, any>;
}

export interface StorageResult {
  success: boolean;
  url?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export interface FileMetadata {
  contentType: string;
  size: number;
  lastModified: Date;
  metadata?: Record<string, any>;
}

export interface FileInfo {
  name: string;
  path: string;
  size: number;
  contentType: string;
  lastModified: Date;
  metadata?: Record<string, any>;
}

export interface StorageError extends Error {
  code: string;
  statusCode?: number;
} 