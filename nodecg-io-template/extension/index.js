"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateClient = void 0;
const nodecg_io_core_1 = require("nodecg-io-core");
const templateClient_1 = require("./templateClient");
var templateClient_2 = require("./templateClient");
Object.defineProperty(exports, "TemplateClient", { enumerable: true, get: function () { return templateClient_2.TemplateClient; } });
module.exports = (nodecg) => {
    new TemplateService(nodecg, "template", __dirname, "../schema.json").register();
};
class TemplateService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(_) {
        // TODO: Implement
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config, logger) {
        // TODO: Implement
        const client = templateClient_1.TemplateClient.createClient(config, logger);
        logger.info("Successfully created template client.");
        return (0, nodecg_io_core_1.success)(client);
    }
    stopClient(_, logger) {
        // TODO: Implement
        logger.info("Successfully stopped template client.");
    }
    removeHandlers(_) {
        // TODO: Implement (optional)
    }
}
//# sourceMappingURL=index.js.map