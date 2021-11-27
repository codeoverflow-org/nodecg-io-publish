"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for sacn-sender started");
    const service = (0, nodecg_io_core_1.requireService)(nodecg, "sacn-sender");
    service === null || service === void 0 ? void 0 : service.onAvailable((client) => {
        nodecg.log.info("sACN sender has been updated, setting up interval for sending payloads.");
        setInterval(() => {
            const channel = Math.round(Math.random() * 512).toString();
            const value = Math.round(Math.random() * 100);
            const payload = {
                [channel]: value,
            };
            nodecg.log.info("Sending " + value + " to channel #" + channel);
            client.sendPayload(payload);
        }, 10000);
    });
    service === null || service === void 0 ? void 0 : service.onUnavailable(() => nodecg.log.info("sACN sender has been unset."));
};
//# sourceMappingURL=index.js.map