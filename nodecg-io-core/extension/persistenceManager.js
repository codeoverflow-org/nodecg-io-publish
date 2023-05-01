"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistenceManager = exports.decryptData = void 0;
const tslib_1 = require("tslib");
const crypto = tslib_1.__importStar(require("crypto-js"));
const result_1 = require("./utils/result");
/**
 * Decrypts the passed encrypted data using the passed password.
 * If the password is wrong, an error will be returned.
 *
 * @param cipherText the ciphertext that needs to be decrypted.
 * @param password the password for the encrypted data.
 */
function decryptData(cipherText, password) {
    try {
        const decryptedBytes = crypto.AES.decrypt(cipherText, password);
        const decryptedText = decryptedBytes.toString(crypto.enc.Utf8);
        const data = JSON.parse(decryptedText);
        return (0, result_1.success)(data);
    }
    catch {
        return (0, result_1.error)("Password isn't correct.");
    }
}
exports.decryptData = decryptData;
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
            persistent: true,
            defaultValue: {},
        });
        this.checkAutomaticLogin();
    }
    /**
     * Checks whether the passed password is correct. Only works if already loaded and a password is already set.
     * @param password the password which should be checked for correctness
     */
    checkPassword(password) {
        if (this.isLoaded()) {
            return this.password === password;
        }
        else {
            return false;
        }
    }
    /**
     * Returns if the locally stored configuration has been loaded and a password has been set.
     */
    isLoaded() {
        return this.password !== undefined;
    }
    /**
     * Returns whether this is the first startup aka. whether any encrypted data has been saved.
     * If this returns true {{@link load}} will accept any password and use it to encrypt the configuration.
     */
    isFirstStartup() {
        var _a;
        return ((_a = this.encryptedData.value) === null || _a === void 0 ? void 0 : _a.cipherText) === undefined;
    }
    /**
     * Decrypts and loads the locally stored configuration using the passed password.
     * @param password the password of the encrypted config.
     * @return success if the password was correct and loading has been successful and an error if the password is wrong.
     */
    async load(password) {
        var _a;
        if (this.isLoaded()) {
            return (0, result_1.error)("Config has already been decrypted and loaded.");
        }
        if (((_a = this.encryptedData.value) === null || _a === void 0 ? void 0 : _a.cipherText) === undefined) {
            // No encrypted data has been saved, probably because this is the first startup.
            // Therefore nothing needs to be decrypted, and we write an empty config to disk.
            this.nodecg.log.info("No saved configuration found, creating a empty one.");
            this.password = password;
            this.save();
        }
        else {
            // Decrypt config
            this.nodecg.log.info("Decrypting and loading saved configuration.");
            const data = decryptData(this.encryptedData.value.cipherText, password);
            if (data.failed) {
                return data;
            }
            // Load config into the respecting manager
            // Instances first as the bundle dependency depend upon the existing instances.
            const promises = this.loadServiceInstances(data.result.instances);
            this.loadBundleDependencies(data.result.bundleDependencies);
            this.saveAfterServiceInstancesLoaded(promises);
        }
        // Save password, used in save() function
        this.password = password;
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
        // Check if we have a password to encrypt the data with.
        if (this.password === undefined) {
            return;
        }
        // Organize all data that will be encrypted into a single object.
        const data = {
            instances: this.getServiceInstances(),
            bundleDependencies: this.bundles.getBundleDependencies(),
        };
        // Encrypt and save data to persistent replicant.
        const cipherText = crypto.AES.encrypt(JSON.stringify(data), this.password);
        if (this.encryptedData.value === undefined) {
            this.encryptedData.value = {};
        }
        this.encryptedData.value.cipherText = cipherText.toString();
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
            if (bundles && bundles.length > 0) {
                try {
                    this.nodecg.log.info("Attempting to automatically login...");
                    const loadResult = await this.load(password);
                    if (!loadResult.failed) {
                        this.nodecg.log.info("Automatic login successful.");
                    }
                    else {
                        throw loadResult.errorMessage;
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