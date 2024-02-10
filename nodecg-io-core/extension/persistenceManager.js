"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistenceManager = exports.getEncryptionSalt = exports.reEncryptData = exports.deriveEncryptionKey = exports.encryptData = exports.decryptData = void 0;
const tslib_1 = require("tslib");
const crypto_js_1 = tslib_1.__importDefault(require("crypto-js"));
const hash_wasm_1 = require("hash-wasm");
const result_1 = require("./utils/result");
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
function decryptData(cipherText, encryptionKey, iv) {
    try {
        const ivWordArray = iv ? crypto_js_1.default.enc.Hex.parse(iv) : undefined;
        const decryptedBytes = crypto_js_1.default.AES.decrypt(cipherText, encryptionKey, { iv: ivWordArray });
        const decryptedText = decryptedBytes.toString(crypto_js_1.default.enc.Utf8);
        const data = JSON.parse(decryptedText);
        return (0, result_1.success)(data);
    }
    catch {
        return (0, result_1.error)("Password isn't correct.");
    }
}
exports.decryptData = decryptData;
/**
 * Encrypts the passed data object using the passed encryption key.
 *
 * @param data the data that needs to be encrypted.
 * @param encryptionKey the encryption key that should be used to encrypt the data.
 * @returns a tuple containing the encrypted data and the initialization vector as a hex string.
 */
function encryptData(data, encryptionKey) {
    const iv = crypto_js_1.default.lib.WordArray.random(16);
    const ivText = iv.toString();
    const encrypted = crypto_js_1.default.AES.encrypt(JSON.stringify(data), encryptionKey, { iv });
    return [encrypted.toString(), ivText];
}
exports.encryptData = encryptData;
/**
 * Derives a key suitable for encrypting the config from the given password.
 *
 * @param password the password from which the encryption key will be derived.
 * @param salt the hex encoded salt that is used for key derivation.
 * @returns a hex encoded string of the derived key.
 */
async function deriveEncryptionKey(password, salt) {
    var _a, _b;
    const saltBytes = Uint8Array.from((_b = (_a = salt.match(/.{1,2}/g)) === null || _a === void 0 ? void 0 : _a.map((byte) => parseInt(byte, 16))) !== null && _b !== void 0 ? _b : []);
    return await (0, hash_wasm_1.argon2id)({
        password,
        salt: saltBytes,
        // OWASP reccomends either t=1,m=37MiB or t=2,m=37MiB for argon2id:
        // https://www.owasp.org/index.php/Password_Storage_Cheat_Sheet#Argon2id
        // On a Ryzen 5 5500u a single iteration is about 220 ms. Two iterations would make that about 440 ms, which is still fine.
        // This is run inside the browser when logging in, therefore 37 MiB is acceptable too.
        // To future proof this we use 37 MiB ram and 2 iterations.
        iterations: 2,
        memorySize: 37, // KiB
        hashLength: 32, // Output size: 32 bytes = 256 bits as a key for AES-256
        parallelism: 1,
        outputType: "hex",
    });
}
exports.deriveEncryptionKey = deriveEncryptionKey;
/**
 * Re-encrypts the passed data to change the password/encryption key.
 * Currently only used to migrate from <=0.2 to >=0.3 config formats but
 * could be used to implement a change password feature in the future.
 * @param data the data that should be re-encrypted.
 * @param oldSecret the previous encryption key or password.
 * @param newSecret the new encryption key.
 */
function reEncryptData(data, oldSecret, newSecret) {
    if (data.cipherText === undefined) {
        return (0, result_1.error)("Cannot re-encrypt empty cipher text.");
    }
    const decryptedData = decryptData(data.cipherText, oldSecret, data.iv);
    if (decryptedData.failed) {
        return (0, result_1.error)(decryptedData.errorMessage);
    }
    const [newCipherText, iv] = encryptData(decryptedData.result, newSecret);
    data.cipherText = newCipherText;
    data.iv = iv;
    return (0, result_1.emptySuccess)();
}
exports.reEncryptData = reEncryptData;
/**
 * Ensures that the passed encrypted data has the salt attribute set.
 * The salt attribute is not set when either this is the first start of nodecg-io
 * or if this is a old config from nodecg-io <= 0.2.
 *
 * If this is a new configuration a new salt will be generated, set inside the EncryptedData object and returned.
 * If this is a old configuration from nodecg-io <= 0.2 it will be migrated to the new format as well.
 *
 * @param data the encrypted data where the salt should be ensured to be available
 * @param password the password of the encrypted data. Used if this config needs to be migrated
 * @return returns the either retrieved or generated salt
 */
