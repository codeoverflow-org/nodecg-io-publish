"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for xdotool started");
    const xdotool = (0, nodecg_io_core_1.requireService)(nodecg, "xdotool");
    xdotool === null || xdotool === void 0 ? void 0 : xdotool.onAvailable((client) => {
        nodecg.log.info("Xdotool client has been updated, minimising current window.");
        client.sendCommand("getactivewindow windowminimize");
    });
    xdotool === null || xdotool === void 0 ? void 0 : xdotool.onUnavailable(() => nodecg.log.info("Xdotool client has been unset."));
};
//# sourceMappingURL=index.js.map