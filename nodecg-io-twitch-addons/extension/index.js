"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchAddonsClient = void 0;
const nodecg_io_core_1 = require("nodecg-io-core");
const nodecg_io_twitch_auth_1 = require("nodecg-io-twitch-auth");
const twitchAddonsClient_1 = require("./twitchAddonsClient");
var twitchAddonsClient_2 = require("./twitchAddonsClient");
Object.defineProperty(exports, "TwitchAddonsClient", { enumerable: true, get: function () { return twitchAddonsClient_2.TwitchAddonsClient; } });
module.exports = (nodecg) => {
    new TwitchAddonsService(nodecg, "twitch-addons", __dirname, "../schema.json").register();
};
class TwitchAddonsService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config) {
        await (0, nodecg_io_twitch_auth_1.getTokenInfo)(config); // throws an error if the token is invalid.
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config, logger) {
        const client = await twitchAddonsClient_1.TwitchAddonsClient.createClient(config);
        logger.info("Successfully created twitch-addons client.");
        return (0, nodecg_io_core_1.success)(client);
    }
    stopClient(_, logger) {
        logger.info("Successfully stopped twitch-addons client.");
    }
}
//# sourceMappingURL=index.js.map