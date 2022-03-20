"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecg_io_core_1 = require("nodecg-io-core");
const streamdeck = tslib_1.__importStar(require("@elgato-stream-deck/node"));
module.exports = (nodecg) => {
    new StreamdeckServiceBundle(nodecg, "streamdeck", __dirname, "../streamdeck-schema.json").register();
};
class StreamdeckServiceBundle extends nodecg_io_core_1.ServiceBundle {
    constructor() {
        super(...arguments);
        this.presets = Object.fromEntries(this.buildPresets());
        // Can't remove handlers for up/down/error, so re-create the client to get rid of the listeners
        this.reCreateClientToRemoveHandlers = true;
    }
    buildPresets() {
        const decks = streamdeck.listStreamDecks();
        return decks.map((deck) => {
            const presetName = `${deck.model}@${deck.path}`;
            const presetConfig = { device: deck.path };
            return [presetName, presetConfig];
        });
    }
    async validateConfig(config) {
        try {
            let device = config.device;
            if (device === "default") {
                device = undefined;
            }
            streamdeck.openStreamDeck(device).close(); // Throws an error if the streamdeck is not found
            return (0, nodecg_io_core_1.emptySuccess)();
        }
        catch (err) {
            return (0, nodecg_io_core_1.error)(String(err));
        }
    }
    async createClient(config, logger) {
        try {
            let device = config.device;
            if (device === "default") {
                device = undefined;
            }
            logger.info(`Connecting to the streamdeck ${config.device}.`);
            const deck = streamdeck.openStreamDeck(device);
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