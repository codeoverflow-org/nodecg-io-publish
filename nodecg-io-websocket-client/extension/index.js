"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSClientServiceClient = void 0;
const tslib_1 = require("tslib");
const nodecg_io_core_1 = require("nodecg-io-core");
const ws_1 = tslib_1.__importDefault(require("ws"));
class WSClientServiceClient extends ws_1.default {
    constructor(address) {
        super(address);
    }
    onClose(func) {
        return this.on("close", func);
    }
    onMessage(func) {
        return this.on("message", func);
    }
    onError(func) {
        return this.on("error", func);
    }
}
exports.WSClientServiceClient = WSClientServiceClient;
module.exports = (nodecg) => {
    new WSClientService(nodecg, "websocket-client", __dirname, "../ws-schema.json").register();
};
class WSClientService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config) {
        const client = new WSClientServiceClient(config.address); // Let Websocket connect, will throw an error if it doesn't work.
        await new Promise((resolve, reject) => {
            client.once("error", reject);
            client.on("open", () => {
                client.off("error", reject);
                resolve(undefined);
            });
        });
        client.close();
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config, logger) {
        const client = new WSClientServiceClient(config.address); // Let Websocket connect, will throw an error if it doesn't work.
        await new Promise((resolve, reject) => {
            client.once("error", reject);
            client.on("open", () => {
                client.off("error", reject);
                resolve(undefined);
            });
        });
        logger.info("Successfully connected to the WebSocket server.");
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