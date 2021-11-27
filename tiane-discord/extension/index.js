"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
/*
 * Adds a discord bot that is powered by TIANE. Ping it if you wan't to talk to her.
 */
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for discord started");
    let myDiscord = null;
    let myChannel = null;
    let myTiane = null;
    const userMap = {};
    const discord = (0, nodecg_io_core_1.requireService)(nodecg, "discord");
    const discordChannel = ""; // Insert channel for the discord bot here
    const tianeRoom = "discord";
    discord === null || discord === void 0 ? void 0 : discord.onAvailable(async (client) => {
        nodecg.log.info("Discord client has been updated, adding handlers for messages.");
        myChannel = (await client.channels.fetch(discordChannel));
        client.on("message", (msg) => {
            var _a;
            if (myTiane !== null && myChannel !== null && myDiscord !== null) {
                if (msg.channel.id === myChannel.id && msg.author.id !== ((_a = myDiscord.user) === null || _a === void 0 ? void 0 : _a.id)) {
                    const text = msg.content;
                    const user = msg.author.username;
                    userMap[user] = `<@!${msg.author.id}>`;
                    const explicit = msg.mentions.has(myDiscord.user);
                    myTiane.send(text, user, tianeRoom, "USER", explicit);
                }
            }
        });
        myDiscord = client;
    });
    discord === null || discord === void 0 ? void 0 : discord.onUnavailable(() => {
        nodecg.log.info("Discord client has been unset.");
        myDiscord = null;
        myChannel = null;
    });
    const tiane = (0, nodecg_io_core_1.requireService)(nodecg, "tiane");
    tiane === null || tiane === void 0 ? void 0 : tiane.onAvailable((client) => {
        nodecg.log.info("Tiane client has been updated, adding handlers for messages.");
        client.onsay(tianeRoom, (text, user) => {
            if (myChannel !== null && myDiscord !== null) {
                if (user === null || !(user in userMap)) {
                    myChannel.send({
                        content: text,
                    });
                }
                else {
                    myChannel.send({
                        content: `${userMap[user]} ${text}`,
                    });
                }
            }
        });
        client.newRoom(tianeRoom, false);
        client.roomOutput(tianeRoom, "discord");
        myTiane = client;
    });
    tiane === null || tiane === void 0 ? void 0 : tiane.onUnavailable(() => {
        nodecg.log.info("Tiane client has been unset.");
        myTiane = null;
    });
};
//# sourceMappingURL=index.js.map