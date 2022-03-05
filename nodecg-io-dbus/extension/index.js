"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecg_io_core_1 = require("nodecg-io-core");
const dbusClient_1 = require("./dbusClient");
const dbus = tslib_1.__importStar(require("dbus-next"));
tslib_1.__exportStar(require("./dbusClient"), exports);
module.exports = (nodecg) => {
    new DBusService(nodecg, "dbus", __dirname, "../schema.json").register();
};
class DBusService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config) {
        dbus.sessionBus(config);
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config, logger) {
        const client = dbusClient_1.DBusClient.createClient(config);
        logger.info("Successfully created dbus client.");
        return (0, nodecg_io_core_1.success)(client);
    }
    stopClient(client, logger) {
        client.session.disconnect();
        client.system.disconnect();
        logger.info("Successfully stopped dbus client.");
    }
    removeHandlers(client) {
        client.session.removeAllListeners();
        client.system.removeAllListeners();
    }
}
//# sourceMappingURL=index.js.map