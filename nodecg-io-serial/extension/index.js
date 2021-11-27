"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerialServiceClient = void 0;
const nodecg_io_core_1 = require("nodecg-io-core");
const SerialClient_1 = require("./SerialClient");
module.exports = (nodecg) => {
    new SerialService(nodecg, "serial", __dirname, "../serial-schema.json").register();
};
var SerialClient_2 = require("./SerialClient");
Object.defineProperty(exports, "SerialServiceClient", { enumerable: true, get: function () { return SerialClient_2.SerialServiceClient; } });
class SerialService extends nodecg_io_core_1.ServiceBundle {
    constructor(nodecg, serviceName, ...pathSegments) {
        super(nodecg, serviceName, ...pathSegments);
        this.presets = {};
        SerialClient_1.SerialServiceClient.getConnectedDevices()
            .then((devices) => {
            this.presets = Object.fromEntries(devices.map((dev) => [
                // If we have the manufacturer and serial we can use a human friendly name, otherwise we need to fallback to the OS serial port
                dev.device.manufacturer && dev.device.serialNumber
                    ? `${dev.device.manufacturer}:${dev.device.serialNumber}`
                    : dev.device.port,
                dev,
            ]));
        })
            .catch((err) => {
            nodecg.log.error(`Failed to get connected devices for presets: ${err}`);
        });
    }
    async validateConfig(config) {
        const result = await SerialClient_1.SerialServiceClient.inferPort(config.device);
        return result.failed ? (0, nodecg_io_core_1.error)(result.errorMessage) : (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config) {
        return await SerialClient_1.SerialServiceClient.createClient(config);
    }
    stopClient(client) {
        client.close();
    }
    removeHandlers(client) {
        client.removeAllListeners();
        client.removeAllParserListeners();
    }
}
//# sourceMappingURL=index.js.map