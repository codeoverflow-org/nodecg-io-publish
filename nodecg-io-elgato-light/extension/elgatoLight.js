"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElgatoLightStrip = exports.ElgatoKeyLight = exports.ElgatoLight = void 0;
const tslib_1 = require("tslib");
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
/**
 * Represents an elgato light. Is never directly created but has subclasses for the different light types.
 */
class ElgatoLight {
    constructor(ipAddress, name) {
        this.ipAddress = ipAddress;
        this.name = name;
    }
    /**
     * Tests if the elgato light is reachable.
     * @returns true if the test call returned success. false, otherwise
     */
    async validate() {
        const response = await this.callGET();
        return response.status === 200;
    }
    buildPath() {
        return `http://${this.ipAddress}:9123/elgato/lights`;
    }
    async callGET() {
        return (0, node_fetch_1.default)(this.buildPath(), {
            method: "GET",
        });
    }
    /**
     * Helper method to call HTTP PUT on the elgato light.
     * @param body json data to send to the elgato light
     * @returns the response of the elgato light
     */
    async callPUT(body) {
        return (0, node_fetch_1.default)(this.buildPath(), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
    }
    /**
     * Helper method to call HTTP GET on the elgato light and ease the interpretation of the response.
     * @returns the response of the elgato light or undefined
     */
    async getLightData() {
        const response = await this.callGET();
        if (response.status !== 200) {
            return undefined;
        }
        return (await response.json()).lights[0];
    }
    /**
     *
     * @returns Returns true if the light is switched on.
     */
    async isLightOn() {
        var _a;
        return ((_a = (await this.getLightData())) === null || _a === void 0 ? void 0 : _a.on) === 1;
    }
    /**
     * Switches the elgato light on.
     */
    async turnLightOn() {
        const lightData = ElgatoLight.createLightData({ on: 1 });
        await this.callPUT(lightData);
    }
    /**
     * Switches the elgato light off.
     */
    async turnLightOff() {
        const lightData = ElgatoLight.createLightData({ on: 0 });
        await this.callPUT(lightData);
    }
    /**
     * Toggles the on/off state of the elgato light.
     */
    async toggleLight() {
        const state = await this.isLightOn();
        const lightData = ElgatoLight.createLightData({ on: state ? 0 : 1 });
        await this.callPUT(lightData);
    }
    /**
     * Sets the brightness of the elgato light.
     * @param brightness a value between 0.0 and 100.0
     */
    async setBrightness(brightness) {
        const sanitizedValue = Math.max(0, Math.min(100, brightness));
        const lightData = ElgatoLight.createLightData({ brightness: sanitizedValue });
        await this.callPUT(lightData);
    }
    /**
     * Returns the brightness of the elgato light.
     * @returns a value between 0.0 and 100.0 or -1 if an error occurred
     */
    async getBrightness() {
        var _a, _b;
        return (_b = (_a = (await this.getLightData())) === null || _a === void 0 ? void 0 : _a.brightness) !== null && _b !== void 0 ? _b : -1;
    }
    static createLightData(data) {
        return {
            numberOfLights: 1,
            lights: [data],
        };
    }
}
exports.ElgatoLight = ElgatoLight;
/**
 * Represents an elgato key light, e.g., the key light or key light air.
 */
class ElgatoKeyLight extends ElgatoLight {
    /**
     * Sets the temperature of the elgato key light.
     * @param temperature a value between 2900 and 7000 kelvin
     */
    async setTemperature(temperature) {
        const sanitizedValue = Math.max(143, Math.min(344, ElgatoKeyLight.temperatureFactor / temperature));
        const lightData = ElgatoLight.createLightData({ temperature: sanitizedValue });
        await this.callPUT(lightData);
    }
    /**
     * Returns the temperature of the elgato key light.
     * @returns a value between 2900 and 7000 or -1 if an error occurred
     */
    async getTemperature() {
        var _a;
        const temperature = (_a = (await this.getLightData())) === null || _a === void 0 ? void 0 : _a.temperature;
        if (temperature !== undefined) {
            return ElgatoKeyLight.temperatureFactor / temperature;
        }
        else {
            return -1;
        }
    }
}
exports.ElgatoKeyLight = ElgatoKeyLight;
ElgatoKeyLight.temperatureFactor = 1000000;
/**
 * Represents an elgato light stripe of any length.
 */
class ElgatoLightStrip extends ElgatoLight {
    /**
     * Sets the hue of the elgato light stripe.
     * @param hue a value between 0.0 and 360.0
     */
    async setHue(hue) {
        const sanitizedValue = Math.max(0, Math.min(360, hue));
        const lightData = ElgatoLight.createLightData({ hue: sanitizedValue });
        await this.callPUT(lightData);
    }
    /**
     * Returns the hue of the elgato light stripe.
     * @returns a value between 0.0 and 360.0 or -1 if an error occurred
     */
    async getHue() {
        var _a, _b;
        return (_b = (_a = (await this.getLightData())) === null || _a === void 0 ? void 0 : _a.hue) !== null && _b !== void 0 ? _b : -1;
    }
    /**
     * Sets the saturation of the elgato light stripe.
     * @param saturation a value between 0.0 and 100.0
     */
    async setSaturation(saturation) {
        const sanitizedValue = Math.max(0, Math.min(100, saturation));
        const lightData = ElgatoLight.createLightData({ saturation: sanitizedValue });
        await this.callPUT(lightData);
    }
    /**
     * Returns the saturation of the elgato light stripe.
     * @returns a value between 0.0 and 100.0 or -1 if an error occurred
     */
    async getSaturation() {
        var _a, _b;
        return (_b = (_a = (await this.getLightData())) === null || _a === void 0 ? void 0 : _a.saturation) !== null && _b !== void 0 ? _b : -1;
    }
}
exports.ElgatoLightStrip = ElgatoLightStrip;
//# sourceMappingURL=elgatoLight.js.map