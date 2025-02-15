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

export function createMockResponse(init: MockResponseInit = {}): MockResponse {
  return {
    ok: init.ok ?? true,
    status: init.status ?? 200,
    statusText: init.statusText ?? 'OK',
    json: init.json ?? (() => Promise.resolve({})),
    text: init.text ?? (() => Promise.resolve('')),
    arrayBuffer: init.arrayBuffer ?? (() => Promise.resolve(new ArrayBuffer(0))),
    headers: new MockHeaders(),
    url: init.url ?? 'test-url',
    redirected: false,
    type: 'default' as ResponseType,
    body: null,
    bodyUsed: false,
    bytes: () => Promise.resolve(new Uint8Array()),
    clone: function() { return this as Response; }
  } as MockResponse;
} 