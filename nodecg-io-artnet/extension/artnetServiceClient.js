"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtNetServiceClient = void 0;
const dist_1 = require("artnet-protocol/dist");
const protocol_1 = require("artnet-protocol/dist/protocol");
class ArtNetServiceClient extends dist_1.ArtNetController {
    constructor(config) {
        super();
        this.nameShort = "nodecg-io";
        this.nameLong = "https://github.com/codeoverflow-org/nodecg-io";
        this.bind(config.host);
    }
    /**
     * Little simplification to receive `dmx` data.
     */
    onDMX(listener) {
        return this.on("dmx", listener);
    }
    /**
     * Little simplification to send `dmx` data.
     */
    send(universe, data) {
        this.sendBroadcastPacket(new protocol_1.ArtDmx(0, 0, universe, data));
    }
}
exports.ArtNetServiceClient = ArtNetServiceClient;
//# sourceMappingURL=artnetServiceClient.js.map