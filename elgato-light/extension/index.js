"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for the Elgato light service started.");
    const elgatoLightClient = (0, nodecg_io_core_1.requireService)(nodecg, "elgato-light");
    elgatoLightClient === null || elgatoLightClient === void 0 ? void 0 : elgatoLightClient.onAvailable(async (client) => {
        nodecg.log.info("Elgato light service available.");
        // Blinky Blinky
        const interval = setInterval(() => client.getAllLights().forEach((light) => light.toggleLight()), 500);
        setTimeout(() => clearInterval(interval), 3100);
        // Get some data
        client.getAllLights().forEach(async (light) => {
            const brightness = await light.getBrightness();
            nodecg.log.info(`Elgato light (${light.ipAddress}), brightness: ${brightness}`);
        });
    });
    elgatoLightClient === null || elgatoLightClient === void 0 ? void 0 : elgatoLightClient.onUnavailable(() => {
        nodecg.log.info("Elgato light service unavailable.");
    });
};
//# sourceMappingURL=index.js.map