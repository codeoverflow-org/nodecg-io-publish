"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecg_io_core_1 = require("nodecg-io-core");
const discordRpcAuth_1 = require("./discordRpcAuth");
const rpc = tslib_1.__importStar(require("discord-rpc"));
module.exports = (nodecg) => {
    new DiscordRpcService(nodecg, "discord-rpc", __dirname, "../schema.json").register();
};
class DiscordRpcService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config) {
        const client = new rpc.Client({ transport: "ipc" });
        const login = await (0, discordRpcAuth_1.createLoginData)(client, config, ["identify", "rpc"]);
        await client.login(login);
        await client.destroy();
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config, logger) {
        const client = new rpc.Client({ transport: "ipc" });
        const login = await (0, discordRpcAuth_1.createLoginData)(client, config, ["identify", "rpc"]);
        await client.login(login);
        logger.info("Successfully created discord-rpc client.");
        return (0, nodecg_io_core_1.success)(client);
    }
    stopClient(client, logger) {
        client.destroy().then((_) => logger.info("Successfully stopped discord-rpc client."));
    }
    removeHandlers(client) {
        client.removeAllListeners();
    }
}
//# sourceMappingURL=index.js.map