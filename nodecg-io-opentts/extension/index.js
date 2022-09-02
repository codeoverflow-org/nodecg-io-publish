"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenTTSClient = void 0;
const nodecg_io_core_1 = require("nodecg-io-core");
const openTtsClient_1 = require("./openTtsClient");
var openTtsClient_2 = require("./openTtsClient");
Object.defineProperty(exports, "OpenTTSClient", { enumerable: true, get: function () { return openTtsClient_2.OpenTTSClient; } });
module.exports = (nodecg) => {
    new OpenTTSService(nodecg, "opentts", __dirname, "../schema.json").register();
};
class OpenTTSService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config) {
        if (await openTtsClient_1.OpenTTSClient.isOpenTTSAvailable(config))
            return (0, nodecg_io_core_1.emptySuccess)();
        else
            return (0, nodecg_io_core_1.error)("Unable to reach OpenTTS server at the specified host address");
    }
    async createClient(config, logger) {
        const client = new openTtsClient_1.OpenTTSClient(config);
        logger.info("Successfully created OpenTTS client.");
        return (0, nodecg_io_core_1.success)(client);
    }
    stopClient(_, logger) {
        // Client is stateless, no need to stop anything
    }
}
//# sourceMappingURL=index.js.map