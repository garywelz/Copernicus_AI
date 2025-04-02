import { Response, Headers } from 'node-fetch';
import type { SpyInstance } from 'jest';
import type { ILLMService } from '../../services/interfaces/ILLMService';
import type { IVoiceService } from '../../services/interfaces/IVoiceService';
export type FetchSpyInstance = SpyInstance<Promise<Response>>;
export interface MockResponse extends Response {
    ok: boolean;
    status: number;
    statusText: string;
    headers: Headers;
    url: string;
    redirected: boolean;
    type: ResponseType;
    body: null;
    bodyUsed: false;
    bytes(): Promise<Uint8Array>;
    clone(): Response;
    arrayBuffer(): Promise<ArrayBuffer>;
    blob(): Promise<Blob>;
    formData(): Promise<FormData>;
    json(): Promise<any>;
    text(): Promise<string>;
}
export declare function createMockResponse(init: Partial<MockResponse>): Response;
export type MockedLLMService = jest.Mocked<ILLMService>;
export type MockedVoiceService = jest.Mocked<IVoiceService>;
