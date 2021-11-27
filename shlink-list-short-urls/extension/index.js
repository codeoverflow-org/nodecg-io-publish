"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for Shlink started");
    const service = (0, nodecg_io_core_1.requireService)(nodecg, "shlink");
    service === null || service === void 0 ? void 0 : service.onAvailable((client) => {
        nodecg.log.info("Shlink client has been updated.");
        client.getShortUrls().then((response) => {
            nodecg.log.info(`Received ${response.pagination.totalItems} short urls from Shlink server (on first page).`);
        });
    });
    service === null || service === void 0 ? void 0 : service.onUnavailable(() => nodecg.log.info("Shlink client has been unset."));
};
//# sourceMappingURL=index.js.map