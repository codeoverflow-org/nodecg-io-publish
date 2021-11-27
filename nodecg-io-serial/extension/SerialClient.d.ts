import { Result } from "nodecg-io-core";
import SerialPort from "serialport";
export interface DeviceInfo {
    port?: string;
    manufacturer?: string;
    serialNumber?: string;
    pnpId?: string;
}
interface Protocol {
    delimiter: "\n\r" | "\n";
    encoding?: "ascii" | "utf8" | "utf16le" | "ucs2" | "base64" | "binary" | "hex";
}
export interface SerialServiceConfig {
    device: DeviceInfo;
    connection: SerialPort.OpenOptions;
    protocol: Protocol;
}
export declare class SerialServiceClient extends SerialPort {
    private parser;
    constructor(path: string, protocol: Protocol, options?: SerialPort.OpenOptions, callback?: SerialPort.ErrorCallback);
    static createClient(config: SerialServiceConfig): Promise<Result<SerialServiceClient>>;
    static inferPort(deviceInfo: DeviceInfo): Promise<Result<string>>;
    static getConnectedDevices(): Promise<Array<SerialServiceConfig>>;
    send(payload: string): Promise<Result<void>>;
    onData(callback: (data: any) => void): void;
    removeAllParserListeners(): void;
}
export {};
//# sourceMappingURL=SerialClient.d.ts.map