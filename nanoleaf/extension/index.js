"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for nanoleafs started.");
    // Require the nanoleaf service
    const nanoleafClient = (0, nodecg_io_core_1.requireService)(nodecg, "nanoleaf");
    nanoleafClient === null || nanoleafClient === void 0 ? void 0 : nanoleafClient.onAvailable(async (client) => {
        nodecg.log.info("Nanoleaf client has been updated.");
        // Sets the color of all nanoleaf panels to the very best orange
        await client.setSaturation(100);
        await client.setBrightness(25);
        await client.setHue(40);
    });
    nanoleafClient === null || nanoleafClient === void 0 ? void 0 : nanoleafClient.onUnavailable(() => nodecg.log.info("Nanoleaf client has been unset."));
};
//# sourceMappingURL=index.js.map