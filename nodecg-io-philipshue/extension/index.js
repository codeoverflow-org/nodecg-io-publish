"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
const is_ip_1 = require("is-ip");
const node_hue_api_1 = require("node-hue-api");
const { api, discovery } = node_hue_api_1.v3;
const deviceName = "nodecg-io";
const name = "philipshue";
module.exports = (nodecg) => {
    new PhilipsHueService(nodecg, "philipshue", __dirname, "../philipshue-schema.json").register();
};
class PhilipsHueService extends nodecg_io_core_1.ServiceBundle {
    constructor(nodecg, name, ...pathSegments) {
        super(nodecg, name, ...pathSegments);
        this.presets = {};
        this.discoverBridges()
            .then((bridgePresets) => (this.presets = bridgePresets))
            .catch((err) => nodecg.log.error(`Failed to discover local bridges: ${err}`));
    }
    async validateConfig(config) {
        const { port, ipAddr } = config;
        if (!(0, is_ip_1.v4)(ipAddr)) {
            return (0, nodecg_io_core_1.error)("Invalid IP address, can handle only IPv4 at the moment!");
        }
        else if (port && !(0 <= port && port <= 65535)) {
            // the port is there but the port is wrong
            return (0, nodecg_io_core_1.error)("Your port is not between 0 and 65535!");
        }
        // YAY! the config is good
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config) {
        const { port, username, apiKey, ipAddr } = config;
        // check if there is one thing missing
        if (!username || !apiKey) {
            // Create an unauthenticated instance of the Hue API so that we can create a new user
            const unauthenticatedApi = await api.createLocal(ipAddr, port).connect();
            let createdUser;
            try {
                createdUser = await unauthenticatedApi.users.createUser(name, deviceName);
                // debug output
                // nodecg.log.info(`Hue Bridge User: ${createdUser.username}`);
                // nodecg.log.info(`Hue Bridge User Client Key: ${createdUser.clientkey}`);
                config.username = createdUser.username;
                config.apiKey = createdUser.clientkey;
            }
            catch (err) {
                if (err.getHueErrorType() === 101) {
                    return (0, nodecg_io_core_1.error)("The Link button on the bridge was not pressed. Please press the Link button and try again.\n" +
                        "for the one who is seeing this in the console, you need to press the big button on the bridge for creating an bundle/instance!");
                }
                else {
                    return (0, nodecg_io_core_1.error)(`Unexpected Error: ${err.message}`);
                }
            }
        }
        // Create a new API instance that is authenticated with the new user we created
        const client = await api.createLocal(ipAddr, port).connect(config.username, config.apiKey);
        return (0, nodecg_io_core_1.success)(client);
    }
    stopClient(_client) {
        // Not supported from the client
    }
    async discoverBridges() {
        const results = await discovery.nupnpSearch();
        return Object.fromEntries(results.map((bridge) => {
            const ipAddr = bridge.ipaddress;
            const config = { ipAddr };
            return [ipAddr, config];
        }));
    }
}
//# sourceMappingURL=index.js.map