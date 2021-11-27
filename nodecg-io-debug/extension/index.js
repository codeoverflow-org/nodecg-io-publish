"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugHelper = void 0;
const nodecg_io_core_1 = require("nodecg-io-core");
const debugHelper_1 = require("./debugHelper");
var debugHelper_2 = require("./debugHelper");
Object.defineProperty(exports, "DebugHelper", { enumerable: true, get: function () { return debugHelper_2.DebugHelper; } });
module.exports = (nodecg) => {
    new DebugService(nodecg, "debug").register();
};
class DebugService extends nodecg_io_core_1.ServiceBundle {
    constructor() {
        super(...arguments);
        this.requiresNoConfig = true;
    }
    async validateConfig() {
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(_, logger) {
        const client = debugHelper_1.DebugHelper.createClient(this.nodecg, logger);
        logger.info("Successfully created debug helper.");
        return (0, nodecg_io_core_1.success)(client);
    }
    stopClient(_, logger) {
        logger.info("Successfully stopped debug client.");
    }
    removeHandlers(client) {
        client.removeAllListeners();
    }
}
//# sourceMappingURL=index.js.map