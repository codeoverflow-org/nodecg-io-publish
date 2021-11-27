"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecg_io_core_1 = require("nodecg-io-core");
const googleapis_1 = require("googleapis");
const express = (0, tslib_1.__importStar)(require("express"));
const opn = require("open");
module.exports = (nodecg) => {
    new GoogleApisService(nodecg, "googleapis", __dirname, "../googleapis-schema.json").register();
};
class GoogleApisService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(_config) {
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config, logger) {
        const auth = new googleapis_1.google.auth.OAuth2({
            clientId: config.clientID,
            clientSecret: config.clientSecret,
            redirectUri: "http://localhost:9090/nodecg-io-googleapis/oauth2callback",
        });
        await this.refreshTokens(config, auth, logger);
        const client = new googleapis_1.GoogleApis({ auth });
        return (0, nodecg_io_core_1.success)(client);
    }
    stopClient(_client) {
        return;
    }
    async initialAuth(config, auth) {
        const authURL = auth.generateAuthUrl({
            access_type: "offline",
            prompt: "consent",
            scope: config.scopes,
        });
        return new Promise((resolve, reject) => {
            const router = express.Router();
            router.get("/nodecg-io-googleapis/oauth2callback", async (req, res) => {
                try {
                    const response = `<html><head><script>window.close();</script></head><body>Google Api connection successful! You may close this window now.</body></html>`;
                    res.send(response);
                    const { tokens } = await auth.getToken(req.query.code);
                    resolve(tokens);
                }
                catch (e) {
                    reject((0, nodecg_io_core_1.error)(e));
                }
            });
            this.nodecg.mount(router);
            opn(authURL, { wait: false }).then((cp) => cp.unref());
        });
    }
    async refreshTokens(config, auth, logger) {
        if (config.refreshToken) {
            logger.info("Re-using saved refresh token.");
            auth.setCredentials({ refresh_token: config.refreshToken });
        }
        else {
            logger.info("No refresh token found. Starting auth flow to get one ...");
            auth.setCredentials(await this.initialAuth(config, auth));
            if (auth.credentials.refresh_token) {
                config.refreshToken = auth.credentials.refresh_token;
            }
        }
        auth.on("tokens", (tokens) => {
            if (tokens.refresh_token)
                config.refreshToken = tokens.refresh_token;
        });
    }
}
//# sourceMappingURL=index.js.map