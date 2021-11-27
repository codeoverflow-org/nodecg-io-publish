"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = (nodecg) => {
    nodecg.log.info("Sample bundle for youtube started");
    const googleApis = (0, nodecg_io_core_1.requireService)(nodecg, "googleapis");
    googleApis === null || googleApis === void 0 ? void 0 : googleApis.onAvailable(async (client) => {
        const youtube = client.youtube("v3");
        nodecg.log.info("Youtube client has been updated, listing videos from playlist.");
        const resp = await youtube.playlists.list({
            part: ["id", "snippet"],
            id: ["PL9oBXB6tQnlX013V1v20WkfzI9R2zamHi"],
        });
        const items = resp.data.items;
        if (items && items[0]) {
            const { title, channelTitle, publishedAt, description } = items[0]
                .snippet;
            nodecg.log.info(`${title}${description ? " - " : ""}${description} by ${channelTitle} created at ${publishedAt}`);
        }
    });
    googleApis === null || googleApis === void 0 ? void 0 : googleApis.onUnavailable(() => nodecg.log.info("Youtube client has been unset."));
};
//# sourceMappingURL=index.js.map