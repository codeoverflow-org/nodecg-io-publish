"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecg_io_core_1 = require("nodecg-io-core");
const streamdeck = tslib_1.__importStar(require("@elgato-stream-deck/node"));
module.exports = (nodecg) => {
    new StreamdeckServiceBundle(nodecg, "streamdeck", __dirname, "../streamdeck-schema.json").register();
};
class StreamdeckServiceBundle extends nodecg_io_core_1.ServiceBundle {
    constructor(nodecg, serviceType, serviceConfigName, schemaPath) {
        super(nodecg, serviceType, serviceConfigName, schemaPath);
        // Can't remove handlers for up/down/error, so re-create the client to get rid of the listeners
        this.reCreateClientToRemoveHandlers = true;
        this.buildPresets()
            .then((presets) => (this.presets = Object.fromEntries(presets)))
            .catch((err) => nodecg.log.error("Failed to build presets for the streamdeck service:", err));
    }
    async buildPresets() {
        const decks = await streamdeck.listStreamDecks();
        return decks.map((deck) => {
            const presetName = `${deck.model}@${deck.path}`;
            const presetConfig = { device: deck.path };
            return [presetName, presetConfig];
        });
    }
    async getDeviceOrDefault(config) {
        var _a;
        let device = config.device;
        if (device === "default") {
            const decks = await streamdeck.listStreamDecks();
            if (!decks[0]) {
                return (0, nodecg_io_core_1.error)("No connected streamdeck found");
            }
            device = (_a = decks[0]) === null || _a === void 0 ? void 0 : _a.path;
        }
        return (0, nodecg_io_core_1.success)(device);
    }
    async validateConfig(config) {
        try {
            const device = await this.getDeviceOrDefault(config);
            if (device.failed) {
                return device;
            }
            const deck = await streamdeck.openStreamDeck(device.result); // Throws an error if the streamdeck is not found
            deck.close();
            return (0, nodecg_io_core_1.emptySuccess)();
        }
        catch (err) {
            return (0, nodecg_io_core_1.error)(String(err));
        }
    }
    async createClient(config, logger) {
        try {
            const device = await this.getDeviceOrDefault(config);
            if (device.failed) {
                return device;
            }
            logger.info(`Connecting to the streamdeck ${config.device}.`);
            const deck = await streamdeck.openStreamDeck(device.result);
            logger.info(`Successfully connected to the streamdeck ${config.device}.`);
            return (0, nodecg_io_core_1.success)(deck);
        }
        catch (err) {
            return (0, nodecg_io_core_1.error)(String(err));
        }
    }
    stopClient(client) {
        client.close();
    }
}
//# sourceMappingURL=index.js.map