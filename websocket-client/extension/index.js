"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for websocket-client started");
    const service = (0, nodecg_io_core_1.requireService)(nodecg, "websocket-client");
    let interval;
    service === null || service === void 0 ? void 0 : service.onAvailable((client) => {
        nodecg.log.info("Client has been updated, waiting for messages.");
        client.onMessage((message) => {
            nodecg.log.info(`recieved message "${message}"`);
        });
        interval = setInterval(() => {
            nodecg.log.info("Sending ping ...");
            client.send("ping");
        }, 10000);
    });
    service === null || service === void 0 ? void 0 : service.onUnavailable(() => {
        nodecg.log.info("Client has been unset.");
        if (interval) {
            clearInterval(interval);
        }
    });
};
//# sourceMappingURL=index.js.map