"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for spotify started");
    const service = (0, nodecg_io_core_1.requireService)(nodecg, "spotify");
    service === null || service === void 0 ? void 0 : service.onAvailable(async (client) => {
        nodecg.log.info("Spotify client has been updated, searching for current song information.");
        const trackResponse = await client.getMyCurrentPlayingTrack();
        const track = trackResponse.body.item;
        if (track) {
            const name = track.name;
            const artists = track.type === "track" ? track.artists.map((a) => a.name) : "unknown";
            nodecg.log.info(`Currently playing "${name}" by "${artists}".`);
        }
        else {
            nodecg.log.info("Not playing anthing right now.");
        }
    });
    service === null || service === void 0 ? void 0 : service.onUnavailable(() => nodecg.log.info("Spotify client has been unset."));
};
//# sourceMappingURL=index.js.map