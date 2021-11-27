"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ratbag_1 = require("nodecg-io-dbus/extension/ratbag");
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for Dbus started.");
    const dbus = (0, nodecg_io_core_1.requireService)(nodecg, "dbus");
    dbus === null || dbus === void 0 ? void 0 : dbus.onAvailable(async (client) => {
        nodecg.log.info("DBus service available.");
        const ratbag = await client.proxy(ratbag_1.RatBagManager.PROXY);
        const devices = await ratbag.devices();
        nodecg.log.info("ratbagd devices:");
        for (const device of devices) {
            nodecg.log.info(" - " + (await device.name()));
        }
    });
    dbus === null || dbus === void 0 ? void 0 : dbus.onUnavailable(() => {
        nodecg.log.info("DBus service unavailable.");
    });
};
//# sourceMappingURL=index.js.map