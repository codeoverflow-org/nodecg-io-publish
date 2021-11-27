"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for GitHub started.");
    const github = (0, nodecg_io_core_1.requireService)(nodecg, "github");
    github === null || github === void 0 ? void 0 : github.onAvailable(async (github) => {
        nodecg.log.info("GitHub service available.");
        nodecg.log.info("GitHub repositories: " +
            (await github.repos.listForAuthenticatedUser({
                page: 0,
                per_page: 100,
                type: "all",
            })).data.map((repo) => repo.name));
    });
    github === null || github === void 0 ? void 0 : github.onUnavailable(() => {
        nodecg.log.info("GitHub service unavailable.");
    });
};
//# sourceMappingURL=index.js.map