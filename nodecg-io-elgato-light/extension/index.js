"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElgatoLightClient = exports.ElgatoLightStrip = exports.ElgatoKeyLight = exports.ElgatoLight = void 0;
const nodecg_io_core_1 = require("nodecg-io-core");
const elgatoLightClient_1 = require("./elgatoLightClient");
var elgatoLight_1 = require("./elgatoLight");
Object.defineProperty(exports, "ElgatoLight", { enumerable: true, get: function () { return elgatoLight_1.ElgatoLight; } });
Object.defineProperty(exports, "ElgatoKeyLight", { enumerable: true, get: function () { return elgatoLight_1.ElgatoKeyLight; } });
Object.defineProperty(exports, "ElgatoLightStrip", { enumerable: true, get: function () { return elgatoLight_1.ElgatoLightStrip; } });
var elgatoLightClient_2 = require("./elgatoLightClient");
Object.defineProperty(exports, "ElgatoLightClient", { enumerable: true, get: function () { return elgatoLightClient_2.ElgatoLightClient; } });
module.exports = (nodecg) => {
    new ElgatoLightService(nodecg, "elgato-light", __dirname, "../schema.json").register();
};
class ElgatoLightService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config) {
        const notReachableLights = await new elgatoLightClient_1.ElgatoLightClient(config).identifyNotReachableLights();
        if (notReachableLights.length === 0) {
            return (0, nodecg_io_core_1.emptySuccess)();
        }
        return (0, nodecg_io_core_1.error)(`Unable to connect to the lights with the following IPs: ${notReachableLights.join(", ")}`);
    }
    async createClient(config, logger) {
        const client = new elgatoLightClient_1.ElgatoLightClient(config);
        logger.info("Successfully created Elgato light clients.");
        return (0, nodecg_io_core_1.success)(client);
    }
    stopClient(_, logger) {
        logger.info("Successfully stopped Elgato light clients.");
    }
}
//# sourceMappingURL=index.js.map