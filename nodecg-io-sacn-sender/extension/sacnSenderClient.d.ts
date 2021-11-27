import { Packet, Sender } from "sacn";
import { SacnSenderServiceConfig } from "./index";
export declare class SacnSenderServiceClient extends Sender {
    constructor(config: SacnSenderServiceConfig);
    /**
     * Send Payload via sACN
     *
     * The `payload` is an json object with following entries:
     *
     * DMX channel (1-512) : percentage value
     */
    sendPayload(payload: Record<number, number>): Promise<void>;
    /**
     * Send a Packet via sACN
     *
     * A `packet` is the low-level implementation of the E1.31 (sACN) protocol.
     * Constructed from either an existing `Buffer` or from `Options`.
     */
    sendPacket(packet: Packet): Promise<void>;
    /**
     * Returns the Universe specified in the GUI
     */
    getUniverse(): number;
}
//# sourceMappingURL=sacnSenderClient.d.ts.map