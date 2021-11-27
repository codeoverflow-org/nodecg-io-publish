"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SacnSenderServiceClient = void 0;
const sacn_1 = require("sacn");
class SacnSenderServiceClient extends sacn_1.Sender {
    constructor(config) {
        super(config);
    }
    /**
     * Send Payload via sACN
     *
     * The `payload` is an json object with following entries:
     *
     * DMX channel (1-512) : percentage value
     */
    sendPayload(payload) {
        return this.send({
            payload: payload,
            sourceName: "nodecg-io",
            priority: 100,
        });
    }
    /**
     * Send a Packet via sACN
     *
     * A `packet` is the low-level implementation of the E1.31 (sACN) protocol.
     * Constructed from either an existing `Buffer` or from `Options`.
     */
    sendPacket(packet) {
        return this.send(packet);
    }
    /**
     * Returns the Universe specified in the GUI
     */
    getUniverse() {
        return this.universe;
    }
}
exports.SacnSenderServiceClient = SacnSenderServiceClient;
//# sourceMappingURL=sacnSenderClient.js.map