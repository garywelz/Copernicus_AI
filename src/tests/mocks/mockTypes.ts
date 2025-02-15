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

export function createMockResponse(init: Partial<MockResponse>): Response {
  const response = {
    ok: init.ok ?? true,
    status: init.status ?? 200,
    statusText: init.statusText ?? 'OK',
    headers: new Headers(),
    url: 'test-url',
    redirected: false,
    type: 'default' as ResponseType,
    body: null,
    bodyUsed: false,
    bytes: () => Promise.resolve(new Uint8Array()),
    clone: function() { return this; },
    arrayBuffer: init.arrayBuffer ?? (() => Promise.resolve(new ArrayBuffer(0))),
    blob: () => Promise.resolve(new Blob()),
    formData: () => Promise.resolve(new FormData()),
    json: init.json ?? (() => Promise.resolve({})),
    text: init.text ?? (() => Promise.resolve(''))
  };

  return response as Response;
}

export type MockedLLMService = jest.Mocked<ILLMService>;
export type MockedVoiceService = jest.Mocked<IVoiceService>; 