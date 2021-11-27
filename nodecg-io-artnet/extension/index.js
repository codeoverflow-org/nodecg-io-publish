"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtNetServiceClient = void 0;
const nodecg_io_core_1 = require("nodecg-io-core");
var artnetServiceClient_1 = require("./artnetServiceClient");
Object.defineProperty(exports, "ArtNetServiceClient", { enumerable: true, get: function () { return artnetServiceClient_1.ArtNetServiceClient; } });
const artnetServiceClient_2 = require("./artnetServiceClient");
module.exports = (nodecg) => {
    new ArtNetService(nodecg, "artnet", __dirname, "../artnet-schema.json").register();
};
class ArtNetService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig() {
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config) {
        const client = new artnetServiceClient_2.ArtNetServiceClient(config);
        return (0, nodecg_io_core_1.success)(client);
    }
    stopClient(client, logger) {
        client.close();
        logger.info("Successfully stopped the Art-Net service.");
    }
    removeHandlers(client) {
        client.removeAllListeners();
    }
}
//# sourceMappingURL=index.js.map