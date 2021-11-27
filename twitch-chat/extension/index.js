"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for twitch-chat started");
    // Require the twitch service.
    const twitch = (0, nodecg_io_core_1.requireService)(nodecg, "twitch-chat");
    // Hardcoded channels for testing purposes.
    // Note that this does need a # before the channel name and is case-insensitive.
    const twitchChannels = ["#skate702", "#daniel0611"];
    // Once the service instance has been set we add listeners for messages in the corresponding channels.
    twitch === null || twitch === void 0 ? void 0 : twitch.onAvailable((client) => {
        nodecg.log.info("Twitch chat client has been updated, adding handlers for messages.");
        twitchChannels.forEach((channel) => {
            addListeners(nodecg, client, channel);
        });
    });
    twitch === null || twitch === void 0 ? void 0 : twitch.onUnavailable(() => nodecg.log.info("Twitch chat client has been unset."));
};
function addListeners(nodecg, client, channel) {
    client
        .join(channel)
        .then(() => {
        nodecg.log.info(`Connected to twitch channel "${channel}"`);
        client.onMessage((chan, user, message, _msg) => {
            if (chan === channel.toLowerCase()) {
                nodecg.log.info(`Twitch chat: ${user}@${channel}: ${message}`);
            }
        });
    })
        .catch((reason) => {
        nodecg.log.error(`Couldn't connect to twitch: ${reason}.`);
        nodecg.log.info("Retrying in 5 seconds.");
        setTimeout(() => addListeners(nodecg, client, channel), 5000);
    });
}
//# sourceMappingURL=index.js.map