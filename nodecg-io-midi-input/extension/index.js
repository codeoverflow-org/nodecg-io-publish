"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecg_io_core_1 = require("nodecg-io-core");
const easymidi = tslib_1.__importStar(require("easymidi"));
module.exports = (nodecg) => {
    new MidiService(nodecg, "midi-input", __dirname, "../midi-input-schema.json").register();
};
class MidiService extends nodecg_io_core_1.ServiceBundle {
    constructor() {
        super(...arguments);
        this.presets = Object.fromEntries(easymidi.getInputs().map((device) => [device, { device }]));
    }
    async validateConfig(config) {
        const devices = new Array();
        // Virtual devices can always be created, easymidi will find a
        // free name for the matching input
        if (!config.virtual) {
            easymidi.getInputs().forEach((device) => {
                if (device.includes(config.device)) {
                    devices.push(device);
                }
            });
            if (devices.length === 0) {
                return (0, nodecg_io_core_1.error)("No device matched the configured pattern.");
            }
            // If we have a device with the exact same name we prioritize it and use that device.
            // If we have no exact match an ambiguous pattern is not allowed.
            if (devices.length > 1 && !devices.includes(config.device)) {
                return (0, nodecg_io_core_1.error)("The configured pattern is ambiguous.");
            }
        }
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config, logger) {
        if (config.virtual) {
            logger.info(`Creating virtual MIDI input device ${config.device}.`);
            const client = new easymidi.Input(config.device, true);
            logger.info(`Successfully created virtual MIDI input device ${config.device}.`);
            return (0, nodecg_io_core_1.success)(client);
        }
        else {
            logger.info(`Checking device name "${config.device}".`);
            let deviceName = null;
            const allDevices = easymidi.getInputs();
            if (allDevices.includes(config.device)) {
                // If we have a device with the correct name we use that device.
                deviceName = config.device;
            }
            else {
                // Otherwise we find a device which contains the pattern.
                easymidi.getInputs().forEach((device) => {
                    if (device.includes(config.device) && deviceName === null) {
                        deviceName = device;
                    }
                });
            }
            logger.info(`Connecting to MIDI input device ${deviceName}.`);
            if (deviceName !== null) {
                const client = new easymidi.Input(deviceName);
                if (client.isPortOpen()) {
                    logger.info(`Successfully connected to MIDI input device ${deviceName}.`);
                    return (0, nodecg_io_core_1.success)(client);
                }
            }
            return (0, nodecg_io_core_1.error)("Could not connect to the configured device!");
        }
    }
    stopClient(client) {
        client.close();
    }
    removeHandlers(client) {
        client.removeAllListeners();
    }
}
//# sourceMappingURL=index.js.map