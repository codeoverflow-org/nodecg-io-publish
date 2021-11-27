"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
const atem_connection_1 = require("atem-connection");
module.exports = (nodecg) => {
    new AtemService(nodecg, "atem", __dirname, "../atem-schema.json").register();
};
class AtemService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config) {
        return new Promise((resolve, reject) => {
            const atem = new atem_connection_1.Atem(config);
            atem.connect(config.address, config.port);
            atem.on("connected", () => resolve((0, nodecg_io_core_1.emptySuccess)()));
            atem.on("error", (e) => reject((0, nodecg_io_core_1.error)(e)));
        });
    }
    async createClient(config) {
        return new Promise((resolve, _) => {
            const atem = new atem_connection_1.Atem(config);
            atem.connect(config.address, config.port);
            atem.on("connected", () => resolve((0, nodecg_io_core_1.success)(atem)));
        });
    }
    stopClient(client) {
        client.disconnect();
    }
    removeHandlers(client) {
        client.removeAllListeners();
    }
}
//# sourceMappingURL=index.js.map