"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecg_io_core_1 = require("nodecg-io-core");
const obs_websocket_js_1 = tslib_1.__importDefault(require("obs-websocket-js"));
module.exports = (nodecg) => {
    new OBSService(nodecg, "obs", __dirname, "../obs-schema.json").register();
};
class OBSService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config) {
        const client = new obs_websocket_js_1.default();
        try {
            await this.connectClient(client, config);
            client.disconnect();
        }
        catch (e) {
            return (0, nodecg_io_core_1.error)(e.error);
        }
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config, logger) {
        const client = new obs_websocket_js_1.default();
        try {
            await this.connectClient(client, config);
            logger.info("Connected to OBS successfully.");
        }
        catch (e) {
            return (0, nodecg_io_core_1.error)(e.message);
        }
        return (0, nodecg_io_core_1.success)(client);
    }
    async connectClient(client, config) {
        const protocol = config.isSecure ? "wss" : "ws";
        await client.connect(`${protocol}://${config.host}:${config.port}`, config.password);
    }
    stopClient(client) {
        client.disconnect();
    }
    removeHandlers(client) {
        client.removeAllListeners();
    }
}
//# sourceMappingURL=index.js.map