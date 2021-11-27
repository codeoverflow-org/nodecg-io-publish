"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for discord started");
    const subreddit = "skate702";
    const reddit = (0, nodecg_io_core_1.requireService)(nodecg, "reddit");
    reddit === null || reddit === void 0 ? void 0 : reddit.onAvailable(async (client) => {
        nodecg.log.info("Reddit client has been updated, checking for recent post.");
        const posts = await client.threads(subreddit);
        posts.forEach((post) => {
            nodecg.log.info(`Recent Post: ${post.title} by ${post.author}. Created: ${post.date}. See ${post.url}`);
        });
    });
    reddit === null || reddit === void 0 ? void 0 : reddit.onUnavailable(() => nodecg.log.info("Reddit client has been unset."));
};
//# sourceMappingURL=index.js.map