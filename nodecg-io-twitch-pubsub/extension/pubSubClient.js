"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchPubSubServiceClient = void 0;
const pubsub_1 = require("@twurple/pubsub");
const nodecg_io_twitch_auth_1 = require("nodecg-io-twitch-auth");
class TwitchPubSubServiceClient extends pubsub_1.SingleUserPubSubClient {
    constructor(auth, basicClient) {
        super({ authProvider: auth, pubSubClient: basicClient });
        this.basicClient = basicClient;
    }
    /**
     * Creates a instance of TwitchServiceClient using the credentials from the passed config.
     */
    static async createClient(cfg) {
        // Create a twitch authentication provider
        const authProvider = await (0, nodecg_io_twitch_auth_1.createAuthProvider)(cfg);
        // Create the actual pubsub client and connect
        const basicClient = new pubsub_1.BasicPubSubClient();
        const pubSubClient = new TwitchPubSubServiceClient(authProvider, basicClient);
        await basicClient.connect();
        return pubSubClient;
    }
    disconnect() {
        return this.basicClient.disconnect();
    }
}
exports.TwitchPubSubServiceClient = TwitchPubSubServiceClient;
//# sourceMappingURL=pubSubClient.js.map