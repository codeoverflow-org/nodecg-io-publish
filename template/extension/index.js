"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for the template service started.");
    const template = (0, nodecg_io_core_1.requireService)(nodecg, "template");
    template === null || template === void 0 ? void 0 : template.onAvailable((_) => {
        nodecg.log.info("Template service available.");
        // TODO: Implement
    });
    template === null || template === void 0 ? void 0 : template.onUnavailable(() => {
        nodecg.log.info("Template service unavailable.");
        // TODO: Implement
    });
};
//# sourceMappingURL=index.js.map