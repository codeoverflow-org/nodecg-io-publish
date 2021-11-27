"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchChatServiceClient = void 0;
const nodecg_io_core_1 = require("nodecg-io-core");
const twitchClient_1 = require("./twitchClient");
const nodecg_io_twitch_auth_1 = require("nodecg-io-twitch-auth");
var twitchClient_2 = require("./twitchClient");
Object.defineProperty(exports, "TwitchChatServiceClient", { enumerable: true, get: function () { return twitchClient_2.TwitchChatServiceClient; } });
module.exports = (nodecg) => {
    new TwitchService(nodecg, "twitch-chat", __dirname, "../twitch-schema.json").register();
};
class TwitchService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config) {
        await (0, nodecg_io_twitch_auth_1.getTokenInfo)(config); // This will throw a error if the token is invalid
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config, logger) {
        logger.info("Connecting to twitch chat...");
        const client = await twitchClient_1.TwitchChatServiceClient.createClient(config);
        logger.info("Successfully connected to twitch.");
        return (0, nodecg_io_core_1.success)(client);
    }
    stopClient(client, logger) {
        client.quit().then(() => logger.info("Successfully stopped twitch client."));
    }
    removeHandlers(client) {
        client.removeListener();
    }
}
//# sourceMappingURL=index.js.map