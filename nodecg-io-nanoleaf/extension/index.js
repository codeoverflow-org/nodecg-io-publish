"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
const nanoleafClient_1 = require("./nanoleafClient");
const nanoleafUtils_1 = require("./nanoleafUtils");
// Reexportation of important classes and types is done in ../index.ts because we need to
// export NanoleafUtils which is a class and this file already has a default export for nodecg.
module.exports = (nodecg) => {
    new NanoleafService(nodecg, "nanoleaf", __dirname, "../nanoleaf-schema.json").register();
};
class NanoleafService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config, logger) {
        // checks for valid IP Adress or valid IP Adress + Auth Key separately
        if (!config.authKey) {
            if (await nanoleafUtils_1.NanoleafUtils.verifyIpAddress(config.ipAddress)) {
                logger.info("Successfully verified ip address. Now trying to retrieve an auth key for you...");
                // Automatically retrieves and saves the auth key for user's convenience
                const authKey = await nanoleafUtils_1.NanoleafUtils.retrieveAuthKey(config.ipAddress, this.nodecg);
                if (authKey !== "") {
                    config.authKey = authKey;
                    return (0, nodecg_io_core_1.emptySuccess)();
                }
                else {
                    return (0, nodecg_io_core_1.error)("Unable to retrieve auth key!");
                }
            }
            else {
                return (0, nodecg_io_core_1.error)("Unable to call the specified ip address!");
            }
        }
        else {
            if (await nanoleafUtils_1.NanoleafUtils.verifyAuthKey(config.ipAddress, config.authKey)) {
                logger.info("Successfully verified auth key.");
                return (0, nodecg_io_core_1.emptySuccess)();
            }
            else {
                return (0, nodecg_io_core_1.error)("Unable to verify auth key! Invalid key?");
            }
        }
    }
    async createClient(config, logger) {
        logger.info("Connecting to nanoleaf controller...");
        if (await nanoleafUtils_1.NanoleafUtils.verifyAuthKey(config.ipAddress, config.authKey || "")) {
            const client = new nanoleafClient_1.NanoleafClient(config.ipAddress, config.authKey || "");
            logger.info("Connected to Nanoleafs successfully.");
            return (0, nodecg_io_core_1.success)(client);
        }
        else {
            return (0, nodecg_io_core_1.error)("Unable to connect to Nanoleafs! Please check your credentials!");
        }
    }
    stopClient(_, logger) {
        // There is really nothing to do here
        logger.info("Successfully stopped nanoleaf client.");
    }
}
//# sourceMappingURL=index.js.map