"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for mqtt-client started");
    const service = (0, nodecg_io_core_1.requireService)(nodecg, "mqtt-client");
    service === null || service === void 0 ? void 0 : service.onAvailable((client) => {
        nodecg.log.info("Client has been updated, waiting for messages.");
        client.onMessage((topic, message) => {
            nodecg.log.info(`recieved message "${message.toString()}" "${topic}"`);
        });
    });
    service === null || service === void 0 ? void 0 : service.onUnavailable(() => {
        nodecg.log.info("Client has been unset.");
    });
};
//# sourceMappingURL=index.js.map