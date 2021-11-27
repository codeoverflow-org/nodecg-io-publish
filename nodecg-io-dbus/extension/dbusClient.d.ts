import { DBusConfig } from "./index";
import { MessageBus, ProxyObject, Variant } from "dbus-next";
export declare class DBusClient {
    readonly session: MessageBus;
    readonly system: MessageBus;
    constructor(config: DBusConfig);
    proxy<T>(config: DBusProxyConfig<T>): Promise<T>;
    static createClient(config: DBusConfig): DBusClient;
}
export interface DBusProxyConfig<T> {
    iface: string;
    path: string;
    system: boolean;
    create(client: DBusClient, proxy: ProxyObject): T;
}
export declare class DBusObject {
    protected readonly client: DBusClient;
    protected readonly proxy: ProxyObject;
    private readonly properties;
    protected constructor(client: DBusClient, proxy: ProxyObject);
    getProperty(iface: string, name: string): Promise<Variant>;
    setProperty(iface: string, name: string, value: Variant): Promise<void>;
}
//# sourceMappingURL=dbusClient.d.ts.map