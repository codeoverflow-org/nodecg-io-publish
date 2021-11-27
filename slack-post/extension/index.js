"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for Slack WebAPI started");
    const slack = (0, nodecg_io_core_1.requireService)(nodecg, "slack");
    slack === null || slack === void 0 ? void 0 : slack.onAvailable(async (client) => {
        nodecg.log.info("Slack WebAPI client has been updated, sending message to channel.");
        // Get all channels
        const channelListResponse = await client.conversations.list();
        nodecg.log.info(JSON.stringify(channelListResponse.channels));
        // Example for sending a message
        const channel = "CHANNEL_ID";
        client.chat
            .postMessage({ channel, text: "Hello world from nodecg.io" })
            .then((messageResponse) => {
            nodecg.log.info(messageResponse);
        })
            .catch((err) => {
            nodecg.log.error(err);
        });
    });
    slack === null || slack === void 0 ? void 0 : slack.onUnavailable(() => nodecg.log.info("Sample bundle for Slack WebAPI unset."));
};
//# sourceMappingURL=index.js.map