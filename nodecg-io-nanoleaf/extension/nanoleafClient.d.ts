import { Response } from "node-fetch";
import { Color, ColoredPanel, PanelEffect } from "./interfaces";
import { NanoleafQueue } from "./nanoleafQueue";
export declare class NanoleafClient {
    private ipAddress;
    private authToken;
    private colors;
    private queue;
    /**
     * Returns the client-specific effect queue.
     */
    getQueue(): NanoleafQueue;
    constructor(ipAddress: string, authToken: string);
    private callGET;
    private callPUT;
    /**
     * Returns information about all panels, e.g. available effects, position data, ...
     */
    getAllPanelInfo(): Promise<Response>;
    /**
     * Returns the IDs of all panels which are connected to the nanoleaf controller
     * @param sortedByY the IDs are sorted by y level if true, otherwise sorted by x level
     */
    getAllPanelIDs(sortedByY: boolean): Promise<Array<number>>;
    /**
     * Sets the color of the specified panel directly using a raw effect write call. Not compatible with global effects.
     * @param panelId the panel ID. Use getAllPanelIDs() to retrieve all possible IDs.
     * @param color the color to send
     */
    setPanelColor(panelId: number, color: Color): Promise<void>;
    /**
     * Sets the colors of all specified panels directly using a raw effect write call.
     * @param data An array of ColoredPanel objects which hold information about panel IDs and colors.
     */
    setPanelColors(data: ColoredPanel[]): Promise<void>;
    /**
     * This bad boy function does more than every nanoleaf documentaion ever delivered. This is the pure decoding of awesomeness.
     * The raw effect write call is used to generate custom effects at runtime. Everything you ever dreamed of is possible.
     * @param command 'add' overlays the effect, 'display' overwrites the effect, 'displayTemp' overrides for a specified duration
     * @param animType 'static' for single colors, 'custom' for advanced animations
     * @param loop 'true' if the effect shall be looped after every frame was played
     * @param panelData an array of PanelEffect objects consisting of a panel id and an array of frames
     * @param duration optional, only used if command is set to 'displayTemp'
     */
    writeRawEffect(command: "add" | "display" | "displayTemp", animType: "static" | "custom", loop: boolean, panelData: PanelEffect[], duration?: number): Promise<void>;
    private mapPanelEffectToAnimData;
    private mapFrameToAnimData;
    /**
     * Returns the cached color of the specified panel. Please note, this returns only colors which have been set by using setPanelColor(s).
     * @param panelId a valid panel id
     */
    getPanelColor(panelId: number): Color;
    /**
     * Returns the cached color of all panels. Please note, this returns only colors which have been set by using setPanelColor(s).
     */
    getAllPanelColors(): Map<number, Color>;
    /**
     * Sets the brightness of all panels.
     * @param level a number between 0 - 100
     */
    setBrightness(level: number): Promise<void>;
    /**
     * Sets the state of all panels.
     * @param on true, if the nanoleaf shall shine. false, if you're sad and boring
     */
    setState(on: boolean): Promise<void>;
    /**
     * Sets the hue of all panels.
     * @param hue a number between 0 - 360
     */
    setHue(hue: number): Promise<void>;
    /**
     * Sets the saturation of all panels.
     * @param sat a number between 0 - 100
     */
    setSaturation(sat: number): Promise<void>;
    /**
     * Sets the color temperature of all panels.
     * @param temperature a number between 1200 - 6500
     */
    setColorTemperature(temperature: number): Promise<void>;
}
//# sourceMappingURL=nanoleafClient.d.ts.map