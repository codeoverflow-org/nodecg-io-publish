import { Logger } from "nodecg-io-core";
export declare class AHK {
    private logger;
    private readonly address;
    constructor(logger: Logger, host: string, port: number);
    testConnection(): Promise<boolean>;
    sendCommand(command: string): Promise<void>;
}
//# sourceMappingURL=AHK.d.ts.map