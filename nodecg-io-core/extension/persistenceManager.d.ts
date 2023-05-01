import NodeCG from "@nodecg/types";
import { InstanceManager } from "./instanceManager";
import { BundleManager } from "./bundleManager";
import { Result } from "./utils/result";
import { ObjectMap, ServiceDependency, ServiceInstance } from "./service";
import { ServiceManager } from "./serviceManager";
import { NodeCGBundleConfig } from ".";
/**
 * Models all the data that needs to be persistent in a plain manner.
 */
export interface PersistentData {
    /**
     * All instance data that is held by the {@link InstanceManager}.
     */
    instances: ObjectMap<ServiceInstance<unknown, unknown>>;
    /**
     * All bundle dependency data that is held by the {@link BundleManager}.
     */
    bundleDependencies: ObjectMap<ServiceDependency<unknown>[]>;
}
/**
 * Models all the data that needs to be persistent in an encrypted manner.
 */
export interface EncryptedData {
    /**
     * The encrypted format of the data that needs to be stored.
     */
    cipherText?: string;
}
/**
 * Decrypts the passed encrypted data using the passed password.
 * If the password is wrong, an error will be returned.
 *
 * @param cipherText the ciphertext that needs to be decrypted.
 * @param password the password for the encrypted data.
 */
export declare function decryptData(cipherText: string, password: string): Result<PersistentData>;
/**
 * Manages encrypted persistence of data that is held by the instance and bundle managers.
 */
export declare class PersistenceManager {
    private readonly nodecg;
    private readonly services;
    private readonly instances;
    private readonly bundles;
    private password;
    private encryptedData;
    constructor(nodecg: NodeCG.ServerAPI<NodeCGBundleConfig>, services: ServiceManager, instances: InstanceManager, bundles: BundleManager);
    /**
     * Checks whether the passed password is correct. Only works if already loaded and a password is already set.
     * @param password the password which should be checked for correctness
     */
    checkPassword(password: string): boolean;
    /**
     * Returns if the locally stored configuration has been loaded and a password has been set.
     */
    isLoaded(): boolean;
    /**
     * Returns whether this is the first startup aka. whether any encrypted data has been saved.
     * If this returns true {{@link load}} will accept any password and use it to encrypt the configuration.
     */
    isFirstStartup(): boolean;
    /**
     * Decrypts and loads the locally stored configuration using the passed password.
     * @param password the password of the encrypted config.
     * @return success if the password was correct and loading has been successful and an error if the password is wrong.
     */
    load(password: string): Promise<Result<void>>;
    /**
     * Loads all passed instances into the framework by creating instances of the same type and name
     * and then setting the config of the passed object.
     * @param instances the service instances that should be loaded.
     */
    private loadServiceInstances;
    /**
     * Loads all passed bundle dependencies into the framework by setting them in the bundle manager.
     * @param bundles the bundle dependencies that should be set.
     */
    private loadBundleDependencies;
    /**
     * Encrypts and saves current state to the persistent replicant.
     */
    save(): void;
    /**
     * Creates a copy of all service instances without the service clients, because those
     * shouldn't be serialized and don't need to be stored in the encrypted config file.
     */
    private getServiceInstances;
    /**
     * Saves the current configuration after all service instances have loaded.
     * @param promises the promises of the service instances
     */
    private saveAfterServiceInstancesLoaded;
    /**
     * Checks whether automatic login is set up and enabled. If yes, it will do it using {@link PersistenceManager.setupAutomaticLogin}.
     */
    private checkAutomaticLogin;
    /**
     * Setups everything needed to automatically log in using the provided password after NodeCG has loaded.
     */
    private setupAutomaticLogin;
}
//# sourceMappingURL=persistenceManager.d.ts.map