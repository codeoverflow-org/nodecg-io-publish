import { NodeCG } from "nodecg-types/types/server";
import { InstanceManager } from "./instanceManager";
import { BundleManager } from "./bundleManager";
import { PersistenceManager } from "./persistenceManager";
import { ServiceManager } from "./serviceManager";
export interface PasswordMessage {
    password: string;
}
export interface UpdateInstanceConfigMessage extends PasswordMessage {
    instanceName: string;
    config: unknown;
}
export interface CreateServiceInstanceMessage extends PasswordMessage {
    serviceType: string;
    instanceName: string;
}
export interface DeleteServiceInstanceMessage extends PasswordMessage {
    instanceName: string;
}
export interface SetServiceDependencyMessage extends PasswordMessage {
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
    constructor(nodecg: NodeCG, services: ServiceManager, instances: InstanceManager, bundles: BundleManager, persist: PersistenceManager);
    registerMessageHandlers(): void;
    private listen;
    private listenWithAuth;
}
//# sourceMappingURL=messageManager.d.ts.map