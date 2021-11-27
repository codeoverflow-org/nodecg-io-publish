"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
const knex_1 = require("knex");
module.exports = (nodecg) => {
    new SQLService(nodecg, "sql", __dirname, "../schema.json").register();
};
class SQLService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config) {
        // No way to validate without creating the client, thus only statically validating the configs
        if (config.client === "mysql" || config.client === "pg") {
            if (!config.connection.host ||
                !config.connection.user ||
                !config.connection.password ||
                !config.connection.database) {
                return (0, nodecg_io_core_1.error)("Invalid config. Either host, user, password or database is missing.");
            }
        }
        else if (config.client === "sqlite3" && !config.connection.filename) {
            return (0, nodecg_io_core_1.error)("Invalid config. Filename is missing.");
        }
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config, logger) {
        const knexInstance = (0, knex_1.knex)(config);
        logger.info("Successfully created sql client.");
        return (0, nodecg_io_core_1.success)(knexInstance);
    }
    stopClient(client, logger) {
        client.destroy();
        logger.info("Successfully stopped sql client.");
    }
}
//# sourceMappingURL=index.js.map