"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for twitch-api started");
    const twitchApi = (0, nodecg_io_core_1.requireService)(nodecg, "twitch-api");
    twitchApi === null || twitchApi === void 0 ? void 0 : twitchApi.onAvailable(async (client) => {
        nodecg.log.info("Twitch api client has been updated, getting user info.");
        const user = await client.helix.users.getMe();
        const follows = await user.getFollows();
        const stream = await user.getStream();
        nodecg.log.info(`You are user "${user.name}", follow ${follows.total} people and are${stream === null ? " not" : ""} streaming.`);
    });
    twitchApi === null || twitchApi === void 0 ? void 0 : twitchApi.onUnavailable(() => nodecg.log.info("Twitch api client has been unset."));
};
//# sourceMappingURL=index.js.map