"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AHK = void 0;
const tslib_1 = require("tslib");
const node_fetch_1 = (0, tslib_1.__importDefault)(require("node-fetch"));
class AHK {
    constructor(logger, host, port) {
        this.logger = logger;
        this.address = `http://${host}:${port}`;
    }
    async testConnection() {
        const response = await (0, node_fetch_1.default)(`${this.address}/nodecg-io`, { method: "GET" });
        return response.status === 404;
    }
    async sendCommand(command) {
        try {
            await (0, node_fetch_1.default)(`${this.address}/send/${command}`, { method: "GET" });
        }
        catch (err) {
            this.logger.error(`Error while using the AHK Connector: ${err}`);
        }
    }
}
exports.AHK = AHK;
//# sourceMappingURL=AHK.js.map