"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
const Twitter = require("twitter");
module.exports = (nodecg) => {
    new TwitterService(nodecg, "twitter", __dirname, "../twitter-schema.json").register();
};
class TwitterService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config) {
        // Connect to twitter
        const client = new Twitter({
            consumer_key: config.oauthConsumerKey, // eslint-disable-line camelcase
            consumer_secret: config.oauthConsumerSecret, // eslint-disable-line camelcase
            access_token_key: config.oauthToken, // eslint-disable-line camelcase
            access_token_secret: config.oauthTokenSecret, // eslint-disable-line camelcase
        });
        // Validate credentials
        await client.get("account/verify_credentials", {});
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config, logger) {
        logger.info("Connecting to twitter...");
        const client = new Twitter({
            consumer_key: config.oauthConsumerKey, // eslint-disable-line camelcase
            consumer_secret: config.oauthConsumerSecret, // eslint-disable-line camelcase
            access_token_key: config.oauthToken, // eslint-disable-line camelcase
            access_token_secret: config.oauthTokenSecret, // eslint-disable-line camelcase
        });
        logger.info("Successfully connected to twitter.");
        return (0, nodecg_io_core_1.success)(client);
    }
    stopClient(_client) {
        // You are not really able to stop the client ...
    }
}
//# sourceMappingURL=index.js.map