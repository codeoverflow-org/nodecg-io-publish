/// <reference types="node" />
import { Result } from "nodecg-io-core";
import { StreamElementsCheerEvent, StreamElementsFollowEvent, StreamElementsHostEvent, StreamElementsRaidEvent, StreamElementsSubBombEvent, StreamElementsSubscriberEvent, StreamElementsTipEvent } from "./StreamElementsEvent";
import { EventEmitter } from "events";
import NodeCG from "@nodecg/types";
export interface StreamElementsReplicant {
    lastSubscriber?: StreamElementsSubscriberEvent;
    lastSubBomb?: StreamElementsSubBombEvent;
    lastTip?: StreamElementsTipEvent;
    lastCheer?: StreamElementsCheerEvent;
    lastGift?: StreamElementsSubscriberEvent;
    lastFollow?: StreamElementsFollowEvent;
    lastRaid?: StreamElementsRaidEvent;
    lastHost?: StreamElementsHostEvent;
}
export declare class StreamElementsServiceClient extends EventEmitter {
    private jwtToken;
    private socket;
    private subBombDetectionMap;
    constructor(jwtToken: string);
    private createSocket;
    private registerEvents;
    private handleSubGift;
    connect(): Promise<void>;
    testConnection(): Promise<Result<void>>;
    close(): void;
    private onConnect;
    private onAuthenticated;
    private onUnauthorized;
    private onConnectionError;
    private onEvent;
    onSubscriber(handler: (data: StreamElementsSubscriberEvent) => void, includeSubGifts?: boolean): void;
    onSubscriberBomb(handler: (data: StreamElementsSubBombEvent) => void): void;
    onTip(handler: (data: StreamElementsTipEvent) => void): void;
    onCheer(handler: (data: StreamElementsCheerEvent) => void): void;
    onGift(handler: (data: StreamElementsSubscriberEvent) => void): void;
    onFollow(handler: (data: StreamElementsFollowEvent) => void): void;
    onRaid(handler: (data: StreamElementsRaidEvent) => void): void;
    onHost(handler: (data: StreamElementsHostEvent) => void): void;
    setupReplicant(rep: NodeCG.ServerReplicant<StreamElementsReplicant>): void;
}
//# sourceMappingURL=StreamElements.d.ts.map