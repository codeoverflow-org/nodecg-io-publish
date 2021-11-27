"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for serial started");
    const service = (0, nodecg_io_core_1.requireService)(nodecg, "serial");
    let interval;
    service === null || service === void 0 ? void 0 : service.onAvailable((client) => {
        nodecg.log.info("Serial client has been updated, logging incoming data.");
        client.onData((data) => {
            nodecg.log.info(data);
        });
        interval = setInterval(() => {
            client.send("ping\n");
        }, 10000);
    });
    service === null || service === void 0 ? void 0 : service.onUnavailable(() => {
        nodecg.log.info("Serial client has been unset.");
        if (interval) {
            clearInterval(interval);
        }
    });
};
//# sourceMappingURL=index.js.map