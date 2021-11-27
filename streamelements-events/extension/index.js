"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for StreamElements started");
    const streamElements = (0, nodecg_io_core_1.requireService)(nodecg, "streamelements");
    streamElements === null || streamElements === void 0 ? void 0 : streamElements.onAvailable((client) => {
        nodecg.log.info("SE client has been updated, registering handlers now.");
        client.onCheer((data) => {
            nodecg.log.info(`${data.data.displayName} just cheered ${data.data.amount} bit(s). Message: ${data.data.message}`);
        });
        client.onFollow((data) => {
            nodecg.log.info(`${data.data.displayName} just followed.`);
        });
        client.onSubscriber((data) => {
            if (data.data.tier) {
                const tier = data.data.tier === "prime" ? "Twitch Prime" : "Tier " + Number.parseInt(data.data.tier) / 1000;
                nodecg.log.info(`${data.data.displayName} just subscribed for ${data.data.amount} months (${tier}).`);
            }
        });
        client.onGift((data) => {
            if (data.data.tier) {
                const tier = (Number.parseInt(data.data.tier) / 1000).toString();
                if (data.data.sender) {
                    nodecg.log.info(`${data.data.displayName} just got a tier ${tier} subscription from ${data.data.sender}! It's ${data.data.displayName}'s ${data.data.amount} month.`);
                }
                else {
                    nodecg.log.info(`${data.data.displayName} just got a tier ${tier} subscription! It's ${data.data.displayName}'s ${data.data.amount} month.`);
                }
            }
        });
        client.onHost((data) => {
            nodecg.log.info(`${data.data.displayName} just hosted the stream for ${data.data.amount} viewer(s).`);
        });
        client.onRaid((data) => {
            nodecg.log.info(`${data.data.displayName} just raided the stream with ${data.data.amount} viewers.`);
        });
        client.onTip((data) => {
            if (data.data.currency) {
                nodecg.log.info(`${data.data.username} just donated ${data.data.amount} ${data.data.currency}. Message. ${data.data.message}`);
            }
        });
        client.onTest((data) => {
            nodecg.log.info(JSON.stringify(data));
        });
    });
    streamElements === null || streamElements === void 0 ? void 0 : streamElements.onUnavailable(() => nodecg.log.info("SE client has been unset."));
};
//# sourceMappingURL=index.js.map