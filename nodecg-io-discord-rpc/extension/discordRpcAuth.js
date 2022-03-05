"use strict";
// Required because discord-rpc does not expose the access token
// and does not even use the refresh token.
// Without this, users would be prompted on whether they agree, whenever
// the service connects to discord.
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoginData = void 0;
const tslib_1 = require("tslib");
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
const url_1 = require("url");
// Fill the config values and create matching login data
async function createLoginData(client, config, scopes) {
    await client.connect(config.clientId);
    const redirectUrl = config.redirectUrl === undefined ? "http://127.0.0.1" : config.redirectUrl;
    if (config.accessToken === undefined || config.refreshToken === undefined || config.expireTime === undefined) {
        // Call authorize
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const authorizeResult = await client.request("AUTHORIZE", {
            client_id: config.clientId,
            scopes: scopes,
        });
        const response = await (0, node_fetch_1.default)("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: encodeQuery({
                client_id: config.clientId,
                client_secret: config.clientSecret,
                grant_type: "authorization_code",
                code: authorizeResult.code,
                redirect_uri: redirectUrl,
                scope: scopes.join(" "),
            }),
        });
        const data = await response.json();
        if ("error" in data)
            throw new Error("error_description" in data ? data.error_description : "Unknown discord rpc login error");
        config.accessToken = data.access_token;
        config.refreshToken = data.refresh_token;
        config.expireTime = data.expires_in + Date.now() / 1000 - 1000;
    }
    else if (config.expireTime < Date.now() / 1000) {
        // Token expired. Request a new one using the refresh token.
        const response = await (0, node_fetch_1.default)("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: encodeQuery({
                client_id: config.clientId,
                client_secret: config.clientSecret,
                grant_type: "refresh_token",
                refresh_token: config.refreshToken,
                redirect_uri: redirectUrl,
                scope: scopes.join(" "),
            }),
        });
        const data = await response.json();
        if ("error" in data)
            throw new Error("error_description" in data ? data.error_description : "Unknown discord rpc refresh error");
        config.accessToken = data.access_token;
        config.refreshToken = data.refresh_token;
        config.expireTime = data.expires_in + Date.now() / 1000 - 1000;
    }
    return {
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        redirectUri: redirectUrl,
        scopes: scopes,
        accessToken: config.accessToken,
    };
}
exports.createLoginData = createLoginData;
function encodeQuery(query) {
    const params = new url_1.URLSearchParams();
    for (const key in query) {
        params.append(key, String(query[key]));
    }
    return params;
}
//# sourceMappingURL=discordRpcAuth.js.map