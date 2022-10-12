"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleCastClient = void 0;
const tslib_1 = require("tslib");
const device_1 = tslib_1.__importDefault(require("chromecast-api/lib/device"));
const CONNECT_TIMEOUT = 15000;
class GoogleCastClient extends device_1.default {
    static async createClient(config) {
        var _a, _b;
        const device = new GoogleCastClient({
            name: (_a = config.name) !== null && _a !== void 0 ? _a : "",
            friendlyName: (_b = config.friendlyName) !== null && _b !== void 0 ? _b : "",
            host: config.host,
        });
        const d = device;
        await new Promise((resolve, reject) => {
            d._tryConnect(() => resolve(undefined));
            d.client.on("error", (err) => {
                // oh nein
                reject(err);
            });
            setTimeout(() => reject(new Error("Connect timeout reached")), CONNECT_TIMEOUT);
        });
        return device;
    }
}
exports.GoogleCastClient = GoogleCastClient;
//# sourceMappingURL=castClient.js.map