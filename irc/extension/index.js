"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for irc started.");
    const service = (0, nodecg_io_core_1.requireService)(nodecg, "irc");
    service === null || service === void 0 ? void 0 : service.onAvailable((client) => {
        nodecg.log.info("IRC client has been updated.");
        client.join("#skate702"); // Change this channel, if you want to connect to a different channel.
        client.addListener("message", (from, to, message) => {
            nodecg.log.info(from + " => " + to + ": " + message);
        });
        client.addListener("error", function (message) {
            nodecg.log.info("error: ", message);
        });
    });
    service === null || service === void 0 ? void 0 : service.onUnavailable(() => nodecg.log.info("IRC client has been unset."));
};
//# sourceMappingURL=index.js.map