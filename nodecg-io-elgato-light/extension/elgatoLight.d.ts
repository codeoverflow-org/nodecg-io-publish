import { LightData, LightValues } from "./lightData";
import { Response } from "node-fetch";
export type LightType = "KeyLight" | "LightStrip";
/**
 * Represents an elgato light. Is never directly created but has subclasses for the different light types.
 */
export declare abstract class ElgatoLight {
    readonly ipAddress: string;
    readonly name?: string | undefined;
    constructor(ipAddress: string, name?: string | undefined);
    /**
     * Tests if the elgato light is reachable.
     * @returns true if the test call returned success. false, otherwise
     */
    validate(): Promise<boolean>;
    private buildPath;
    private callGET;
    /**
     * Helper method to call HTTP PUT on the elgato light.
     * @param body json data to send to the elgato light
     * @returns the response of the elgato light
     */
    protected callPUT(body: LightData): Promise<Response>;
    /**
     * Helper method to call HTTP GET on the elgato light and ease the interpretation of the response.
     * @returns the response of the elgato light or undefined
     */
    protected getLightData(): Promise<LightValues | undefined>;
    /**
     *
     * @returns Returns true if the light is switched on.
     */
    isLightOn(): Promise<boolean>;
    /**
     * Switches the elgato light on.
     */
    turnLightOn(): Promise<void>;
    /**
     * Switches the elgato light off.
     */
    turnLightOff(): Promise<void>;
    /**
     * Toggles the on/off state of the elgato light.
     */
    toggleLight(): Promise<void>;
    /**
     * Sets the brightness of the elgato light.
     * @param brightness a value between 0.0 and 100.0
     */
    setBrightness(brightness: number): Promise<void>;
    /**
     * Returns the brightness of the elgato light.
     * @returns a value between 0.0 and 100.0 or -1 if an error occurred
     */
    getBrightness(): Promise<number>;
    protected static createLightData(data: LightValues): LightData;
}
/**
 * Represents an elgato key light, e.g., the key light or key light air.
 */
export declare class ElgatoKeyLight extends ElgatoLight {
    private static readonly temperatureFactor;
    /**
     * Sets the temperature of the elgato key light.
     * @param temperature a value between 2900 and 7000 kelvin
     */
    setTemperature(temperature: number): Promise<void>;
    /**
     * Returns the temperature of the elgato key light.
     * @returns a value between 2900 and 7000 or -1 if an error occurred
     */
    getTemperature(): Promise<number>;
}
/**
 * Represents an elgato light stripe of any length.
 */
export declare class ElgatoLightStrip extends ElgatoLight {
    /**
     * Sets the hue of the elgato light stripe.
     * @param hue a value between 0.0 and 360.0
     */
    setHue(hue: number): Promise<void>;
    /**
     * Returns the hue of the elgato light stripe.
     * @returns a value between 0.0 and 360.0 or -1 if an error occurred
     */
    getHue(): Promise<number>;
    /**
     * Sets the saturation of the elgato light stripe.
     * @param saturation a value between 0.0 and 100.0
     */
    setSaturation(saturation: number): Promise<void>;
    /**
     * Returns the saturation of the elgato light stripe.
     * @returns a value between 0.0 and 100.0 or -1 if an error occurred
     */
    getSaturation(): Promise<number>;
}
//# sourceMappingURL=elgatoLight.d.ts.map