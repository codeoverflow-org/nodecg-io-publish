"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
const intellij_1 = require("./intellij");
module.exports = (nodecg) => {
    new IntellijService(nodecg, "intellij", __dirname, "../intellij-schema.json").register();
};
class IntellijService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config) {
        const ij = new intellij_1.IntelliJ(config.address);
        await ij.rawRequest("available_methods", {});
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config, logger) {
        const ij = new intellij_1.IntelliJ(config.address);
        await ij.rawRequest("available_methods", {});
        logger.info(`Successfully connected to IntelliJ at ${ij.address}.`);
        return (0, nodecg_io_core_1.success)(ij);
    }
    stopClient() {
        // Not needed or possible
    }
}
//# sourceMappingURL=index.js.map