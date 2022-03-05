"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecg_io_core_1 = require("nodecg-io-core");
const WebSocket = tslib_1.__importStar(require("ws"));
module.exports = (nodecg) => {
    new WSServerService(nodecg, "websocket-server", __dirname, "../ws-schema.json").register();
};
class WSServerService extends nodecg_io_core_1.ServiceBundle {
    async getServer(config) {
        const client = new WebSocket.Server({ port: config.port });
        // The constructor doesn't block, so we either wait till the server has been started or a
        // error has been produced.
        return await new Promise((resolve) => {
            client.once("listening", () => {
                // Will be called if everything went fine
                resolve((0, nodecg_io_core_1.success)(client));
            });
            client.once("error", (err) => {
                // Will be called if there is an error
                resolve((0, nodecg_io_core_1.error)(err.message));
            });
        });
    }
    async validateConfig(config) {
        const client = await this.getServer(config);
        if (!client.failed) {
            client.result.close(); // Close the server after testing that it can be opened
            return (0, nodecg_io_core_1.emptySuccess)();
        }
        else {
            return client; // Return produced error
        }
    }
    async createClient(config, logger) {
        const client = await this.getServer(config);
        if (client.failed) {
            return client; // Pass the error to the framework
        }
        logger.info("Successfully started WebSocket server.");
        return (0, nodecg_io_core_1.success)(client.result);
    }
    stopClient(client) {
        client.close();
    }
    removeHandlers(client) {
        client.removeAllListeners();
        // Drop all clients so that they have to reconnect and the bundles using
        // ws.on("connection", ...) handlers are re-run
        client.clients.forEach((client) => {
            client.close();
        });
    }
}
//# sourceMappingURL=index.js.map