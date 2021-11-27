"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
const xdotool_1 = require("./xdotool");
module.exports = (nodecg) => {
    new XdotoolServiceBundle(nodecg, "xdotool", __dirname, "../xdotool-schema.json").register();
};
class XdotoolServiceBundle extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config, logger) {
        try {
            const xd = new xdotool_1.Xdotool(logger, config.host, config.port);
            await xd.testConnection();
            return (0, nodecg_io_core_1.emptySuccess)();
        }
        catch (err) {
            return (0, nodecg_io_core_1.error)(String(err));
        }
    }
    async createClient(config, logger) {
        try {
            const xd = new xdotool_1.Xdotool(logger, config.host, config.port);
            return (0, nodecg_io_core_1.success)(xd);
        }
        catch (err) {
            return (0, nodecg_io_core_1.error)(String(err));
        }
    }
    stopClient(_) {
        // Nothing to do
    }
}
//# sourceMappingURL=index.js.map