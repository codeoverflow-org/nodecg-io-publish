/// <reference types="node" />
import { EventEmitter } from "events";
import { ObjectMap, ServiceInstance, ServiceDependency, Service } from "nodecg-io-core/extension/service";
import { PasswordMessage } from "nodecg-io-core/extension/messageManager";
/**
 * Layer between the actual dashboard and PersistentData.
 * a. the naming of bundleDependencies in the context of the dashboard is too long and
 *    I don't want to change the format of the serialized data.
 * b. having everything at hand using one variable is quite nice so I've added services here to complete it.
 */
interface ConfigData {
    instances: ObjectMap<ServiceInstance<unknown, unknown>>;
    bundles: ObjectMap<ServiceDependency<unknown>[]>;
    services: Service<unknown, never>[];
}
/**
 * Config and the config variable give other components access to the decrypted data.
 * It can be used to get the raw value or to register a handler.
 */
declare class Config extends EventEmitter {
    data: ConfigData | undefined;
    constructor();
    onChange(handler: (data: ConfigData) => void): void;
}
export declare const config: Config;
/**
 * Sets the passed password to be used by the crypto module.
 * Will try to decrypt decrypted data to tell whether the password is correct,
 * if it is wrong the internal password will be set to undefined.
 * Returns whether the password is correct.
 * @param pw the password which should be set.
 */
export declare function setPassword(pw: string): Promise<boolean>;
export declare function sendAuthenticatedMessage<V>(messageName: string, message: Partial<PasswordMessage>): Promise<V>;
/**
 * Returns whether a password has been set in the crypto module aka. whether is is authenticated.
 */
export declare function isPasswordSet(): boolean;
export {};
//# sourceMappingURL=crypto.d.ts.map