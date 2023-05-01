import NodeCG from "@nodecg/types";
import { DiscordServiceClient } from "nodecg-io-discord";
import { requireService } from "nodecg-io-core";

module.exports = function (nodecg: NodeCG.ServerAPI) {
    nodecg.log.info("Sample bundle for Discord started");

    const discord = requireService<DiscordServiceClient>(nodecg, "discord");

    discord?.onAvailable((client) => {
        nodecg.log.info("Discord client has been updated, adding handlers for messages.");
        addListeners(client);
    });

    discord?.onUnavailable(() => nodecg.log.info("Discord client has been unset."));
};

function addListeners(client: DiscordServiceClient) {
    client.on("message", (msg) => {
        if (msg.content === "ping" || msg.content === "!ping") {
            msg.reply("pong");
        }
    });
}
