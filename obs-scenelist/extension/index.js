"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for OBS started");
    const obs = (0, nodecg_io_core_1.requireService)(nodecg, "obs");
    obs === null || obs === void 0 ? void 0 : obs.onAvailable((client) => {
        nodecg.log.info("OBS client has been updated, counting scenes and switching to another one.");
        client.send("GetSceneList").then((data) => {
            nodecg.log.info(`There are ${data.scenes.length} scenes!`);
        });
        client.on("SwitchScenes", (data) => {
            nodecg.log.info(`Scene changed to ${data["scene-name"]}.`);
        });
    });
    obs === null || obs === void 0 ? void 0 : obs.onUnavailable(() => nodecg.log.info("OBS client has been unset."));
};
//# sourceMappingURL=index.js.map