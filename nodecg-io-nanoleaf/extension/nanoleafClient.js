"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NanoleafClient = void 0;
const tslib_1 = require("tslib");
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
const nanoleafQueue_1 = require("./nanoleafQueue");
const nanoleafUtils_1 = require("./nanoleafUtils");
class NanoleafClient {
    /**
     * Returns the client-specific effect queue.
     */
    getQueue() {
        return this.queue;
    }
    constructor(ipAddress, authToken) {
        this.ipAddress = ipAddress;
        this.authToken = authToken;
        // Important: Does only remember colors which were directly set by using setPanelColor(s)
        this.colors = new Map();
        // This queue is used to queue effects
        this.queue = new nanoleafQueue_1.NanoleafQueue();
    }
    async callGET(relativePath) {
        return (0, node_fetch_1.default)(nanoleafUtils_1.NanoleafUtils.buildBaseRequestAddress(this.ipAddress, this.authToken) + relativePath, {
            method: "GET",
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async callPUT(relativePath, body) {
        return (0, node_fetch_1.default)(nanoleafUtils_1.NanoleafUtils.buildBaseRequestAddress(this.ipAddress, this.authToken) + relativePath, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
    }
    /**
     * Returns information about all panels, e.g. available effects, position data, ...
     */
    async getAllPanelInfo() {
        return this.callGET("");
    }
    /**
     * Returns the IDs of all panels which are connected to the nanoleaf controller
     * @param sortedByY the IDs are sorted by y level if true, otherwise sorted by x level
     */
    async getAllPanelIDs(sortedByY) {
        var _a, _b;
        const response = await this.getAllPanelInfo();
        if (response.status !== 200) {
            return [];
        }
        const json = await response.json();
        const positionData = (_b = (_a = json.panelLayout) === null || _a === void 0 ? void 0 : _a.layout) === null || _b === void 0 ? void 0 : _b.positionData;
        const panels = sortedByY ? positionData.sort((a, b) => a.y - b.y) : positionData.sort((a, b) => a.x - b.x);
        const panelIDs = panels === null || panels === void 0 ? void 0 : panels.map((entry) => entry.panelId);
        const panelIDsWithoutController = panelIDs.filter((entry) => entry !== 0);
        return panelIDsWithoutController;
    }
    /**
     * Sets the color of the specified panel directly using a raw effect write call. Not compatible with global effects.
     * @param panelId the panel ID. Use getAllPanelIDs() to retrieve all possible IDs.
     * @param color the color to send
     */
    async setPanelColor(panelId, color) {
        await this.setPanelColors([{ panelId: panelId, color: color }]);
    }
    /**
     * Sets the colors of all specified panels directly using a raw effect write call.
     * @param data An array of ColoredPanel objects which hold information about panel IDs and colors.
     */
    async setPanelColors(data) {
        data.forEach((panel) => this.colors.set(panel.panelId, panel.color));
        if (data.length >= 1) {
            // This creates an simple short transition effect to the specified colors
            const panelData = data.map((entry) => ({
                panelId: entry.panelId,
                frames: [{ color: entry.color, transitionTime: 1 }],
            }));
            await this.writeRawEffect("display", "static", false, panelData);
        }
    }
    /**
     * This bad boy function does more than every nanoleaf documentaion ever delivered. This is the pure decoding of awesomeness.
     * The raw effect write call is used to generate custom effects at runtime. Everything you ever dreamed of is possible.
     * @param command 'add' overlays the effect, 'display' overwrites the effect, 'displayTemp' overrides for a specified duration
     * @param animType 'static' for single colors, 'custom' for advanced animations
     * @param loop 'true' if the effect shall be looped after every frame was played
     * @param panelData an array of PanelEffect objects consisting of a panel id and an array of frames
     * @param duration optional, only used if command is set to 'displayTemp'
     */
    async writeRawEffect(command, animType, loop, panelData, duration = 0) {
        if (panelData.every((panel) => panel.frames.length >= 1)) {
            // Create animData by mapping the PanelEffect objects to a data stream which is compliant to the nanoleaf documentation §3.2.6.1.
            const animData = `${panelData.length}` + panelData.map((entry) => this.mapPanelEffectToAnimData(entry)).join("");
            const json = {
                write: {
                    command: command,
                    duration: duration,
                    animType: animType,
                    animData: animData,
                    loop: loop,
                    palette: [],
                },
            };
            await this.callPUT("/effects", json);
        }
    }
    mapPanelEffectToAnimData(panelEffect) {
        return ` ${panelEffect.panelId} ${panelEffect.frames.length}${panelEffect.frames
            .map((frame) => this.mapFrameToAnimData(frame.color, frame.transitionTime))
            .join("")}`;
    }
    mapFrameToAnimData(color, transitionTime) {
        return ` ${color.red} ${color.green} ${color.blue} 0 ${transitionTime}`;
    }
    /**
     * Returns the cached color of the specified panel. Please note, this returns only colors which have been set by using setPanelColor(s).
     * @param panelId a valid panel id
     */
    getPanelColor(panelId) {
        return this.colors.get(panelId) || { red: 0, blue: 0, green: 0 };
    }
    /**
     * Returns the cached color of all panels. Please note, this returns only colors which have been set by using setPanelColor(s).
     */
    getAllPanelColors() {
        return this.colors;
    }
    /**
     * Sets the brightness of all panels.
     * @param level a number between 0 - 100
     */
    async setBrightness(level) {
        const data = { brightness: { value: level } };
        await this.callPUT("/state", data);
    }
    /**
     * Sets the state of all panels.
     * @param on true, if the nanoleaf shall shine. false, if you're sad and boring
     */
    async setState(on) {
        const data = { on: { value: on } };
        await this.callPUT("/state", data);
    }
    /**
     * Sets the hue of all panels.
     * @param hue a number between 0 - 360
     */
    async setHue(hue) {
        const data = { hue: { value: hue } };
        await this.callPUT("/state", data);
    }
    /**
     * Sets the saturation of all panels.
     * @param sat a number between 0 - 100
     */
    async setSaturation(sat) {
        const data = { sat: { value: sat } };
        await this.callPUT("/state", data);
    }
    /**
     * Sets the color temperature of all panels.
     * @param temperature a number between 1200 - 6500
     */
    async setColorTemperature(temperature) {
        const data = { ct: { value: temperature } };
        await this.callPUT("/state", data);
    }
}
exports.NanoleafClient = NanoleafClient;
//# sourceMappingURL=nanoleafClient.js.map