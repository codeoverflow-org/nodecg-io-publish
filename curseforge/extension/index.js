"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for Curseforge started.");
    const curseforge = (0, nodecg_io_core_1.requireService)(nodecg, "curseforge");
    curseforge === null || curseforge === void 0 ? void 0 : curseforge.onAvailable(async (client) => {
        nodecg.log.info("Curseforge service available.");
        const addonIds = [346054, 400058, 408447, 438104];
        const addons = await client.getMultipleAddons(addonIds);
        nodecg.log.info("Here are the projects which belongs to the ids:");
        addons.forEach((addon) => {
            var _a;
            nodecg.log.info(`- '${addon.info.name}' (${addon.info.gameName} addon) by ${(_a = addon.info.authors[0]) === null || _a === void 0 ? void 0 : _a.name}`);
        });
        const query = {
            gameId: 432,
            sectionId: 6,
            gameVersion: "1.16.5",
            searchFilter: "MelanX",
        };
        const response = await client.searchForAddons(query);
        nodecg.log.info("All 1.16.5 Minecraft mods by MelanX:");
        response.forEach((addon) => {
            nodecg.log.info(`- ${addon.info.name}`);
        });
    });
    curseforge === null || curseforge === void 0 ? void 0 : curseforge.onUnavailable(() => {
        nodecg.log.info("Curseforge service unavailable.");
    });
};
//# sourceMappingURL=index.js.map