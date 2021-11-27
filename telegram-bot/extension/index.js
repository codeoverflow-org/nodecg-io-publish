"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for telegram started");
    const telegram = (0, nodecg_io_core_1.requireService)(nodecg, "telegram");
    telegram === null || telegram === void 0 ? void 0 : telegram.onAvailable((client) => {
        nodecg.log.info("Telegram client has been updated, adding handlers for messages.");
        const testCommand = {
            command: "test",
            description: "This is a simple test command.",
        };
        client.setMyCommands([testCommand]);
        client.onText(/\/test/, (message) => {
            const chatID = message.chat.id;
            client.sendMessage(chatID, `Your ChatID is ${chatID}.`);
            client.sendVenue(chatID, 50.9438305556, 6.97453611111, "Koelnmesse", "Messeplatz 1 Mülheim, 50679 Köln");
        });
    });
    telegram === null || telegram === void 0 ? void 0 : telegram.onUnavailable(() => nodecg.log.info("Telegram client has been unset."));
};
//# sourceMappingURL=index.js.map