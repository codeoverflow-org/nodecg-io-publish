"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Twitch-addons bundle started.");
    const twitchAddons = (0, nodecg_io_core_1.requireService)(nodecg, "twitch-addons");
    twitchAddons === null || twitchAddons === void 0 ? void 0 : twitchAddons.onAvailable(async (client) => {
        nodecg.log.info("Twitch-addons service available.");
        const emotes = await client.getEmoteCollection("#derniklaas", { includeGlobal: false });
        const emoteNames = client.getEmoteNames(emotes);
        const global = await client.getEmoteCollection("#derniklaas", { includeGlobal: true });
        const globalNames = client.getEmoteNames(global);
        const stv = await client.getEmoteCollection("#derniklaas", { includeGlobal: true, include7tv: true });
        const stvNames = client.getEmoteNames(stv);
        nodecg.log.info(`BTTV & FFZ emotes on the twitch channel #derniklaas (without global emotes): ${emoteNames}`);
        nodecg.log.info(`BTTV & FFZ emotes on the twitch channel #derniklaas (with global emotes): ${globalNames}`);
        nodecg.log.info(`BTTV, FFZ, & 7TV emotes on the twitch channel #derniklaas (with global emotes): ${stvNames}`);
    });
    twitchAddons === null || twitchAddons === void 0 ? void 0 : twitchAddons.onUnavailable(() => {
        nodecg.log.info("Twitch-addons service unavailable.");
    });
};
//# sourceMappingURL=index.js.map