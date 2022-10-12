import { GoogleCastConfig } from "./index";
import Device from "chromecast-api/lib/device";
export declare class GoogleCastClient extends Device {
    static createClient(config: GoogleCastConfig): Promise<GoogleCastClient>;
}
//# sourceMappingURL=castClient.d.ts.map