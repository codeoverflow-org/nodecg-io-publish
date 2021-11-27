"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for Philips Hue started");
    const hue = (0, nodecg_io_core_1.requireService)(nodecg, "philipshue");
    hue === null || hue === void 0 ? void 0 : hue.onAvailable((hue) => {
        nodecg.log.info("Philips Hue client has been updated, counting lights.");
        hue.lights.getAll().then((lights) => {
            nodecg.log.info(lights.length);
        });
    });
    hue === null || hue === void 0 ? void 0 : hue.onUnavailable(() => nodecg.log.info("Philips Hue client has been unset."));
};
//# sourceMappingURL=index.js.map