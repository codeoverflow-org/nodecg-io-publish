/// <reference types="node" />
import { MqttClient } from "mqtt";
export declare class MQTTClientServiceClient {
    client: MqttClient;
    once: (event: string, cb: () => void) => void;
    close: () => void;
    on: (event: string, cb: () => void) => void;
    off: (event: string | symbol, listener: (...args: unknown[]) => void) => void;
    connect(url: string, username: string | undefined, password: string | undefined): Promise<void>;
    subscribe(topics: string[]): void;
    onClose(func: () => void): MqttClient;
    onMessage(func: (topic: string, message: Buffer) => void): MqttClient;
    onError(func: (error: Error) => void): MqttClient;
}
//# sourceMappingURL=index.d.ts.map