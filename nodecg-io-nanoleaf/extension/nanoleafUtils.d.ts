import NodeCG from "@nodecg/types";
import { Color } from "./interfaces";
/**
 * This class contains static helper methods, mostly used to verify the connection to your nanoleafs.
 */
export declare class NanoleafUtils {
    /**
     * This port seems to be default for all nanoleaf controllers
     */
    static readonly defaultPort = 16021;
    /**
     * Checks whether the provided ip address returns anything other than 404.
     * @param ipAddress the ip address to test
     */
    static verifyIpAddress(ipAddress: string): Promise<boolean>;
    /**
     * Checks whether the provided auth token is valid based on the provided ip address.
     * @param ipAddress the ip address of the nanoleaf controller
     * @param authToken an auth token, lol
     */
    static verifyAuthKey(ipAddress: string, authToken: string): Promise<boolean>;
    static buildBaseRequestAddress(ipAddress: string, authToken: string): string;
    /**
     * Tries to retrieve an auth key / token from the nanoleaf controller. Fails if the controller is not in pairing mode.
     * @param ipAddress the ip address of the nanoleaf controller
     * @param nodecg the current nodecg instance
     */
    static retrieveAuthKey(ipAddress: string, nodecg: NodeCG.ServerAPI): Promise<string>;
    private static checkConnection;
    /**
     * Converts the specified color from the HSV (Hue-Saturation-Value) color space to the RGB (Red-Green-Blue) color space.
     * @param color a color in the HSV color space
     */
    static convertHSVtoRGB(color: {
        hue: number;
        saturation: number;
        value: number;
    }): Color;
}
//# sourceMappingURL=nanoleafUtils.d.ts.map