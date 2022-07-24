import { NodeCG } from "nodecg-types/types/server";
import { InstanceManager } from "./instanceManager";
import { BundleManager } from "./bundleManager";
import crypto from "crypto-js";
import { Result } from "./utils/result";
import { ObjectMap, ServiceDependency, ServiceInstance } from "./service";
import { ServiceManager } from "./serviceManager";
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
 *
 * For nodecg-io <= 0.2 configurations only the ciphertext value may be set
 * containing the encrypted data, iv and salt in the crypto.js format.
 * Salt and iv are managed by crypto.js and all AES defaults with a password are used (PBKDF1 using 1 MD5 iteration).
 * All this happens in the nodecg-io-core extension and the password is sent using NodeCG Messages.
 *
 * For nodecg-io >= 0.3 this was changed. PBKDF2 using SHA256 is directly run inside the browser when logging in.
 * Only the derived AES encryption key is sent to the extension using NodeCG messages.
 * That way analyzed network traffic and malicious bundles that listen for the same NodeCG message only allow getting
 * the encryption key and not the plain text password that may be used somewhere else.
 *
 * Still with this security upgrade you should only use trusted bundles with your NodeCG installation
 * and use https if your using the dashboard over a untrusted network.
 *
 */
export interface EncryptedData {
    /**
     * The encrypted format of the data that needs to be stored.
     */
    cipherText?: string;
    /**
     * The salt that is used when deriving the encryption key from the password.
     * Only set for new format with nodecg-io >=0.3.
     */
    salt?: string;
    /**
     * The initialization vector used for encryption.
     * Only set for new format with nodecg-io >=0.3.
     */
    iv?: string;
}
/**
 * Decrypts the passed encrypted data using the passed encryption key.
 * If the encryption key is wrong, an error will be returned.
 *
 * This function supports the <=0.2 format with the plain password as an
 * encryption key and no iv (read from ciphertext) and the >=0.3 format with the iv and derived key.
 *
 * @param cipherText the ciphertext that needs to be decrypted.
 * @param encryptionKey the encryption key for the encrypted data.
 * @param iv the initialization vector for the encrypted data.
 */
export declare function decryptData(cipherText: string, encryptionKey: string | crypto.lib.WordArray, iv: string | undefined): Result<PersistentData>;
/**
 * Encrypts the passed data object using the passed encryption key.
 *
 * @param data the data that needs to be encrypted.
 * @param encryptionKey the encryption key that should be used to encrypt the data.
 * @returns a tuple containing the encrypted data and the initialization vector as a hex string.
 */
export declare function encryptData(data: PersistentData, encryptionKey: crypto.lib.WordArray): [string, string];
/**
 * Derives a key suitable for encrypting the config from the given password.
 *
 * @param password the password from which the encryption key will be derived.
 * @param salt the salt that is used for key derivation.
 * @returns a hex encoded string of the derived key.
 */
export declare function deriveEncryptionKey(password: string, salt: string): string;
/**
 * Re-encrypts the passed data to change the password/encryption key.
 * Currently only used to migrate from <=0.2 to >=0.3 config formats but
 * could be used to implement a change password feature in the future.
 * @param data the data that should be re-encrypted.
 * @param oldSecret the previous encryption key or password.
 * @param newSecret the new encryption key.
 */
export declare function reEncryptData(data: EncryptedData, oldSecret: string | crypto.lib.WordArray, newSecret: crypto.lib.WordArray): Result<void>;
/**
 * Ensures that the passed encrypted data has the salt attribute set.
 * The salt attribute is not set when either this is the first start of nodecg-io
 * or if this is a old config from nodecg-io <= 0.2.
 *
 * If this is a new configuration a new salt will be generated and set inside the EncryptedData object.
 * If this is a old configuration from nodecg-io <= 0.2 it will be migrated to the new format as well.
 *
 * @param data the encrypted data where the salt should be ensured to be available
 * @param password the password of the encrypted data. Used if this config needs to be migrated
 */
export declare function ensureEncryptionSaltIsSet(data: EncryptedData, password: string): void;
/**
 * Manages encrypted persistence of data that is held by the instance and bundle managers.
 */
export declare class PersistenceManager {
    private readonly nodecg;
    private readonly services;
    private readonly instances;
    private readonly bundles;
    private encryptionKey;
    private encryptedData;
    constructor(nodecg: NodeCG, services: ServiceManager, instances: InstanceManager, bundles: BundleManager);
    /**
     * Checks whether the passed encryption key is correct. Only works if already loaded and a encryption key is already set.
     * @param encryptionKey the encryption key which should be checked for correctness
     */
    checkEncryptionKey(encryptionKey: string): boolean;
    /**
     * Returns if the locally stored configuration has been loaded and a encryption key has been set.
     */
    isLoaded(): boolean;
    /**
     * Returns whether this is the first startup aka. whether any encrypted data has been saved.
     * If this returns true {@link load} will accept any encryption key and use it to encrypt the configuration.
     */
    isFirstStartup(): boolean;
    /**
     * Decrypts and loads the locally stored configuration using the passed encryption key.
     * @param encryptionKey the encryption key of the encrypted config.
     * @return success if the encryption key was correct and loading has been successful and an error if the encryption key is wrong.
     */
    load(encryptionKey: string): Promise<Result<void>>;
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