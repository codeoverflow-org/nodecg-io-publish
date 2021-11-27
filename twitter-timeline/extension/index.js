"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for twitter started");
    const twitter = (0, nodecg_io_core_1.requireService)(nodecg, "twitter");
    twitter === null || twitter === void 0 ? void 0 : twitter.onAvailable((twitterClient) => {
        nodecg.log.info("Twitch client has been updated, adding handlers for messages.");
        const params = {
            screen_name: "skate702",
            exclude_replies: true,
            count: 50,
        };
        twitterClient
            .get("statuses/user_timeline", params)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .then((tweets) => tweets.forEach((tweet) => nodecg.log.info(`Got tweet: ${tweet.text}`)))
            .catch((err) => nodecg.log.error(err));
    });
    twitter === null || twitter === void 0 ? void 0 : twitter.onUnavailable(() => nodecg.log.info("Twitter client has been unset."));
};
//# sourceMappingURL=index.js.map