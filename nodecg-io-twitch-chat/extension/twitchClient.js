"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchChatServiceClient = void 0;
const chat_1 = require("@twurple/chat");
const nodecg_io_twitch_auth_1 = require("nodecg-io-twitch-auth");
class TwitchChatServiceClient extends chat_1.ChatClient {
    /**
     * Creates a instance of TwitchServiceClient using the credentials from the passed config.
     */
    static async createClient(cfg) {
        // Create a twitch authentication provider
        const authProvider = await (0, nodecg_io_twitch_auth_1.createAuthProvider)(cfg);
        // Create the actual chat client and connect
        const chatClient = new TwitchChatServiceClient({ authProvider });
        await chatClient.connect();
        // This also waits till it has registered itself at the IRC server, which is needed to do anything.
        await new Promise((resolve, _reject) => {
            chatClient.onRegister(() => resolve(undefined));
        });
        return chatClient;
    }
    // In the nodecg-io environment we can't add a list of channels to the client at the time of creation because
    // we don't know which bundles will use it and which channels they want to join.
    // Therefore we must handle reconnecting ourselfs and we do that by overriding the join method
    // so that the user doesn't need to do it.
    /**
     * Joins a twitch chat channel and automatically rejoins after a reconnect.
     * @param channel the channel to join
     */
    join(channel) {
        this.onRegister(() => {
            this.join(channel);
        });
        return super.join(channel);
    }
}
exports.TwitchChatServiceClient = TwitchChatServiceClient;
//# sourceMappingURL=twitchClient.js.map