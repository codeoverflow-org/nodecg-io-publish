"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
const web_api_1 = require("@slack/web-api");
module.exports = (nodecg) => {
    new SlackService(nodecg, "slack", __dirname, "../slack-schema.json").register();
};
class SlackService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config) {
        const client = new web_api_1.WebClient(config.token);
        const res = await client.auth.test({ token: config.token });
        if (res.ok) {
            return (0, nodecg_io_core_1.emptySuccess)();
        }
        else {
            return (0, nodecg_io_core_1.error)(res.error || "");
        }
    }
    async createClient(config, logger) {
        const client = new web_api_1.WebClient(config.token);
        logger.info("Successfully created Web Client for Slack WebAPI.");
        const res = await client.auth.test({ token: config.token });
        if (res.ok) {
            return (0, nodecg_io_core_1.success)(client);
        }
        else {
            return (0, nodecg_io_core_1.error)(res.error || "");
        }
    }
    stopClient(client) {
        // Not supported by the client, at least remove all listeners
        this.removeHandlers(client);
    }
    removeHandlers(client) {
        client.removeAllListeners();
    }
}
//# sourceMappingURL=index.js.map