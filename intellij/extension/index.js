"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for intellij started");
    const ij = (0, nodecg_io_core_1.requireService)(nodecg, "intellij");
    ij === null || ij === void 0 ? void 0 : ij.onAvailable((intellij) => {
        nodecg.log.info("IntelliJ client has been updated, printing all plugins.");
        intellij.pluginManager
            .getPlugins(true)
            .then((plugins) => {
            plugins.forEach((plugin) => {
                plugin
                    .getName()
                    .then((name) => {
                    nodecg.log.info(`Plugin ${name}`);
                })
                    .catch((_) => {
                    nodecg.log.info(`Plugin ${plugin.id}`);
                });
            });
        })
            .catch((err) => {
            nodecg.log.info(`Could not get plugins: ${String(err)}`);
        });
    });
    ij === null || ij === void 0 ? void 0 : ij.onUnavailable(() => nodecg.log.info("IntelliJ client has been unset."));
};
//# sourceMappingURL=index.js.map