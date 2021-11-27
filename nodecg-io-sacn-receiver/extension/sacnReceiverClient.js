"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SacnReceiverServiceClient = void 0;
const sacn_1 = require("sacn");
class SacnReceiverServiceClient extends sacn_1.Receiver {
    constructor(config) {
        super(config);
    }
    onPacket(listener) {
        return this.on("packet", listener);
    }
    onPacketCorruption(listener) {
        return this.on("PacketCorruption", listener);
    }
    onPacketOutOfOrder(listener) {
        return this.on("PacketOutOfOrder", listener);
    }
    onError(listener) {
        return this.on("error", listener);
    }
    setUniverses(universes) {
        return (this.universes = universes);
    }
}
exports.SacnReceiverServiceClient = SacnReceiverServiceClient;
//# sourceMappingURL=sacnReceiverClient.js.map