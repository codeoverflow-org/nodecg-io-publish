import { ArtNetController } from "artnet-protocol/dist";
import { ArtDmx } from "artnet-protocol/dist/protocol";
import { ArtNetServiceConfig } from "./index";
export declare class ArtNetServiceClient extends ArtNetController {
    constructor(config: ArtNetServiceConfig);
    /**
     * Little simplification to receive `dmx` data.
     */
    onDMX(listener: (packet: ArtDmx) => void): ArtNetServiceClient;
    /**
     * Little simplification to send `dmx` data.
     */
    send(universe: number, data: number[]): void;
}
//# sourceMappingURL=artnetServiceClient.d.ts.map