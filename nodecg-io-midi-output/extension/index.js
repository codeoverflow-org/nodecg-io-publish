"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecg_io_core_1 = require("nodecg-io-core");
const easymidi = tslib_1.__importStar(require("easymidi"));
module.exports = (nodecg) => {
    new MidiService(nodecg, "midi-output", __dirname, "../midi-output-schema.json").register();
};
class MidiService extends nodecg_io_core_1.ServiceBundle {
    constructor() {
        super(...arguments);
        this.presets = Object.fromEntries(easymidi.getOutputs().map((device) => [device, { device }]));
    }
    async validateConfig(config) {
        const devices = new Array();
        // Virtual devices can always be created, easymidi will find a
        // free name for the matching input
        if (!config.virtual) {
            easymidi.getOutputs().forEach((device) => {
                if (device.includes(config.device)) {
                    devices.push(device);
                }
            });
            if (devices.length === 0) {
                return (0, nodecg_io_core_1.error)("No device matched the configured pattern.");
            }
            if (devices.length > 1) {
                return (0, nodecg_io_core_1.error)("The configured pattern is ambiguous.");
            }
        }
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config, logger) {
        if (config.virtual) {
            logger.info(`Creating virtual MIDI output device ${config.device}.`);
            const client = new easymidi.Output(config.device, true);
            logger.info(`Successfully created virtual MIDI output device ${config.device}.`);
            return (0, nodecg_io_core_1.success)(client);
        }
        else {
            logger.info(`Checking device name "${config.device}".`);
            let deviceName = null;
            easymidi.getOutputs().forEach((device) => {
                if (device.includes(config.device) && deviceName === null) {
                    deviceName = device;
                }
            });
            logger.info(`Connecting to MIDI output device ${deviceName}.`);
            if (deviceName !== null) {
                const client = new easymidi.Output(deviceName);
                if (client.isPortOpen()) {
                    logger.info(`Successfully connected to MIDI output device ${deviceName}.`);
                    return (0, nodecg_io_core_1.success)(client);
                }
            }
            return (0, nodecg_io_core_1.error)("Could not connect to the configured device!");
        }
    }
    stopClient(client) {
        client.close();
    }
}
//# sourceMappingURL=index.js.map