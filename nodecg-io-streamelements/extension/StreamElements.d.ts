/// <reference types="node" />
import { Result } from "nodecg-io-core";
import { StreamElementsCheerEvent, StreamElementsEvent, StreamElementsFollowEvent, StreamElementsHostEvent, StreamElementsRaidEvent, StreamElementsSubscriberEvent, StreamElementsTestCheerEvent, StreamElementsTestFollowEvent, StreamElementsTestHostEvent, StreamElementsTestRaidEvent, StreamElementsTestSubscriberEvent, StreamElementsTestTipEvent, StreamElementsTipEvent } from "./StreamElementsEvent";
import { EventEmitter } from "events";
import { Replicant } from "nodecg-types/types/server";
export interface StreamElementsReplicant {
    lastSubscriber?: StreamElementsSubscriberEvent;
    lastTip?: StreamElementsTipEvent;
    lastCheer?: StreamElementsCheerEvent;
    lastGift?: StreamElementsSubscriberEvent;
    lastFollow?: StreamElementsFollowEvent;
    lastRaid?: StreamElementsRaidEvent;
    lastHost?: StreamElementsHostEvent;
}
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
    onSubscriber(handler: (data: StreamElementsSubscriberEvent) => void): void;
    onTip(handler: (data: StreamElementsTipEvent) => void): void;
    onCheer(handler: (data: StreamElementsCheerEvent) => void): void;
    onGift(handler: (data: StreamElementsSubscriberEvent) => void): void;
    onFollow(handler: (data: StreamElementsFollowEvent) => void): void;
    onRaid(handler: (data: StreamElementsRaidEvent) => void): void;
    onHost(handler: (data: StreamElementsHostEvent) => void): void;
    onTest(handler: (data: StreamElementsEvent) => void): void;
    onTestSubscription(handler: (data: StreamElementsTestSubscriberEvent) => void): void;
    onTestCheer(handler: (data: StreamElementsTestCheerEvent) => void): void;
    onTestGift(handler: (data: StreamElementsTestSubscriberEvent) => void): void;
    onTestFollow(handler: (data: StreamElementsTestFollowEvent) => void): void;
    onTestRaid(handler: (data: StreamElementsTestRaidEvent) => void): void;
    onTestHost(handler: (data: StreamElementsTestHostEvent) => void): void;
    onTestTip(handler: (data: StreamElementsTestTipEvent) => void): void;
    setupReplicant(rep: Replicant<StreamElementsReplicant>): void;
}
//# sourceMappingURL=StreamElements.d.ts.map