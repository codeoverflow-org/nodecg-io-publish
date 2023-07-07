import NodeCG from "@nodecg/types";
import { InstanceManager } from "./instanceManager";
import { BundleManager } from "./bundleManager";
import { PersistenceManager } from "./persistenceManager";
import { ServiceManager } from "./serviceManager";
export interface AuthenticationMessage {
    encryptionKey: string;
}
export interface UpdateInstanceConfigMessage extends AuthenticationMessage {
    instanceName: string;
    config: unknown;
}
export interface CreateServiceInstanceMessage extends AuthenticationMessage {
    serviceType: string;
    instanceName: string;
}
export interface DeleteServiceInstanceMessage extends AuthenticationMessage {
    instanceName: string;
}
export interface SetServiceDependencyMessage extends AuthenticationMessage {
    bundleName: string;
    instanceName: string | undefined;
    serviceType: string;
}
/**
 * MessageManager manages communication with the GUI and handles NodeCG messages to control the framework.
 * Also adds a small wrapper around the actual functions them to make some things easier.
 */
export declare class MessageManager {
    private nodecg;
    private services;
    private instances;
    private bundles;
    private persist;
    constructor(nodecg: NodeCG.ServerAPI, services: ServiceManager, instances: InstanceManager, bundles: BundleManager, persist: PersistenceManager);
    registerMessageHandlers(): void;
    private listen;
    private listenWithAuth;
}
//# sourceMappingURL=messageManager.d.ts.map