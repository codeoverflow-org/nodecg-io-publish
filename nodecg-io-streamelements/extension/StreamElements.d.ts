/// <reference types="node" />
import { Result } from "nodecg-io-core";
import { StreamElementsEvent } from "./StreamElementsEvent";
import { EventEmitter } from "events";
export declare class StreamElementsServiceClient extends EventEmitter {
    private jwtToken;
    private handleTestEvents;
    private socket;
    constructor(jwtToken: string, handleTestEvents: boolean);
    private createSocket;
    private registerEvents;
    connect(): Promise<void>;
    testConnection(): Promise<Result<void>>;
    close(): void;
    private onConnect;
    private onAuthenticated;
    private onUnauthorized;
    private onConnectionError;
    private onEvent;
    private onTestEvent;
    onSubscriber(handler: (data: StreamElementsEvent) => void): void;
    onTip(handler: (data: StreamElementsEvent) => void): void;
    onCheer(handler: (data: StreamElementsEvent) => void): void;
    onGift(handler: (data: StreamElementsEvent) => void): void;
    onFollow(handler: (data: StreamElementsEvent) => void): void;
    onRaid(handler: (data: StreamElementsEvent) => void): void;
    onHost(handler: (data: StreamElementsEvent) => void): void;
    onTest(handler: (data: StreamElementsEvent) => void): void;
}
//# sourceMappingURL=StreamElements.d.ts.map