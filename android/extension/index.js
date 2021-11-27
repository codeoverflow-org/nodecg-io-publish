"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for android started");
    const a = (0, nodecg_io_core_1.requireService)(nodecg, "android");
    a === null || a === void 0 ? void 0 : a.onAvailable(async (android) => {
        nodecg.log.info("Android client has been updated, turning on WLAN.");
        const wifi = await android.getWifiManager();
        await wifi.setEnabled(true);
    });
    a === null || a === void 0 ? void 0 : a.onUnavailable(() => nodecg.log.info("Android client has been unset."));
};
//# sourceMappingURL=index.js.map