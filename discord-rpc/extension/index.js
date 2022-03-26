"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for DiscordRpc started.");
    const discordRpc = (0, nodecg_io_core_1.requireService)(nodecg, "discord-rpc");
    discordRpc === null || discordRpc === void 0 ? void 0 : discordRpc.onAvailable((client) => {
        var _a;
        nodecg.log.info("DiscordRpc service available. Username: " + ((_a = client.user) === null || _a === void 0 ? void 0 : _a.username));
    });
    discordRpc === null || discordRpc === void 0 ? void 0 : discordRpc.onUnavailable(() => {
        nodecg.log.info("DiscordRpc service unavailable.");
    });
};
//# sourceMappingURL=index.js.map