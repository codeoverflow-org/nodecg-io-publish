import { ElgatoLight } from ".";
import { LightType } from "./elgatoLight";
export interface ElgatoLightConfig {
    lights: [
        {
            ipAddress: string;
            lightType: LightType;
            name?: string;
        }
    ];
}
/**
 * The elgato light client is used to access all configured elgato lights. Just use the get methods.
 */
export declare class ElgatoLightClient {
    private config;
    private lights;
    constructor(config: ElgatoLightConfig);
    private createLight;
    /**
     * Tries to reach all elgato lights contained in the config provided in the constructor.
     * @returns an array of IP addresses of elgato lights that where configured but not reachable
     */
    identifyNotReachableLights(): Promise<Array<string>>;
    /**
     * Returns all configured elgato lights.
     * @returns an array of elgato lights (elgato key lights or light stripes)
     */
    getAllLights(): ElgatoLight[];
    /**
     * Returns the specified elgato light (elgato key light or light stripe)
     * @param name the name of the elgato light specified in the nodecg-io config
     * @returns the specified elgato light instance or undefined if the name was not found
     */
    getLightByName(name: string): ElgatoLight | undefined;
    /**
     * Returns the specified elgato light (elgato key light or light stripe)
     * @param ipAddress the ip address of the elgato light as specified in the nodecg-io config
     * @returns the specified elgato light instance or undefined if the address was not found
     */
    getLightByAddress(ipAddress: string): ElgatoLight | undefined;
}
//# sourceMappingURL=elgatoLightClient.d.ts.map