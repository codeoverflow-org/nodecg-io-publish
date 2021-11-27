"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IRCServiceClient = void 0;
const nodecg_io_core_1 = require("nodecg-io-core");
const irc_1 = require("irc");
class IRCServiceClient extends irc_1.Client {
    constructor(config) {
        var _a;
        super(config.host, config.nick, {
            password: config.password,
            autoConnect: false,
            retryCount: (_a = config.reconnectTries) !== null && _a !== void 0 ? _a : 3,
            retryDelay: 500,
        });
    }
    sendMessage(target, message) {
        this.say(target, message);
    }
}
exports.IRCServiceClient = IRCServiceClient;
module.exports = (nodecg) => {
    new IRCService(nodecg, "irc", __dirname, "../irc-schema.json").register();
};
class IRCService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(_config) {
        // no checks are currently done here. Server and password are checked in createClient()
        // We could check whether the port is valid and the host/ip is valid here in the future.
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config, logger) {
        const irc = new IRCServiceClient(config);
        logger.info("Connecting to IRC...");
        await this.connect(irc);
        logger.info("Successfully connected to the IRC server.");
        return (0, nodecg_io_core_1.success)(irc);
    }
    stopClient(client, logger) {
        client.disconnect("", () => {
            logger.info("Stopped IRC client successfully.");
        });
    }
    removeHandlers(client) {
        client.removeAllListeners();
    }
    connect(client) {
        return new Promise((resolve, reject) => {
            // We need one error handler or node will exit the process on an error.
            client.on("error", (err) => reject(err));
            client.on("abort", () => {
                reject("Couldn't connect to IRC server! Maximum retry count reached.");
            });
            client.connect(0, () => resolve(undefined));
        });
    }
}
//# sourceMappingURL=index.js.map