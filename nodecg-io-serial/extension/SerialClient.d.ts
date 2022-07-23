import { Result } from "nodecg-io-core";
import { SerialPort, SerialPortOpenOptions, ReadlineOptions } from "serialport";
import { ErrorCallback } from "@serialport/stream";
import { AutoDetectTypes } from "@serialport/bindings-cpp";
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
    connection: Partial<SerialPortOpenOptions<AutoDetectTypes>>;
    protocol: Protocol;
}
export declare class SerialServiceClient extends SerialPort {
    private parser;
    constructor(options: SerialPortOpenOptions<AutoDetectTypes>, protocol?: ReadlineOptions, callback?: ErrorCallback);
    static createClient(config: SerialServiceConfig): Promise<Result<SerialServiceClient>>;
    static inferPort(deviceInfo: DeviceInfo): Promise<Result<string>>;
    static getConnectedDevices(): Promise<Array<SerialServiceConfig>>;
    send(payload: string): Promise<Result<void>>;
    onData(callback: (data: any) => void): void;
    removeAllParserListeners(): void;
}
export {};
//# sourceMappingURL=SerialClient.d.ts.map