"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SacnReceiverServiceClient = void 0;
const nodecg_io_core_1 = require("nodecg-io-core");
const sacnReceiverClient_1 = require("./sacnReceiverClient");
var sacnReceiverClient_2 = require("./sacnReceiverClient");
Object.defineProperty(exports, "SacnReceiverServiceClient", { enumerable: true, get: function () { return sacnReceiverClient_2.SacnReceiverServiceClient; } });
module.exports = (nodecg) => {
    new SacnReceiverService(nodecg, "sacn-receiver", __dirname, "../sacn-receiver-schema.json").register();
};
class SacnReceiverService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig() {
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config) {
        const sacn = new sacnReceiverClient_1.SacnReceiverServiceClient(config);
        return (0, nodecg_io_core_1.success)(sacn);
    }
    stopClient(client, logger) {
        client.close();
        logger.info("Successfully stopped sACN Receiver.");
    }
    removeHandlers(client) {
        client.removeAllListeners();
    }
}
//# sourceMappingURL=index.js.map