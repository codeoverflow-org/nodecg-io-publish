"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
const api_1 = require("@twurple/api");
const nodecg_io_twitch_auth_1 = require("nodecg-io-twitch-auth");
module.exports = (nodecg) => {
    new TwitchService(nodecg, "twitch-api", __dirname, "../twitch-api-schema.json").register();
};
class TwitchService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config) {
        await (0, nodecg_io_twitch_auth_1.getTokenInfo)(config); // This will throw a error if the token is invalid
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config, logger) {
        const authProvider = await (0, nodecg_io_twitch_auth_1.createAuthProvider)(config);
        const client = new api_1.ApiClient({ authProvider });
        logger.info("Successfully created twitch-api client.");
        return (0, nodecg_io_core_1.success)(client);
    }
    stopClient(_client) {
        // can't be stopped, has no persistent connection
    }
}
//# sourceMappingURL=index.js.map