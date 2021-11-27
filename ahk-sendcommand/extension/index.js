"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for AHK started");
    const ahk = (0, nodecg_io_core_1.requireService)(nodecg, "ahk");
    ahk === null || ahk === void 0 ? void 0 : ahk.onAvailable((client) => {
        nodecg.log.info("AHK client has been updated, sending Hello World Command.");
        client.sendCommand("HelloWorld");
    });
    ahk === null || ahk === void 0 ? void 0 : ahk.onUnavailable(() => nodecg.log.info("AHK client has been unset."));
};
//# sourceMappingURL=index.js.map