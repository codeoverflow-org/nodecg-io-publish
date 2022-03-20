"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchAddonsClient = void 0;
const tslib_1 = require("tslib");
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
const nodecg_io_twitch_auth_1 = require("nodecg-io-twitch-auth");
class TwitchAddonsClient {
    constructor(clientId, token) {
        this.clientId = clientId;
        this.token = token;
    }
    /**
     * Gets the global emotes of BetterTTV
     */
    async getBetterTTVGlobalEmotes() {
        return await (await (0, node_fetch_1.default)("https://api.betterttv.net/3/cached/emotes/global")).json();
    }
    /**
     * Gets the BetterTTV channel data associated with a twitch channel or undefined if that twitch user has
     * not registered for BetterTTV.
     */
    async getBetterTTVChannel(channel) {
        const channelId = await this.getUserId(channel);
        if (channelId === undefined) {
            throw new Error(`Unknown twitch channel: ${channel}`);
        }
        const response = await (await (0, node_fetch_1.default)(`https://api.betterttv.net/3/cached/users/twitch/${channelId}`)).json();
        if (response.message === "user not found") {
            // The user has no channel at BTTV (probably never logged in there)
            return undefined;
        }
        else if (response.message !== undefined) {
            throw new Error(`Failed to get BTTV channel: ${response.message}`);
        }
        return response;
    }
    /**
     * Gets the FFZ global emotes
     */
    async getFFZGlobalEmotes() {
        return await (await (0, node_fetch_1.default)("https://api.frankerfacez.com/v1/set/global")).json();
    }
    /**
     * Gets the FFZ channel data associated with a twitch channel or undefined if that twitch user has
     * not registered for FFZ.
     */
    async getFFZChannel(channel) {
        const channelId = await this.getUserId(channel);
        if (channelId === undefined) {
            throw new Error(`Unknown twitch channel: ${channel}`);
        }
        const response = await (await (0, node_fetch_1.default)(`https://api.frankerfacez.com/v1/room/id/${channelId}`)).json();
        if (response.error !== undefined) {
            if (response.message === "No such room") {
                // The user has no room at FFZ (probably never logged in there)
                return undefined;
            }
            else {
                throw new Error(`Failed to get FFZ channel: ${response.message}`);
            }
        }
        return response;
    }
    /**
     * Gets the 7TV global emotes
     */
    async getSevenTVGlobalEmotes() {
        return await (await (0, node_fetch_1.default)("https://api.7tv.app/v2/emotes/global")).json();
    }
    /**
     * Gets the 7tv channel data associated with a twitch channel or undefined if that twitch user has
     * not registered for 7tv.
     */
    async getSevenTVChannel(channel) {
        const channelId = await this.getUserId(channel);
        if (channelId === undefined) {
            throw new Error(`Unknown twitch channel: ${channel}`);
        }
        const response = await (await (0, node_fetch_1.default)(`https://api.7tv.app/v2/users/${channelId}/emotes`)).json();
        if (response.status === 404) {
            if (response.message.startsWith("Unknown User")) {
                // The user has no room at 7TV (probably never logged in there)
                return undefined;
            }
            else {
                throw new Error(`Failed to get 7TV channel: ${response.message}`);
            }
        }
        return response;
    }
    /**
     * Gets an emote collection for a channel. Here all emotes are stored so you can access all of them
     * without always sending requests to the APIs and caring about undefined values. (If someone is not
     * registered somewhere, there'll just be empty lists here).
     * @param
     */
    async getEmoteCollection(channel, options = { includeGlobal: true, include7tv: false }) {
        const { includeGlobal = true, include7tv = false } = options;
        const bttv = await this.getBetterTTVChannel(channel);
        const ffz = await this.getFFZChannel(channel);
        const stv = include7tv ? await this.getSevenTVChannel(channel) : undefined;
        const bttvGlobal = includeGlobal ? await this.getBetterTTVGlobalEmotes() : undefined;
        const ffzGlobal = includeGlobal ? await this.getFFZGlobalEmotes() : undefined;
        const stvGlobal = includeGlobal ? await this.getSevenTVGlobalEmotes() : undefined;
        const ffzGlobalSets = [];
        if (ffzGlobal !== undefined) {
            for (const set of ffzGlobal.default_sets) {
                const setObj = ffzGlobal.sets[set.toString()];
                if (setObj !== undefined) {
                    ffzGlobalSets.push(setObj);
                }
            }
        }
        return {
            bttvChannel: bttv === undefined ? [] : bttv.channelEmotes,
            bttvShared: bttv === undefined ? [] : bttv.sharedEmotes,
            bttvGlobal: bttvGlobal === undefined ? [] : bttvGlobal,
            ffz: ffz === undefined ? [] : Object.values(ffz.sets),
            ffzGlobal: ffzGlobalSets,
            stv: stv === undefined ? [] : stv,
            stvGlobal: stvGlobal === undefined ? [] : stvGlobal,
        };
    }
    /**
     * Gets all emote names from an emote collection.
     */
    getEmoteNames(emotes) {
        const emotes_list = new Set();
        for (const emote of emotes.bttvChannel) {
            emotes_list.add(emote.code);
        }
        for (const emote of emotes.bttvShared) {
            emotes_list.add(emote.code);
        }
        for (const set of emotes.ffz) {
            for (const emote of set.emoticons) {
                emotes_list.add(emote.name);
            }
        }
        for (const emote of emotes.stv) {
            emotes_list.add(emote.name);
        }
        for (const emote of emotes.bttvGlobal) {
            emotes_list.add(emote.code);
        }
        for (const set of emotes.ffzGlobal) {
            for (const emote of set.emoticons) {
                emotes_list.add(emote.name);
            }
        }
        for (const emote of emotes.stvGlobal) {
            emotes_list.add(emote.name);
        }
        return [...emotes_list];
    }
    /**
     * Gets the emote URL for an emote name from an emote collection. If the requested resolution is
     * not available, you'll get the next available resolution that is smaller than the one you gave.
     * If there's no smaller resolution, you'll get the next bigger one.
     */
    async getEmoteURL(emote, emotes, resolution) {
        // BTTV has resolutions 1, 2 and 3, ffz and twitch use 1, 2, and 4
        const bttvResolution = resolution === 4 ? "3" : resolution.toString();
        for (const entry of emotes.bttvChannel) {
            if (entry.code === emote) {
                return `https://cdn.betterttv.net/emote/${entry.id}/${bttvResolution}x.${entry.imageType}`;
            }
        }
        for (const entry of emotes.bttvShared) {
            if (entry.code === emote) {
                return `https://cdn.betterttv.net/emote/${entry.id}/${bttvResolution}x.${entry.imageType}`;
            }
        }
        for (const set of emotes.ffz) {
            for (const entry of set.emoticons) {
                if (entry.name === emote) {
                    const url = TwitchAddonsClient.getFFZUrl(entry.urls, resolution);
                    if (url !== undefined) {
                        return this.getURL(url);
                    }
                }
            }
        }
        for (const entry of emotes.stv) {
            if (entry.name === emote) {
                return `https://cdn.7tv.app/emote/${entry.id}/${resolution}x`;
            }
        }
        for (const entry of emotes.bttvGlobal) {
            if (entry.code === emote) {
                return `https://cdn.betterttv.net/emote/${entry.id}/${bttvResolution}x.${entry.imageType}`;
            }
        }
        for (const set of emotes.ffzGlobal) {
            for (const entry of set.emoticons) {
                if (entry.name === emote) {
                    const url = TwitchAddonsClient.getFFZUrl(entry.urls, resolution);
                    if (url !== undefined) {
                        return this.getURL(url);
                    }
                }
            }
        }
        for (const entry of emotes.stvGlobal) {
            if (entry.name === emote) {
                return `https://cdn.7tv.app/emote/${entry.id}/${resolution}x`;
            }
        }
        return undefined;
    }
    /**
     * Gets a complete URL from a ffz URL. (This prepends `https:` to the ffz url)
     * @param part
     */
    getURL(part) {
        return "https:" + part;
    }
    async getUserId(channelId) {
        const username = channelId.startsWith("#") ? channelId.substr(1) : channelId;
        const response = await (await (0, node_fetch_1.default)(`https://api.twitch.tv/helix/users?login=${username}`, {
            headers: {
                "Client-ID": this.clientId,
                "Authorization": `Bearer ${this.token}`,
            },
        })).json();
        if (response.data.length > 0) {
            return response.data[0].id;
        }
        else {
            return undefined;
        }
    }
    static getFFZUrl(urls, resolution) {
        for (let i = resolution; i > 0; i--) {
            const resolutionStr = resolution.toString();
            if (resolutionStr in urls) {
                return urls[resolutionStr];
            }
        }
        for (let i = resolution + 1; i <= 4; i++) {
            const resolutionStr = resolution.toString();
            if (resolutionStr in urls) {
                return urls[resolutionStr];
            }
        }
        // Should not happen...
        return undefined;
    }
    static async createClient(config) {
        const tokenInfo = await (0, nodecg_io_twitch_auth_1.getTokenInfo)(config);
        return new TwitchAddonsClient(tokenInfo.clientId, (0, nodecg_io_twitch_auth_1.normalizeToken)(config));
    }
}
exports.TwitchAddonsClient = TwitchAddonsClient;
//# sourceMappingURL=twitchAddonsClient.js.map