"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElgatoLightClient = void 0;
const elgatoLight_1 = require("./elgatoLight");
/**
 * The elgato light client is used to access all configured elgato lights. Just use the get methods.
 */
class ElgatoLightClient {
    constructor(config) {
        this.config = config;
        this.lights = [];
        this.lights = this.config.lights.map((light) => this.createLight(light.ipAddress, light.lightType, light.name));
    }
    createLight(ipAddress, lightType, name) {
        if (lightType === "KeyLight") {
            return new elgatoLight_1.ElgatoKeyLight(ipAddress, name);
        }
        else {
            return new elgatoLight_1.ElgatoLightStrip(ipAddress, name);
        }
    }
    /**
     * Tries to reach all elgato lights contained in the config provided in the constructor.
     * @returns an array of IP addresses of elgato lights that where configured but not reachable
     */
    async identifyNotReachableLights() {
        const notReachableLights = [];
        for (const light of this.lights) {
            if (!(await light.validate())) {
                notReachableLights.push(light.ipAddress);
            }
        }
        return notReachableLights;
    }
    /**
     * Returns all configured elgato lights.
     * @returns an array of elgato lights (elgato key lights or light stripes)
     */
    getAllLights() {
        return [...this.lights];
    }
    /**
     * Returns the specified elgato light (elgato key light or light stripe)
     * @param name the name of the elgato light specified in the nodecg-io config
     * @returns the specified elgato light instance or undefined if the name was not found
     */
    getLightByName(name) {
        return this.lights.find((light) => light.name === name);
    }
    /**
     * Returns the specified elgato light (elgato key light or light stripe)
     * @param ipAddress the ip address of the elgato light as specified in the nodecg-io config
     * @returns the specified elgato light instance or undefined if the address was not found
     */
    getLightByAddress(ipAddress) {
        return this.lights.find((light) => light.ipAddress === ipAddress);
    }
}
exports.ElgatoLightClient = ElgatoLightClient;
//# sourceMappingURL=elgatoLightClient.js.map