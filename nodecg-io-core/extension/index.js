"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serviceManager_1 = require("./serviceManager");
const bundleManager_1 = require("./bundleManager");
const messageManager_1 = require("./messageManager");
const instanceManager_1 = require("./instanceManager");
const persistenceManager_1 = require("./persistenceManager");
const logger_1 = require("./utils/logger");
module.exports = (nodecg) => {
    nodecg.log.info("Minzig!");
    const serviceManager = new serviceManager_1.ServiceManager(nodecg);
    const bundleManager = new bundleManager_1.BundleManager(nodecg);
    const instanceManager = new instanceManager_1.InstanceManager(nodecg, serviceManager, bundleManager);
    const persistenceManager = new persistenceManager_1.PersistenceManager(nodecg, serviceManager, instanceManager, bundleManager);
    new messageManager_1.MessageManager(nodecg, serviceManager, instanceManager, bundleManager, persistenceManager).registerMessageHandlers();
    registerExitHandlers(nodecg, bundleManager, instanceManager, serviceManager, persistenceManager);
    // We use a extra object instead of returning a object containing all the managers and so on, because
    // any loaded bundle would be able to call any (public or private) of the managers which is not intended.
    return {
        registerService(service) {
            serviceManager.registerService(service);
        },
        requireService(nodecg, serviceType) {
            const bundleName = nodecg.bundleName;
            const svc = serviceManager.getService(serviceType);
            if (svc.failed) {
                nodecg.log.warn(`The bundle "${bundleName}" can't require the "${serviceType}" service: ` +
                    "no service with such name.");
                return;
            }
            return bundleManager.registerServiceDependency(bundleName, svc.result);
        },
    };
};
function onExit(nodecg, bundleManager, instanceManager, serviceManager, persistenceManager) {
    var _a, _b, _c;
    // Save everything
    // This is especially important if some services update some configs (e.g. updated tokens) and they haven't been saved yet.
    persistenceManager.save();
    // Unset all service instances in all bundles
    const bundles = bundleManager.getBundleDependencies();
    for (const bundleName in bundles) {
        (_a = bundles[bundleName]) === null || _a === void 0 ? void 0 : _a.forEach((bundleDependency) => {
            // Only unset a service instance if it was set previously
            if (bundleDependency.serviceInstance !== undefined) {
                bundleDependency.provider.updateClient(undefined);
            }
        });
    }
    // Call `stopClient` for all service instances
    const instances = instanceManager.getServiceInstances();
    for (const key in instances) {
        if (instances[key] !== undefined) {
            const client = (_b = instances[key]) === null || _b === void 0 ? void 0 : _b.client;
            const service = serviceManager.getService((_c = instances[key]) === null || _c === void 0 ? void 0 : _c.serviceType);
            if (!service.failed && client) {
                nodecg.log.info(`Stopping service ${key} of type ${service.result.serviceType}.`);
                try {
                    service.result.stopClient(client, new logger_1.Logger(key, nodecg));
                }
                catch (err) {
                    nodecg.log.info(`Could not stop service ${key} of type ${service.result.serviceType}: ${String(err)}`);
                }
            }
        }
    }
}
function registerExitHandlers(nodecg, bundleManager, instanceManager, serviceManager, persistenceManager) {
    const handler = () => {
        onExit(nodecg, bundleManager, instanceManager, serviceManager, persistenceManager);
    };
    // Normal exit
    process.on("exit", handler);
    // Ctrl + C
    process.on("SIGINT", handler);
    // kill
    process.on("SIGTERM", handler);
    // nodemon
    process.once("SIGUSR1", () => {
        handler();
        process.kill(process.pid, "SIGUSR1");
    });
    process.once("SIGUSR2", () => {
        handler();
        process.kill(process.pid, "SIGUSR2");
    });
    // Uncaught exception
    process.on("uncaughtException", handler);
    process.on("unhandledRejection", handler);
}
//# sourceMappingURL=index.js.map