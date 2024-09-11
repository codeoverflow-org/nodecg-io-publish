"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
const pishock_ts_1 = require("pishock-ts");
module.exports = (nodecg) => {
    new PiShockService(nodecg, "pishock", __dirname, "../schema.json").register();
};
class PiShockService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config) {
        for (const deviceConfig of config.authentications) {
            if (!/[0-9a-f-]+/.test(deviceConfig.apiKey)) {
                return (0, nodecg_io_core_1.error)(`Invalid PiShock apiKey format: ${deviceConfig.apiKey}`);
            }
            if (!/[0-9A-Z]+/.test(deviceConfig.code)) {
                return (0, nodecg_io_core_1.error)(`Invalid PiShock code format: ${deviceConfig.code}`);
            }
        }
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config, logger) {
        const devices = config.authentications.map((c) => {
            var _a;
            // Set name if missing.
            (_a = c.name) !== null && _a !== void 0 ? _a : (c.name = "nodecg-io PiShock Service");
            return new pishock_ts_1.PiShockDevice(c);
        });
        // Test connection and return error if any provided auth details fail to do the request.
        const connectionStates = await Promise.all(devices.map(async (dev) => {
            try {
                await dev.getInfo();
                return true;
            }
            catch (err) {
                return err;
            }
        }));
        for (const state of connectionStates) {
            if (state instanceof Error) {
                return (0, nodecg_io_core_1.error)(`Failed to connect to PiShock api: ${state.message}`);
            }
        }
        const client = { connectedDevices: devices };
        logger.info("Successfully created PiShock client.");
        return (0, nodecg_io_core_1.success)(client);
    }
    stopClient(_, _logger) {
        // Stateless REST API, cannot be stopped
    }
}
//# sourceMappingURL=index.js.map