"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
const discord_js_1 = require("discord.js");
module.exports = (nodecg) => {
    new DiscordService(nodecg, "discord", __dirname, "../discord-schema.json").register();
};
const defaultIntents = [
    discord_js_1.GatewayIntentBits.DirectMessages,
    discord_js_1.GatewayIntentBits.DirectMessageReactions,
    discord_js_1.GatewayIntentBits.DirectMessageTyping,
    discord_js_1.GatewayIntentBits.Guilds,
    discord_js_1.GatewayIntentBits.GuildBans,
    discord_js_1.GatewayIntentBits.GuildEmojisAndStickers,
    discord_js_1.GatewayIntentBits.GuildIntegrations,
    discord_js_1.GatewayIntentBits.GuildInvites,
    discord_js_1.GatewayIntentBits.GuildMessages,
    discord_js_1.GatewayIntentBits.GuildMessageReactions,
    discord_js_1.GatewayIntentBits.GuildMessageTyping,
    discord_js_1.GatewayIntentBits.GuildVoiceStates,
    discord_js_1.GatewayIntentBits.GuildWebhooks,
];
class DiscordService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config) {
        var _a;
        const botToken = config.botToken;
        const client = new discord_js_1.Client({ intents: (_a = config.intents) !== null && _a !== void 0 ? _a : defaultIntents });
        await client.login(botToken);
        client.destroy();
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config, logger) {
        const client = new discord_js_1.Client({ intents: defaultIntents !== null && defaultIntents !== void 0 ? defaultIntents : defaultIntents });
        await client.login(config.botToken);
        logger.info("Successfully connected to Discord.");
        return (0, nodecg_io_core_1.success)(client);
    }
    stopClient(client) {
        client.destroy();
    }
    removeHandlers(client) {
        client.removeAllListeners();
    }
}
//# sourceMappingURL=index.js.map