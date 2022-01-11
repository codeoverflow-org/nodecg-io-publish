"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageManager = void 0;
const result_1 = require("./utils/result");
/**
 * MessageManager manages communication with the GUI and handles NodeCG messages to control the framework.
 * Also adds a small wrapper around the actual functions them to make some things easier.
 */
class MessageManager {
    constructor(nodecg, services, instances, bundles, persist) {
        this.nodecg = nodecg;
        this.services = services;
        this.instances = instances;
        this.bundles = bundles;
        this.persist = persist;
    }
    registerMessageHandlers() {
        this.listenWithAuth("updateInstanceConfig", async (msg) => {
            const inst = this.instances.getServiceInstance(msg.instanceName);
            if (inst === undefined) {
                return (0, result_1.error)("Service instance doesn't exist.");
            }
            else {
                return await this.instances.updateInstanceConfig(msg.instanceName, msg.config);
            }
        });
        this.listenWithAuth("createServiceInstance", async (msg) => {
            return this.instances.createServiceInstance(msg.serviceType, msg.instanceName);
        });
        this.listenWithAuth("deleteServiceInstance", async (msg) => {
            return (0, result_1.success)(this.instances.deleteServiceInstance(msg.instanceName));
        });
        this.listenWithAuth("setServiceDependency", async (msg) => {
            if (msg.instanceName === undefined) {
                const success = this.bundles.unsetServiceDependency(msg.bundleName, msg.serviceType);
                if (success) {
                    return (0, result_1.emptySuccess)();
                }
                else {
                    return (0, result_1.error)("Service dependency couldn't be found.");
                }
            }
            else {
                const instance = this.instances.getServiceInstance(msg.instanceName);
                if (instance === undefined) {
                    return (0, result_1.error)("Service instance couldn't be found.");
                }
                else {
                    return this.bundles.setServiceDependency(msg.bundleName, msg.instanceName, instance);
                }
            }
        });
        this.listen("isLoaded", async () => {
            return (0, result_1.success)(this.persist.isLoaded());
        });
        this.listen("load", async (msg) => {
            return this.persist.load(msg.encryptionKey);
        });
        this.listen("getServices", async () => {
            // We create a shallow copy of the service before we return them because if we return a reference
            // another bundle could call this, get a reference and overwrite the createClient function on it
            // and therefore get a copy of all credentials that are used for services.
            // If we shallow copy the functions get excluded and other bundles can't overwrite it.
            const result = this.services.getServices().map((svc) => Object.assign({}, svc));
            return (0, result_1.success)(result);
        });
        this.listen("isFirstStartup", async () => {
            return (0, result_1.success)(this.persist.isFirstStartup());
        });
    }
    listen(messageName, cb) {
        this.nodecg.listenFor(messageName, async (msg, ack) => {
            const result = await cb(msg);
            if (!(ack === null || ack === void 0 ? void 0 : ack.handled)) {
                if (result.failed) {
                    ack === null || ack === void 0 ? void 0 : ack(result.errorMessage, undefined);
                }
                else {
                    ack === null || ack === void 0 ? void 0 : ack(undefined, result.result);
                }
            }
        });
    }
    listenWithAuth(messageName, cb) {
        this.listen(messageName, async (msg) => {
            if (this.persist.checkEncryptionKey(msg.encryptionKey)) {
                return cb(msg);
            }
            else {
                return (0, result_1.error)("The password is invalid");
            }
        });
    }
}
exports.MessageManager = MessageManager;
//# sourceMappingURL=messageManager.js.map