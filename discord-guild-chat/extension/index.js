"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for Discord started");
    const discord = (0, nodecg_io_core_1.requireService)(nodecg, "discord");
    discord === null || discord === void 0 ? void 0 : discord.onAvailable((client) => {
        nodecg.log.info("Discord client has been updated, adding handlers for messages.");
        addListeners(client);
    });
    discord === null || discord === void 0 ? void 0 : discord.onUnavailable(() => nodecg.log.info("Discord client has been unset."));
};
function addListeners(client) {
    client.on("message", (msg) => {
        if (msg.content === "ping" || msg.content === "!ping") {
            msg.reply("pong");
        }
    });
}
//# sourceMappingURL=index.js.map