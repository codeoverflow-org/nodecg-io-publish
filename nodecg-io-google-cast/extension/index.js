"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleCastClient = void 0;
const tslib_1 = require("tslib");
const nodecg_io_core_1 = require("nodecg-io-core");
const castClient_1 = require("./castClient");
const chromecast_api_1 = tslib_1.__importDefault(require("chromecast-api"));
var castClient_2 = require("./castClient");
Object.defineProperty(exports, "GoogleCastClient", { enumerable: true, get: function () { return castClient_2.GoogleCastClient; } });
module.exports = (nodecg) => {
    new GoogleCastService(nodecg).register();
};
class GoogleCastService extends nodecg_io_core_1.ServiceBundle {
    constructor(nodecg) {
        super(nodecg, "google-cast", __dirname, "../schema.json");
        this.autoDiscoveryClient = new chromecast_api_1.default();
        this.autoDiscoveryClient.on("device", (device) => {
            if (this.presets === undefined)
                this.presets = {};
            this.presets[device.friendlyName] = {
                name: device.name,
                friendlyName: device.friendlyName,
                host: device.host,
            };
        });
    }
    async validateConfig(_) {
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config, logger) {
        const client = await castClient_1.GoogleCastClient.createClient(config);
        logger.info("Successfully created google-cast client.");
        return (0, nodecg_io_core_1.success)(client);
    }
    stopClient(client, logger) {
        client.close();
        logger.info("Successfully stopped google-cast client.");
    }
    removeHandlers(client) {
        client.removeAllListeners();
    }
}
//# sourceMappingURL=index.js.map