export interface ImageGenerationOptions {
    prompt: string;
    width?: number;
    height?: number;
    format?: string;
    quality?: number;
    style?: string;
    negativePrompt?: string;
    metadata?: Record<string, any>;
}
export interface ImageProcessingOptions {
    resize?: {
        width?: number;
        height?: number;
        fit?: 'cover' | 'contain' | 'fill';
    };
    crop?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    rotate?: number;
    flip?: 'horizontal' | 'vertical';
    format?: string;
    quality?: number;
    metadata?: Record<string, any>;
}
export interface ThumbnailOptions {
    width: number;
    height: number;
    fit?: 'cover' | 'contain' | 'fill';
    format?: string;
    quality?: number;
    metadata?: Record<string, any>;
}
export interface GeneratedImage {
    url: string;
    width: number;
    height: number;
    format: string;
    size: number;
    metadata?: Record<string, any>;
}
export interface ImageValidationResult {
    isValid: boolean;
    errors?: string[];
    metadata?: Record<string, any>;
}
