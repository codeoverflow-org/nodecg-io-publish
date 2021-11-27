"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
const rcon_client_1 = require("rcon-client");
module.exports = (nodecg) => {
    new RconService(nodecg, "rcon", __dirname, "../rcon-schema.json").register();
};
class RconService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config) {
        const rcon = new rcon_client_1.Rcon({
            host: config.host,
            port: config.port,
            password: config.password,
        });
        // We need one error handler or node will exit the process on an error.
        rcon.on("error", (_err) => { });
        await rcon.connect(); // This will throw an exception if there is an error.
        rcon.end();
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config, logger) {
        const rcon = new rcon_client_1.Rcon({
            host: config.host,
            port: config.port,
            password: config.password,
        });
        // We need one error handler or node will exit the process on an error.
        rcon.on("error", (_err) => { });
        await rcon.connect(); // This will throw an exception if there is an error.
        logger.info("Successfully connected to the RCON server.");
        return (0, nodecg_io_core_1.success)(rcon);
    }
    stopClient(client, logger) {
        client.end().then(() => {
            logger.info("Successfully stopped RCON client.");
        });
    }
}
//# sourceMappingURL=index.js.map