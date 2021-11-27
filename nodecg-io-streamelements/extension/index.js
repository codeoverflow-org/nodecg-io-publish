"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamElementsServiceClient = void 0;
const nodecg_io_core_1 = require("nodecg-io-core");
const StreamElements_1 = require("./StreamElements");
var StreamElements_2 = require("./StreamElements");
Object.defineProperty(exports, "StreamElementsServiceClient", { enumerable: true, get: function () { return StreamElements_2.StreamElementsServiceClient; } });
module.exports = (nodecg) => {
    const schemaPath = [__dirname, "../streamelements-schema.json"];
    new StreamElementsService(nodecg, "streamelements", ...schemaPath).register();
};
class StreamElementsService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config) {
        return new StreamElements_1.StreamElementsServiceClient(config.jwtToken, config.handleTestEvents).testConnection();
    }
    async createClient(config, logger) {
        logger.info("Connecting to StreamElements socket server...");
        const client = new StreamElements_1.StreamElementsServiceClient(config.jwtToken, config.handleTestEvents);
        await client.connect();
        logger.info("Successfully connected to StreamElements socket server.");
        return (0, nodecg_io_core_1.success)(client);
    }
    stopClient(client) {
        client.close();
    }
    removeHandlers(client) {
        client.removeAllListeners();
    }
}
//# sourceMappingURL=index.js.map