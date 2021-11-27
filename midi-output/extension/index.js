"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for midi-output started");
    const service = (0, nodecg_io_core_1.requireService)(nodecg, "midi-output");
    service === null || service === void 0 ? void 0 : service.onAvailable((client) => {
        nodecg.log.info("Midi-output client has been updated, sending data.");
        setInterval(() => {
            const noteVal = Math.round(Math.random() * 127);
            const velocityVal = Math.round(Math.random() * 127);
            const channelVal = Math.round(Math.random() * 1);
            const data = {
                note: noteVal,
                velocity: velocityVal,
                channel: channelVal,
            };
            client.send("noteon", data);
        }, 1000);
    });
    service === null || service === void 0 ? void 0 : service.onUnavailable(() => nodecg.log.info("Midi-output client has been unset."));
};
//# sourceMappingURL=index.js.map