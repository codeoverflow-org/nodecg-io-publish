"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchPubSubServiceClient = void 0;
const nodecg_io_core_1 = require("nodecg-io-core");
const nodecg_io_twitch_auth_1 = require("nodecg-io-twitch-auth");
const pubSubClient_1 = require("./pubSubClient");
var pubSubClient_2 = require("./pubSubClient");
Object.defineProperty(exports, "TwitchPubSubServiceClient", { enumerable: true, get: function () { return pubSubClient_2.TwitchPubSubServiceClient; } });
module.exports = (nodecg) => {
    new TwitchPubSubService(nodecg, "twitch-pubsub", __dirname, "../pubsub-schema.json").register();
};
class TwitchPubSubService extends nodecg_io_core_1.ServiceBundle {
    constructor() {
        super(...arguments);
        // Pubsub has no methods to remove the handlers.
        // At least we can disconnect the client so we must do that on any configuration change and reconnect.
        this.recreateClientToRemoveHandlers = true;
    }
    async validateConfig(config) {
        await (0, nodecg_io_twitch_auth_1.getTokenInfo)(config); // This will throw a error if the token is invalid
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config) {
        const client = await pubSubClient_1.TwitchPubSubServiceClient.createClient(config);
        return (0, nodecg_io_core_1.success)(client);
    }
    stopClient(client, logger) {
        client
            .disconnect()
            .then(() => logger.info("Stopped pubsub client successfully."))
            .catch((err) => logger.error(`Couldn't stop pubsub client: ${err}`));
    }
}
//# sourceMappingURL=index.js.map