"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeToken = exports.getTokenInfo = exports.createAuthProvider = void 0;
const auth_1 = require("@twurple/auth");
async function createAuthProvider(cfg) {
    const tokenInfo = await getTokenInfo(cfg);
    return new auth_1.StaticAuthProvider(tokenInfo.clientId, normalizeToken(cfg), tokenInfo.scopes);
}
exports.createAuthProvider = createAuthProvider;
/**
 * Gets the token info for the passed config.
 */
async function getTokenInfo(cfg) {
    return await (0, auth_1.getTokenInfo)(normalizeToken(cfg));
}
exports.getTokenInfo = getTokenInfo;
/**
 * Strips any "oauth:" before the token away, because the client needs the token without it.
 */
function normalizeToken(cfg) {
    return cfg.oauthKey.replace("oauth:", "");
}
exports.normalizeToken = normalizeToken;
//# sourceMappingURL=index.js.map