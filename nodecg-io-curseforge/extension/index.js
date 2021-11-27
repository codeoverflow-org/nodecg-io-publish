"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagicValues = exports.CurseFile = exports.CurseAddon = void 0;
const nodecg_io_core_1 = require("nodecg-io-core");
const curseforgeClient_1 = require("./curseforgeClient");
var curseforgeClient_2 = require("./curseforgeClient");
Object.defineProperty(exports, "CurseAddon", { enumerable: true, get: function () { return curseforgeClient_2.CurseAddon; } });
Object.defineProperty(exports, "CurseFile", { enumerable: true, get: function () { return curseforgeClient_2.CurseFile; } });
Object.defineProperty(exports, "MagicValues", { enumerable: true, get: function () { return curseforgeClient_2.MagicValues; } });
module.exports = (nodecg) => {
    new CurseforgeService(nodecg, "curseforge").register();
};
class CurseforgeService extends nodecg_io_core_1.ServiceBundle {
    constructor() {
        super(...arguments);
        this.requiresNoConfig = true;
    }
    async validateConfig() {
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(_, logger) {
        const client = new curseforgeClient_1.CurseForge();
        logger.info("Successfully created CurseForge client.");
        return (0, nodecg_io_core_1.success)(client);
    }
    stopClient(_, logger) {
        logger.info("Successfully stopped CurseForge client.");
    }
}
//# sourceMappingURL=index.js.map