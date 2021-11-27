/// <reference types="node" />
import { Packet, Receiver } from "sacn";
import { AssertionError } from "assert";
import { SacnReceiverServiceConfig } from "./index";
export declare class SacnReceiverServiceClient extends Receiver {
    constructor(config: SacnReceiverServiceConfig);
    onPacket(listener: (packet: Packet) => void): Receiver;
    onPacketCorruption(listener: (err: AssertionError) => void): Receiver;
    onPacketOutOfOrder(listener: (err: Error) => void): Receiver;
    onError(listener: (err: Error) => void): Receiver;
    setUniverses(universes: number[]): number[];
}
//# sourceMappingURL=sacnReceiverClient.d.ts.map