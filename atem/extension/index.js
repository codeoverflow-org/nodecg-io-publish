"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for Atem Protocol started.");
    const service = (0, nodecg_io_core_1.requireService)(nodecg, "atem");
    service === null || service === void 0 ? void 0 : service.onAvailable((client) => {
        client.on("connected", () => nodecg.log.info("Atem connected to server."));
        client.on("receivedCommands", (e) => nodecg.log.info(e));
        client.on("error", (e) => nodecg.log.error(e));
    });
    service === null || service === void 0 ? void 0 : service.onUnavailable(() => {
        nodecg.log.info("Connect to Atem server closed.");
    });
};
//# sourceMappingURL=index.js.map