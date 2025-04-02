import { Headers as NodeHeaders } from 'node-fetch';
export declare class MockHeaders extends NodeHeaders {
    getSetCookie(): string[];
}
