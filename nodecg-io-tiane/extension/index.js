"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
const tiane_1 = require("./tiane");
module.exports = (nodecg) => {
    new TianeService(nodecg, "tiane", __dirname, "../tiane-schema.json").register();
};
class TianeService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config) {
        (await tiane_1.Tiane.connect(config.address)).close();
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config, logger) {
        logger.info("Connecting to TIANE...");
        const client = await tiane_1.Tiane.connect(config.address);
        logger.info("Successfully connected to TIANE.");
        return (0, nodecg_io_core_1.success)(client);
    }
    stopClient(client, logger) {
        client.close();
        logger.info("Disconnected from TIANE.");
    }
    removeHandlers(client) {
        client.removeAllListeners();
    }
}
//# sourceMappingURL=index.js.map