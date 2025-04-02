import { Response } from 'node-fetch';
import { MockHeaders } from './mockHeaders';
interface MockResponseInit {
    ok?: boolean;
    status?: number;
    statusText?: string;
    json?: () => Promise<any>;
    text?: () => Promise<string>;
    arrayBuffer?: () => Promise<ArrayBuffer>;
    url?: string;
}
export interface MockResponse extends Response {
    ok: boolean;
    status: number;
    statusText: string;
    json: () => Promise<any>;
    text: () => Promise<string>;
    arrayBuffer: () => Promise<ArrayBuffer>;
    headers: MockHeaders;
    url: string;
    redirected: boolean;
    type: ResponseType;
    body: null;
    bodyUsed: boolean;
    bytes: () => Promise<Uint8Array>;
    clone: () => Response;
}
export declare function createMockResponse(init?: MockResponseInit): MockResponse;
export {};
