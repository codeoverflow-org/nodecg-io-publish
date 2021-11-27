"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
const rest_1 = require("@octokit/rest");
module.exports = (nodecg) => {
    new GitHubService(nodecg, "github", __dirname, "../schema.json").register();
};
class GitHubService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config) {
        const octokit = new rest_1.Octokit({
            auth: config.token,
        });
        await octokit.repos.listForAuthenticatedUser({
            page: 0,
            per_page: 1,
        });
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config, logger) {
        const client = new rest_1.Octokit({
            auth: config.token,
        });
        logger.info("Successfully created github client.");
        return (0, nodecg_io_core_1.success)(client);
    }
    stopClient(_) {
        // Does not need to be stopped as it has no state or permanent connection.
    }
}
//# sourceMappingURL=index.js.map