async function getEncryptionSalt(data, password) {
    if (data.salt !== undefined) {
        // We already have a salt, so we have the new (nodecg-io >=0.3) format too.
        // We don't need to do anything then.
        return data.salt;
    }
    // No salt is present, which is the case for the nodecg-io <=0.2 configs
    // where crypto-js derived the encryption key and managed the salt
    // or when nodecg-io is first started.
    // Generate a random salt.
    const salt = crypto_js_1.default.lib.WordArray.random(128 / 8).toString();
    if (data.cipherText !== undefined) {
        // Salt is unset but we have some encrypted data.
        // This means that this is a old config (nodecg-io <=0.2), that we need to migrate to the new format.
        // Re-encrypt the configuration using our own derived key instead of the password.
        const newEncryptionKey = await deriveEncryptionKey(password, salt);
        const newEncryptionKeyArr = crypto_js_1.default.enc.Hex.parse(newEncryptionKey);
        const res = reEncryptData(data, password, newEncryptionKeyArr);
        if (res.failed) {
            throw new Error(`Failed to migrate config: ${res.errorMessage}`);
        }
    }
    data.salt = salt;
    return salt;
}
exports.getEncryptionSalt = getEncryptionSalt;
/**
 * Manages encrypted persistence of data that is held by the instance and bundle managers.
 */
