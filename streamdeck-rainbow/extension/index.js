"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for streamdeck started");
    const streamdeck = (0, nodecg_io_core_1.requireService)(nodecg, "streamdeck");
    let timeout;
    streamdeck === null || streamdeck === void 0 ? void 0 : streamdeck.onAvailable((deck) => {
        nodecg.log.info("Streamdeck client has been updated, painting the Streamdeck.");
        try {
            const colors = [
                [231, 60, 60],
                [231, 128, 60],
                [231, 197, 60],
                [197, 231, 60],
                [128, 231, 60],
                [60, 231, 60],
                [60, 231, 128],
                [60, 231, 179],
                [60, 197, 231],
                [60, 128, 231],
                [60, 60, 231],
                [128, 60, 231],
                [197, 60, 179],
                [231, 60, 128],
            ];
            let i = 0;
            timeout = setInterval(() => {
                var _a, _b, _c, _d, _e, _f;
                try {
                    deck.fillKeyColor(i % deck.NUM_KEYS, (_b = (_a = colors[i % colors.length]) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : 0, (_d = (_c = colors[i % colors.length]) === null || _c === void 0 ? void 0 : _c[1]) !== null && _d !== void 0 ? _d : 0, (_f = (_e = colors[i % colors.length]) === null || _e === void 0 ? void 0 : _e[2]) !== null && _f !== void 0 ? _f : 0);
                    i += 1;
                }
                catch (err) {
                    nodecg.log.info("Streamdeck error: " + String(err));
                }
            }, 200);
        }
        catch (err) {
            nodecg.log.info("Streamdeck error: " + String(err));
        }
    });
    streamdeck === null || streamdeck === void 0 ? void 0 : streamdeck.onUnavailable(() => {
        nodecg.log.info("Streamdeck client has been unset.");
        if (timeout) {
            clearTimeout(timeout);
        }
    });
};
//# sourceMappingURL=index.js.map