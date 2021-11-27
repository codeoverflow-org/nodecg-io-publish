"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for twitch-pubsub started");
    const pubsub = (0, nodecg_io_core_1.requireService)(nodecg, "twitch-pubsub");
    pubsub === null || pubsub === void 0 ? void 0 : pubsub.onAvailable((client) => {
        nodecg.log.info("PubSub client has been updated, adding handlers for messages.");
        client.onSubscription((message) => {
            nodecg.log.info(`${message.userDisplayName} just subscribed (${message.cumulativeMonths} months)`);
        });
        client.onBits((message) => {
            nodecg.log.info(`${message.userName} cheered ${message.bits} Bits`);
        });
        client.onBitsBadgeUnlock((message) => {
            nodecg.log.info(`${message.userName} just unlocked the ${message.badgeTier} Badge`);
        });
        client.onRedemption((message) => {
            nodecg.log.info(`${message.userDisplayName} redeemed ${message.rewardTitle} (${message.message})`);
        });
    });
    pubsub === null || pubsub === void 0 ? void 0 : pubsub.onUnavailable(() => nodecg.log.info("PubSub client has been unset."));
};
//# sourceMappingURL=index.js.map