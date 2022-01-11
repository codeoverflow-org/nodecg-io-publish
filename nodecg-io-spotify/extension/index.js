"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecg_io_core_1 = require("nodecg-io-core");
const express = (0, tslib_1.__importStar)(require("express"));
const SpotifyWebApi = require("spotify-web-api-node");
const open = require("open");
let callbackUrl = "";
const callbackEndpoint = "/nodecg-io-spotify/spotifycallback";
const defaultState = "defaultState";
const refreshInterval = 1800000;
module.exports = (nodecg) => {
    callbackUrl = `http://${nodecg.config.baseURL}${callbackEndpoint}`;
    new SpotifyService(nodecg, "spotify", __dirname, "../spotify-schema.json").register();
};
class SpotifyService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config) {
        if (config.scopes === undefined || config.scopes.length === 0) {
            return (0, nodecg_io_core_1.error)("Scopes are empty. Please specify at least one scope!");
        }
        else {
            return (0, nodecg_io_core_1.emptySuccess)();
        }
    }
    async createClient(config, logger) {
        logger.info("Spotify service connecting...");
        const spotifyApi = new SpotifyWebApi({
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            redirectUri: callbackUrl,
        });
        // if we already have a refresh token is available we can use it to create a access token without the need to annoy the user
        // by opening and directly after closing a browser window.
        if (config.refreshToken) {
            try {
                // Load refresh token and use it to get a access token.
                spotifyApi.setRefreshToken(config.refreshToken);
                const refreshData = await spotifyApi.refreshAccessToken();
                spotifyApi.setAccessToken(refreshData.body["access_token"]);
                logger.info("Successfully authenticated using saved refresh token.");
            }
            catch (e) {
                logger.warn(`Couldn't re-use refresh token ("${e}"). Creating a new one...`);
                config.refreshToken = undefined;
                return await this.createClient(config, logger);
            }
        }
        else {
            // Creates a callback entry point using express. The promise resolves when this url is called.
            const promise = this.mountCallBackURL(spotifyApi, logger);
            // Create and call authorization URL
            const authorizeURL = spotifyApi.createAuthorizeURL(config.scopes, defaultState);
            await open(authorizeURL);
            await promise;
            config.refreshToken = spotifyApi.getRefreshToken();
        }
        logger.info("Successfully connected to Spotify.");
        this.startTokenRefreshing(spotifyApi, logger);
        return (0, nodecg_io_core_1.success)(spotifyApi);
    }
    mountCallBackURL(spotifyApi, logger) {
        return new Promise((resolve) => {
            const router = express.Router();
            router.get(callbackEndpoint, (req, res) => {
                var _a, _b;
                // Get auth code with is returned as url query parameter if everything was successful
                const authCode = (_b = (_a = req.query.code) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "";
                spotifyApi === null || spotifyApi === void 0 ? void 0 : spotifyApi.authorizationCodeGrant(authCode).then((data) => {
                    spotifyApi.setAccessToken(data.body["access_token"]);
                    spotifyApi.setRefreshToken(data.body["refresh_token"]);
                    resolve(undefined);
                }, (err) => logger.error("Spotify login error!", err));
                // This little snippet closes the oauth window after the connection was successful
                const callbackWebsite = "<html><head><script>window.close();</script></head><body>Spotify connection successful! You may close this window now.</body></html>";
                res.send(callbackWebsite);
            });
            this.nodecg.mount(router);
        });
    }
    startTokenRefreshing(spotifyApi, logger) {
        const interval = setInterval(() => {
            if (spotifyApi.getAccessToken() === undefined) {
                clearInterval(interval);
                return;
            }
            spotifyApi.refreshAccessToken().then((data) => {
                logger.info("The Spotify access token has been refreshed.");
                // Save the access token so that it's used in future calls
                spotifyApi.setAccessToken(data.body["access_token"]);
            }, (error) => {
                logger.warn("Could not spotify refresh access token", error);
            });
        }, refreshInterval);
    }
    stopClient(client) {
        // Client can't be stopped, it is just a stateless http client but token refreshing should be stopped
        // To do that we reset the refresh token which will be checked by the interval that refreshes the access token
        // and will result in it stopping to resfresh.
        client.resetAccessToken();
    }
}
//# sourceMappingURL=index.js.map