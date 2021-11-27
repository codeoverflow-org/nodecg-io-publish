import { __awaiter } from "tslib";
import { decryptData } from "nodecg-io-core/extension/persistenceManager";
import { EventEmitter } from "events";
import { isLoaded } from "./authentication";
const encryptedData = nodecg.Replicant("encryptedConfig");
let services;
let password;
/**
 * Config and the config variable give other components access to the decrypted data.
 * It can be used to get the raw value or to register a handler.
 */
class Config extends EventEmitter {
    constructor() {
        super();
        this.onChange((data) => (this.data = data));
    }
    onChange(handler) {
        super.on("change", handler);
    }
}
export const config = new Config();
// Update the decrypted copy of the data once the encrypted version changes (if pw available).
// This ensures that the decrypted data is kept up-to-date.
encryptedData.on("change", updateDecryptedData);
/**
 * Sets the passed password to be used by the crypto module.
 * Will try to decrypt decrypted data to tell whether the password is correct,
 * if it is wrong the internal password will be set to undefined.
 * Returns whether the password is correct.
 * @param pw the password which should be set.
 */
export function setPassword(pw) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all([
            // Ensures that the encryptedData has been declared because it is needed by setPassword()
            // This is especially needed when handling a reconnect as the replicant takes time to declare
            // and the password check is usually faster than that.
            NodeCG.waitForReplicants(encryptedData),
            fetchServices(),
        ]);
        password = pw;
        // Load framework, returns false if not already loaded and pw is wrong
        if ((yield loadFramework()) === false)
            return false;
        if (encryptedData.value) {
            updateDecryptedData(encryptedData.value);
            // Password is unset by updateDecryptedData if it is wrong.
            // This may happen if the framework was already loaded and loadFramework didn't check the pw.
            if (password === undefined) {
                return false;
            }
        }
        return true;
    });
}
export function sendAuthenticatedMessage(messageName, message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (password === undefined)
            throw "No password available";
        const msgWithAuth = Object.assign({}, message);
        msgWithAuth.password = password;
        return yield nodecg.sendMessage(messageName, msgWithAuth);
    });
}
/**
 * Returns whether a password has been set in the crypto module aka. whether is is authenticated.
 */
export function isPasswordSet() {
    return password !== undefined;
}
/**
 * Decryptes the passed data using the global password variable and saves it into ConfigData.
 * Unsets the password if its wrong and also forwards `undefined` to ConfigData if the password is unset.
 * @param data the data that should be decrypted.
 */
function updateDecryptedData(data) {
    let result = undefined;
    if (password !== undefined && data.cipherText) {
        const res = decryptData(data.cipherText, password);
        if (!res.failed) {
            result = res.result;
        }
        else {
            // Password is wrong
            password = undefined;
        }
    }
    config.emit("change", persistentData2ConfigData(result));
}
function persistentData2ConfigData(data) {
    if (!data)
        return undefined;
    if (!services) {
        nodecg.log.warn("Tried to get config but services were not loaded yet.");
        return undefined;
    }
    return {
        instances: data.instances,
        bundles: data.bundleDependencies,
        // services can be treated as constant because once loaded the shouldn't change anymore.
        // Therefore we don't need a handler to rebuild this if services change.
        services,
    };
}
function fetchServices() {
    return __awaiter(this, void 0, void 0, function* () {
        services = yield nodecg.sendMessage("getServices");
    });
}
function loadFramework() {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield isLoaded())
            return true;
        try {
            yield nodecg.sendMessage("load", { password });
            return true;
        }
        catch (_a) {
            return false;
        }
    });
}
//# sourceMappingURL=crypto.js.map