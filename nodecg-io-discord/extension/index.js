"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
const discord_js_1 = require("discord.js");
module.exports = (nodecg) => {
    new DiscordService(nodecg, "discord", __dirname, "../discord-schema.json").register();
};
// All except GUILD_MEMBERS and GUILD_PRESENCES.
const defaultIntents = [
    "DIRECT_MESSAGES",
    "DIRECT_MESSAGE_REACTIONS",
    "DIRECT_MESSAGE_TYPING",
    "GUILDS",
    "GUILD_BANS",
    "GUILD_EMOJIS_AND_STICKERS",
    "GUILD_INTEGRATIONS",
    "GUILD_INVITES",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_MESSAGE_TYPING",
    "GUILD_VOICE_STATES",
    "GUILD_WEBHOOKS",
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