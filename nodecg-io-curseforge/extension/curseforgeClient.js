"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagicValues = exports.CurseFile = exports.CurseAddon = exports.CurseForge = void 0;
const tslib_1 = require("tslib");
const node_fetch_1 = (0, tslib_1.__importDefault)(require("node-fetch"));
class CurseForge {
    /**
     * Get a curse addon.
     * @param addonId The id of the addon.
     */
    async getAddon(addonId) {
        return CurseAddon.create(this, addonId);
    }
    /**
     * Get an array of curse addons.
     * @param addonIds An array of ids for multiple addons.
     */
    async getMultipleAddons(addonIds) {
        const addons = [];
        for (const id of addonIds) {
            addons.push(await CurseAddon.create(this, id));
        }
        return addons;
    }
    /**
     * Get an array of addons with the search results for the given query.
     * @param query The CurseSearchQuery to use. See documentation of CurseSearchQuery for more info.
     */
    async searchForAddons(query) {
        const params = new URLSearchParams();
        Object.entries(query).forEach((e) => {
            if (e[1])
                params.append(e[0], e[1].toString());
        });
        const response = (await this.rawRequest("GET", `addon/search?${params}`));
        return response.map((x) => new CurseAddon(this, x.id, x));
    }
    /**
     * Get a CurseFeaturedAddonsResponse for the given query. See documentation of CurseFeaturedAddonsResponse for more info.
     * @param query The CurseFeaturedAddonsQuery to use. See documentation of CurseFeaturedAddonsQuery for more info.
     */
    async getFeaturedAddons(query) {
        return this.rawRequest("POST", "addon/featured", query);
    }
    /**
     * Get a CurseFingerprintResponse for given fingerprints. See documentation of CurseFingerprintResponse for more info.
     * @param fingerprints An array of murmurhash2 values of each file without whitespaces.
     */
    async getAddonByFingerprint(fingerprints) {
        return this.rawRequest("POST", "fingerprint", fingerprints);
    }
    /**
     * Get an array of all available mod loaders.
     */
    async getModloaderList() {
        return this.rawRequest("GET", "minecraft/modloader");
    }
    /**
     * Get an array of all available curse categories.
     */
    async getCategoryInfoList() {
        return this.rawRequest("GET", "https://addons-ecs.forgesvc.net/api/v2/category");
    }
    /**
     * Get information of a specific category.
     * @param categoryId The id of the category you want information for.
     */
    async getCategoryInfo(categoryId) {
        return this.rawRequest("GET", `category/${categoryId}`);
    }
    /**
     * Get information of a specific section.
     * @param sectionId The id of the section you want information for.
     */
    async getCategorySectionInfo(sectionId) {
        return this.rawRequest("GET", `category/section/${sectionId}`);
    }
    /**
     * Get an array of all games information.
     * @param supportsAddons Optional parameter if only addons are displayed which support addons. Defaults to true.
     */
    async getGamesInfoList(supportsAddons) {
        let param = "game";
        if (!supportsAddons)
            param += "?false";
        return this.rawRequest("GET", param);
    }
    /**
     * Get the game info of a specific game.
     * @param gameId The id of the game you want information for.
     */
    async getGameInfo(gameId) {
        return this.rawRequest("GET", `game/${gameId}`);
    }
    /**
     * Get the UTC time when the database was last updated.
     */
    async getDatabaseTimestamp() {
        const response = await (0, node_fetch_1.default)("https://addons-ecs.forgesvc.net/api/v2/addon/timestamp", {
            method: "GET",
        });
        return new Date(await response.text());
    }
    /**
     * Get the UTC time when the minecraft versions were last updated.
     */
    async getMinecraftVersionTimestamp() {
        const response = await (0, node_fetch_1.default)("https://addons-ecs.forgesvc.net/api/v2/minecraft/version/timestamp", {
            method: "GET",
        });
        return new Date(await response.text());
    }
    /**
     * Get the UTC time when the mod loader list was last updated.
     */
    async getModLoaderTimestamp() {
        const response = await (0, node_fetch_1.default)("https://addons-ecs.forgesvc.net/api/v2/minecraft/modloader/timestamp", {
            method: "GET",
        });
        return new Date(await response.text());
    }
    /**
     * Get the UTC time when the categories were last updated.
     */
    async getCategoryTimestamp() {
        const response = await (0, node_fetch_1.default)("https://addons-ecs.forgesvc.net/api/v2/category/timestamp", {
            method: "GET",
        });
        return new Date(await response.text());
    }
    /**
     * Get the UTC time when the games were last updated.
     */
    async getGameTimestamp() {
        const response = await (0, node_fetch_1.default)("https://addons-ecs.forgesvc.net/api/v2/game/timestamp", {
            method: "GET",
        });
        return new Date(await response.text());
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                                       //
    //   METHODS FROM HERE ONWARDS UNTIL END OF CLASS CurseForge ARE NOT MEANT TO BE CALLED BY BUNDLES.      //
    //   THEY MAY GIVE MORE POSSIBILITIES BUT YOU CAN ALSO BREAK MUCH WITH IT. CALL THEM AT YOUR OWN RISK.   //
    //                                                                                                       //
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // eslint-disable-next-line
    async rawRequest(method, endpoint, data) {
        const response = await (0, node_fetch_1.default)(`https://addons-ecs.forgesvc.net/api/v2/${endpoint}`, {
            method: method,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: data === undefined ? undefined : JSON.stringify(data),
        });
        return response.json();
    }
}
exports.CurseForge = CurseForge;
/**
 * A curse addon such as a Minecraft mod.
 */
class CurseAddon {
    constructor(curse, addonId, info) {
        this.curse = curse;
        this.addonId = addonId;
        this.info = info;
    }
    /**
     * Creates an addon.
     * @param curse The CurseForge instance.
     * @param addonId The id of the addon you want to create.
     */
    static async create(curse, addonId) {
        const response = await curse.rawRequest("GET", `addon/${addonId}`);
        return new CurseAddon(curse, addonId, response);
    }
    /**
     * Get all files of the addon.
     */
    async getFiles() {
        return this.curse.rawRequest("GET", `addon/${this.addonId}/files`);
    }
    /**
     * Get the description of an CurseAddon. It's raw html or markdown as a string.
     */
    async getAddonDescription() {
        const response = await (0, node_fetch_1.default)(`https://addons-ecs.forgesvc.net/api/v2/addon/${this.addonId}/description`, {
            method: "GET",
        });
        return response.text();
    }
}
exports.CurseAddon = CurseAddon;
/**
 * A file from an addon.
 */
class CurseFile {
    constructor(addon, fileId, info) {
        this.addon = addon;
        this.fileId = fileId;
        this.info = info;
    }
    /**
     * Creates a file.
     * @param curse The CurseForge instance.
     * @param addon The parent addon of the file.
     * @param fileId The id of the specific file.
     */
    static async create(curse, addon, fileId) {
        const response = await curse.rawRequest("GET", `addon/${addon.addonId}/file/${fileId}`);
        return new CurseFile(addon, fileId, response);
    }
    /**
     * Get the download url of the file.
     */
    getDownloadUrl() {
        return this.info.downloadUrl;
    }
    /**
     * Get the changelog of a file.
     * It is raw html or markdown as a string.
     */
    async getFileChangelog() {
        const respone = await (0, node_fetch_1.default)(`https://addons-ecs.forgesvc.net/api/v2/addon/${this.addon.addonId}/file/${this.fileId}/changelog`, {
            method: "GET",
        });
        return respone.text();
    }
}
exports.CurseFile = CurseFile;
class MagicValues {
    static releaseType(value) {
        return MagicValues.mapMagicValue(value, MagicValues.RELEASE, MagicValues.RELEASE_INVERSE);
    }
    static dependencyType(value) {
        return MagicValues.mapMagicValue(value, MagicValues.DEPENDENCY, MagicValues.DEPENDENCY_INVERSE);
    }
    static fileStatus(value) {
        return MagicValues.mapMagicValue(value, MagicValues.FILE_STATUS, MagicValues.FILE_STATUS_INVERSE);
    }
    static projectStatus(value) {
        return MagicValues.mapMagicValue(value, MagicValues.PROJECT_STATUS, MagicValues.PROJECT_STATUS_INVERSE);
    }
    static mapMagicValue(value, map, inverse) {
        if (typeof value === "number") {
            return inverse[value];
        }
        else {
            return map[value];
        }
    }
    static inverse(record) {
        const inverse = {};
        for (const key in record) {
            // noinspection JSUnfilteredForInLoop
            inverse[record[key]] = key;
        }
        return inverse;
    }
}
exports.MagicValues = MagicValues;
MagicValues.RELEASE = {
    alpha: 3,
    beta: 2,
    release: 1,
};
MagicValues.RELEASE_INVERSE = MagicValues.inverse(MagicValues.RELEASE);
MagicValues.DEPENDENCY = {
    include: 6,
    incompatible: 5,
    tool: 4,
    required: 3,
    optional: 2,
    embedded_library: 1,
};
MagicValues.DEPENDENCY_INVERSE = MagicValues.inverse(MagicValues.DEPENDENCY);
MagicValues.FILE_STATUS = {
    archived: 8,
    deleted: 7,
    status_6: 6,
    rejected: 5,
    approved: 4,
    status_3: 3,
    status_2: 2,
    status_1: 1,
};
MagicValues.FILE_STATUS_INVERSE = MagicValues.inverse(MagicValues.FILE_STATUS);
MagicValues.PROJECT_STATUS = {
    deleted: 9,
    status_8: 8,
    status_7: 7,
    status_6: 6,
    status_5: 5,
    approved: 4,
    status_3: 3,
    status_2: 2,
    new: 1,
};
MagicValues.PROJECT_STATUS_INVERSE = MagicValues.inverse(MagicValues.PROJECT_STATUS);
//# sourceMappingURL=curseforgeClient.js.map