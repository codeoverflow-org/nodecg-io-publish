"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecg_io_core_1 = require("nodecg-io-core");
const reddit_ts_1 = tslib_1.__importDefault(require("reddit-ts"));
module.exports = (nodecg) => {
    new RedditService(nodecg, "reddit", __dirname, "../reddit-schema.json").register();
};
class RedditService extends nodecg_io_core_1.ServiceBundle {
    buildCredentials(config) {
        return {
            user_agent: "nodecg-io",
            o2a: {
                client_id: config.clientId,
                client_secret: config.clientSecret,
                username: config.username,
                password: config.password,
            },
        };
    }
    async validateConfig(config) {
        const client = new reddit_ts_1.default(this.buildCredentials(config));
        await client.me();
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config, logger) {
        const client = new reddit_ts_1.default(this.buildCredentials(config));
        await client.me();
        logger.info("Successfully connected to reddit.");
        return (0, nodecg_io_core_1.success)(client);
    }
    stopClient(_client) {
        // Nothing to do.
    }
}
//# sourceMappingURL=index.js.map