import { Headers as NodeHeaders } from 'node-fetch';

export class MockHeaders extends NodeHeaders {
  getSetCookie(): string[] {
    return [];
  }
} 