"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecg_io_core_1 = require("nodecg-io-core");
const obs_websocket_js_1 = (0, tslib_1.__importDefault)(require("obs-websocket-js"));
module.exports = (nodecg) => {
    new OBSService(nodecg, "obs", __dirname, "../obs-schema.json").register();
};
class OBSService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config) {
        const client = new obs_websocket_js_1.default();
        try {
            await client.connect({ address: `${config.host}:${config.port}`, password: config.password });
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
            await client.connect({ address: `${config.host}:${config.port}`, password: config.password });
            logger.info("Connected to OBS successfully.");
        }
        catch (e) {
            return (0, nodecg_io_core_1.error)(e.error);
        }
        return (0, nodecg_io_core_1.success)(client);
    }
    stopClient(client) {
        client.disconnect();
    }
    removeHandlers(client) {
        client.removeAllListeners();
    }
}
//# sourceMappingURL=index.js.map