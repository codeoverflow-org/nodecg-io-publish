"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
const AHK_1 = require("./AHK");
module.exports = (nodecg) => {
    new AhkService(nodecg, "ahk", __dirname, "../ahk-schema.json").register();
};
class AhkService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config, logger) {
        const ahk = new AHK_1.AHK(logger, config.host, config.port);
        await ahk.testConnection(); // Will throw an error if server doesn't exist.
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config, logger) {
        const ahk = new AHK_1.AHK(logger, config.host, config.port);
        return (0, nodecg_io_core_1.success)(ahk);
    }
    stopClient() {
        // Not needed or possible
    }
}
//# sourceMappingURL=index.js.map