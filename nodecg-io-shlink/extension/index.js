"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
const shlink_client_1 = require("shlink-client");
module.exports = (nodecg) => {
    new ShlinkService(nodecg, "shlink", __dirname, "../shlink-schema.json").register();
};
class ShlinkService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config) {
        const client = new shlink_client_1.ShlinkClient({ url: config.url, token: config.apiKey });
        await client.countVisits(); // will throw a meaningful error if something went wrong
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config) {
        const client = new shlink_client_1.ShlinkClient({ url: config.url, token: config.apiKey });
        return (0, nodecg_io_core_1.success)(client);
    }
    stopClient(_client) {
        // not needed or possible
    }
}
//# sourceMappingURL=index.js.map