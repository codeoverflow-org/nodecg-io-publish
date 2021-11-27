"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
const android_1 = require("./android");
module.exports = (nodecg) => {
    new AndroidService(nodecg, "android", __dirname, "../android-schema.json").register();
};
class AndroidService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config, logger) {
        const client = new android_1.Android(logger, config.device);
        await client.connect();
        await client.disconnect();
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config, logger) {
        const client = new android_1.Android(logger, config.device);
        await client.connect();
        logger.info("Successfully connected to adb.");
        return (0, nodecg_io_core_1.success)(client);
    }
    async stopClient(client, logger) {
        try {
            await client.disconnect();
        }
        catch (err) {
            logger.error(err);
            // Do nothing. If we did not catch it it'd cause an infinite loop.
        }
    }
}
//# sourceMappingURL=index.js.map