"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
// Disable automatic promise cancellation
// Check https://github.com/yagop/node-telegram-bot-api/issues/319 for more information about this
process.env.NTBA_FIX_319 = "1";
const TelegramBot = require("node-telegram-bot-api");
module.exports = (nodecg) => {
    new TelegramService(nodecg, "telegram", __dirname, "../telegram-schema.json").register();
};
class TelegramService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config) {
        const bot = new TelegramBot(config.token);
        await bot.getMe();
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config, logger) {
        const options = {
            baseApiUrl: config.baseApiUrl,
            filepath: config.filepath,
            onlyFirstMatch: config.onlyFirstMatch,
            polling: config.polling,
            webHook: config.webHook,
        };
        const bot = new TelegramBot(config.token, options);
        logger.info("Successfully connected to the telegram server.");
        return (0, nodecg_io_core_1.success)(bot);
    }
    stopClient(client) {
        if (client.isPolling()) {
            client.stopPolling();
        }
        if (client.hasOpenWebHook()) {
            client.closeWebHook();
        }
    }
    removeHandlers(client) {
        client.removeAllListeners();
        client.clearTextListeners();
        client.clearReplyListeners();
    }
}
//# sourceMappingURL=index.js.map