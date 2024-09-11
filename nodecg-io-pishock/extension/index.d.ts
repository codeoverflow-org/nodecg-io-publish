import { PiShockDevice, PiShockAuthentication } from "pishock-ts";
export interface PiShockConfig {
    authentications: Array<PiShockAuthentication>;
}
export interface PiShockClient {
    connectedDevices: Array<PiShockDevice>;
}
//# sourceMappingURL=index.d.ts.map