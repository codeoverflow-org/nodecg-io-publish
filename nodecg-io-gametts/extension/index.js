"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameTTSClient = void 0;
const nodecg_io_core_1 = require("nodecg-io-core");
const gameTtsClient_1 = require("./gameTtsClient");
var gameTtsClient_2 = require("./gameTtsClient");
Object.defineProperty(exports, "GameTTSClient", { enumerable: true, get: function () { return gameTtsClient_2.GameTTSClient; } });
module.exports = (nodecg) => {
    new GameTTSService(nodecg, "gametts", __dirname, "../schema.json").register();
};
class GameTTSService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(_) {
        // Connectivity check is done below
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config, logger) {
        const client = new gameTtsClient_1.GameTTSClient(config);
        const connectivityCheckResult = await client.isGameTTSAvailable();
        if (connectivityCheckResult.failed) {
            return connectivityCheckResult;
        }
        logger.info("Successfully created gametts client.");
        return (0, nodecg_io_core_1.success)(client);
    }
    stopClient(_, _logger) {
        // Client is stateless, no need to stop anything
    }
}
//# sourceMappingURL=index.js.map