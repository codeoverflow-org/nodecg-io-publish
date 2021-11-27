"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SacnSenderServiceClient = void 0;
const nodecg_io_core_1 = require("nodecg-io-core");
const sacnSenderClient_1 = require("./sacnSenderClient");
var sacnSenderClient_2 = require("./sacnSenderClient");
Object.defineProperty(exports, "SacnSenderServiceClient", { enumerable: true, get: function () { return sacnSenderClient_2.SacnSenderServiceClient; } });
module.exports = (nodecg) => {
    new SacnSenderService(nodecg, "sacn-sender", __dirname, "../sacn-sender-schema.json").register();
};
class SacnSenderService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig() {
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config) {
        const sacn = new sacnSenderClient_1.SacnSenderServiceClient(config);
        return (0, nodecg_io_core_1.success)(sacn);
    }
    stopClient(client, logger) {
        client.close();
        logger.info("Successfully stopped sACN Sender.");
    }
}
//# sourceMappingURL=index.js.map