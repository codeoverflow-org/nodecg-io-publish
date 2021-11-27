"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for sACN started");
    const sacn = (0, nodecg_io_core_1.requireService)(nodecg, "sacn-receiver");
    sacn === null || sacn === void 0 ? void 0 : sacn.onAvailable((client) => {
        nodecg.log.info("sACN receiver has been updated, adding handlers for data.");
        addListeners(nodecg, client);
    });
    sacn === null || sacn === void 0 ? void 0 : sacn.onUnavailable(() => nodecg.log.info("sACN receiver has been unset."));
};
function addListeners(nodecg, client) {
    nodecg.log.info("Listening to these universes: " + client.universes);
    client.onPacket((packet) => {
        nodecg.log.info("Received sACN data: " + packet);
    });
}
//# sourceMappingURL=index.js.map