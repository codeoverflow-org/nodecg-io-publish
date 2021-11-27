"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for Art-Net started");
    const service = (0, nodecg_io_core_1.requireService)(nodecg, "artnet");
    let value = 0;
    let timeout = undefined;
    service === null || service === void 0 ? void 0 : service.onAvailable((client) => {
        // From this point on is the artnet client available
        nodecg.log.info("Art-Net console has been updated, setting up interval for sending test payloads.");
        // Receive DMX data
        client.onDMX((dmx) => {
            // dmx contains an ArtDmx object
            nodecg.log.info(dmx.universe, dmx.data);
        });
        // Send DMX data to every channel and universe.
        timeout = setInterval(() => {
            // send new data every 0,8 seconds.
            // This is the official timing for re-transmiting data in the artnet specifciation.
            if (++value > 255)
                value = 0;
            for (let universe = 0; universe < 8; universe++) {
                client.send(universe, 
                // the values of the 512 channels
                Array(512).fill(value));
            }
        }, 800);
    });
    service === null || service === void 0 ? void 0 : service.onUnavailable(() => {
        if (timeout) {
            clearInterval(timeout);
            value = 0;
        }
        nodecg.log.info("Art-Net console has been unset.");
    });
};
//# sourceMappingURL=index.js.map