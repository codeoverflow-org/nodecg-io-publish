import { Logger } from "nodecg-io-core";
export declare class Xdotool {
    private logger;
    private readonly address;
    constructor(logger: Logger, host: string, port: number);
    testConnection(): Promise<boolean>;
    sendCommand(command: string): Promise<void>;
}
//# sourceMappingURL=xdotool.d.ts.map