class PersistenceManager {
    constructor(nodecg, services, instances, bundles) {
        this.nodecg = nodecg;
        this.services = services;
        this.instances = instances;
        this.bundles = bundles;
        this.encryptedData = nodecg.Replicant("encryptedConfig", {
            persistent: true, // Is ok since it is encrypted
            defaultValue: {},
        });
        this.checkAutomaticLogin();
    }
    /**
     * Checks whether the passed encryption key is correct. Only works if already loaded and a encryption key is already set.
     * @param encryptionKey the encryption key which should be checked for correctness
     */
    checkEncryptionKey(encryptionKey) {
        if (this.isLoaded()) {
            return this.encryptionKey === encryptionKey;
        }
        else {
            return false;
        }
    }
    /**
     * Returns if the locally stored configuration has been loaded and a encryption key has been set.
     */
    isLoaded() {
        return this.encryptionKey !== undefined;
    }
    /**
     * Returns whether this is the first startup aka. whether any encrypted data has been saved.
     * If this returns true {@link load} will accept any encryption key and use it to encrypt the configuration.
     */
    isFirstStartup() {
        var _a;
        return ((_a = this.encryptedData.value) === null || _a === void 0 ? void 0 : _a.cipherText) === undefined;
    }
    /**
     * Decrypts and loads the locally stored configuration using the passed encryption key.
     * @param encryptionKey the encryption key of the encrypted config.
     * @return success if the encryption key was correct and loading has been successful and an error if the encryption key is wrong.
     */
    async load(encryptionKey) {
        var _a;
        if (this.isLoaded()) {
            return (0, result_1.error)("Config has already been decrypted and loaded.");
        }
        if (((_a = this.encryptedData.value) === null || _a === void 0 ? void 0 : _a.cipherText) === undefined) {
            // No encrypted data has been saved, probably because this is the first startup.
            // Therefore nothing needs to be decrypted, and we write an empty config to disk.
            this.nodecg.log.info("No saved configuration found, creating a empty one.");
            this.encryptionKey = encryptionKey;
            this.save();
        }
        else {
            // Decrypt config
            this.nodecg.log.info("Decrypting and loading saved configuration.");
            const encryptionKeyArr = crypto_js_1.default.enc.Hex.parse(encryptionKey);
            const data = decryptData(this.encryptedData.value.cipherText, encryptionKeyArr, this.encryptedData.value.iv);
            if (data.failed) {
                this.nodecg.log.error("Could not decrypt configuration: encryption key is invalid.");
                return data;
            }
            // Load config into the respecting manager
            // Instances first as the bundle dependency depend upon the existing instances.
            const promises = this.loadServiceInstances(data.result.instances);
            this.loadBundleDependencies(data.result.bundleDependencies);
            this.saveAfterServiceInstancesLoaded(promises);
        }
        // Save encryption key, used in save() function
        this.encryptionKey = encryptionKey;
        // Register handlers to save when something changes
        this.instances.on("change", () => this.save());
        this.bundles.on("change", () => this.save());
        return (0, result_1.emptySuccess)();
    }
    /**
     * Loads all passed instances into the framework by creating instances of the same type and name
     * and then setting the config of the passed object.
     * @param instances the service instances that should be loaded.
     */
    loadServiceInstances(instances) {
        return Object.entries(instances).map(([instanceName, instance]) => {
            // Re-create service instance.
            const result = this.instances.createServiceInstance(instance.serviceType, instanceName);
            if (result.failed) {
                this.nodecg.log.warn(`Couldn't load instance "${instanceName}" from saved configuration: ${result.errorMessage}`);
                return Promise.resolve();
            }
            const svc = this.services.getService(instance.serviceType);
            if (!svc.failed && svc.result.requiresNoConfig) {
                return Promise.resolve();
            }
            // Re-set config of this instance.
            // We can skip the validation here because the config was already validated when it was initially set,
            // before getting saved to disk.
            // This results in faster loading when the validation takes time, e.g., makes HTTP requests.
            return this.instances
                .updateInstanceConfig(instanceName, instance.config, false)
                .then(async (result) => {
                if (result.failed) {
                    throw result.errorMessage;
                }
            })
                .catch((reason) => {
                this.nodecg.log.warn(`Couldn't load config of instance "${instanceName}" from saved configuration: ${reason}.`);
            });
        });
    }
    /**
     * Loads all passed bundle dependencies into the framework by setting them in the bundle manager.
     * @param bundles the bundle dependencies that should be set.
     */
    loadBundleDependencies(bundles) {
        Object.entries(bundles).forEach(([bundleName, deps]) => {
            deps.forEach((svcDep) => {
                // Re-setting bundle service dependencies.
                // We can ignore the case of undefined, because the default is that the bundle doesn't get any service
                // which is modelled by undefined. We are assuming that there was nobody setting it to something different.
                if (svcDep.serviceInstance !== undefined) {
                    const inst = this.instances.getServiceInstance(svcDep.serviceInstance);
                    // Don't do anything if the service instance doesn't exist any more (probably deleted)
                    if (inst !== undefined) {
                        this.bundles.setServiceDependency(bundleName, svcDep.serviceInstance, inst);
                    }
                }
            });
        });
    }
    /**
     * Encrypts and saves current state to the persistent replicant.
     */
    save() {
        // Check if we have a encryption key to encrypt the data with.
        if (this.encryptionKey === undefined) {
            return;
        }
        // Organize all data that will be encrypted into a single object.
        const data = {
            instances: this.getServiceInstances(),
            bundleDependencies: this.bundles.getBundleDependencies(),
        };
        // Encrypt and save data to persistent replicant.
        if (this.encryptedData.value === undefined) {
            this.encryptedData.value = {};
        }
        const encryptionKeyArr = crypto_js_1.default.enc.Hex.parse(this.encryptionKey);
        const [cipherText, iv] = encryptData(data, encryptionKeyArr);
        this.encryptedData.value.cipherText = cipherText;
        this.encryptedData.value.iv = iv;
    }
    /**
     * Creates a copy of all service instances without the service clients, because those
     * shouldn't be serialized and don't need to be stored in the encrypted config file.
     */
    getServiceInstances() {
        const instances = this.instances.getServiceInstances();
        const copy = {};
        Object.entries(instances).forEach(([instName, instance]) => {
            copy[instName] = {
                serviceType: instance.serviceType,
                config: instance.config,
                client: undefined,
            };
        });
        return copy;
    }
    /**
     * Saves the current configuration after all service instances have loaded.
     * @param promises the promises of the service instances
     */
    async saveAfterServiceInstancesLoaded(promises) {
        // We want to ignore errors because if a client in one instance cannot be created we still want to save the current state.
        const promisesWithoutErrs = promises.map((prom) => new Promise((resolve) => prom.then(resolve).catch(resolve)));
        // Wait till all promises either are done or have failed.
        await Promise.all(promisesWithoutErrs);
        this.nodecg.log.info("Finished creating service instances from stored configuration.");
        this.save();
    }
    /**
     * Checks whether automatic login is set up and enabled. If yes, it will do it using {@link PersistenceManager.setupAutomaticLogin}.
     */
    checkAutomaticLogin() {
        var _a;
        if (((_a = this.nodecg.bundleConfig.automaticLogin) === null || _a === void 0 ? void 0 : _a.enabled) === undefined) {
            return; // Not configured
        }
        // If enabled isn't undefined the JSON schema guarantees that enabled is a boolean and password is a string
        const enabled = this.nodecg.bundleConfig.automaticLogin.enabled;
        const password = this.nodecg.bundleConfig.automaticLogin.password;
        if (enabled === false) {
            // We inform the user that automatic login is set up but not activated because having the ability
            // to disable it by setting the enabled flag to false is meant for temporary cases.
            // If automatic login is permanently not used the user should remove the password from the config
            // to regain the advantages of data-at-rest encryption which are slashed when the password is also stored on disk.
            this.nodecg.log.warn("Automatic login is setup but disabled.");
            return;
        }
        if (password === undefined) {
            this.nodecg.log.error("Automatic login is setup but no password is provided.");
            return;
        }
        this.setupAutomaticLogin(password);
    }
    /**
     * Setups everything needed to automatically log in using the provided password after NodeCG has loaded.
     */
    setupAutomaticLogin(password) {
        // We need to do the login after all bundles have been loaded because when loading these might add bundle dependencies
        // or even register services which we need to load nodecg-io.
        // There is no official way to wait for NodeCG to be done loading, so we use more or less a hack to find that out:
        // When we declare the replicant here we will trigger a change event with an empty array.
        // Once NodeCG is done loading all bundles it'll assign an array of bundles that were loaded to this replicant
        // So if we want to wait for NodeCG to be loaded we can watch for changes on this replicant and
        // if we get a non-empty array it means that NodeCG has finished loading.
        this.nodecg.Replicant("bundles", "nodecg").on("change", async (bundles) => {
            if (bundles && bundles.length > 0 && this.encryptedData.value) {
                try {
                    this.nodecg.log.info("Attempting to automatically login...");
                    const salt = await getEncryptionSalt(this.encryptedData.value, password);
                    const encryptionKey = await deriveEncryptionKey(password, salt);
                    const loadResult = await this.load(encryptionKey);
                    if (!loadResult.failed) {
                        this.nodecg.log.info("Automatic login successful.");
                    }
                    else {
                        throw new Error(loadResult.errorMessage);
                    }
                }
                catch (err) {
                    const logMessage = `Failed to automatically login: ${err}`;
                    if (this.isLoaded()) {
                        // load() threw an error but nodecg-io is currently loaded nonetheless.
                        // Anyway, nodecg-io is loaded which is what we wanted
                        this.nodecg.log.warn(logMessage);
                    }
                    else {
                        // Something went wrong and nodecg-io is not loaded.
                        // This is a real error, the password might be wrong or some other issue.
                        this.nodecg.log.error(logMessage);
                    }
                }
            }
        });
    }
}
exports.PersistenceManager = PersistenceManager;
//# sourceMappingURL=persistenceManager.js.map