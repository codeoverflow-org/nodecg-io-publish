"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for sACN started");
    const rcon = (0, nodecg_io_core_1.requireService)(nodecg, "rcon");
    rcon === null || rcon === void 0 ? void 0 : rcon.onAvailable(async (client) => {
        nodecg.log.info("RCON sample has been updated, performing /list and a /say command.");
        const response = await client.send("list");
        nodecg.log.info(response);
        client.send("say nodecg-io speaking here!");
    });
    rcon === null || rcon === void 0 ? void 0 : rcon.onUnavailable(() => nodecg.log.info("RCON sample has been unset."));
};
//# sourceMappingURL=index.js.map