"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceManager = void 0;
const result_1 = require("./utils/result");
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Manages services by allowing services to register them and allowing access of other components to the registered services.
 */
class ServiceManager {
    constructor(nodecg) {
        this.nodecg = nodecg;
        this.services = [];
    }
    /**
     * Registers the passed service which show it in the GUI and allows it to be instanced using {@link createServiceInstance}.
     * @param service the service you want to register.
     */
    registerService(service) {
        this.services.push(service);
        this.nodecg.log.info(`Service ${service.serviceType} has been registered.`);
    }
    /**
     * Returns all registered services.
     */
    getServices() {
        return this.services;
    }
    /**
     * Returns the service with the passed name.
     * @param serviceName The name of the service you want to get.
     * @return the service or undefined if no service with this name has been registered.
     */
    getService(serviceName) {
        const svc = this.services.find((svc) => svc.serviceType === serviceName);
        if (svc === undefined) {
            return (0, result_1.error)("Service hasn't been registered.");
        }
        else {
            return (0, result_1.success)(svc);
        }
    }
}
exports.ServiceManager = ServiceManager;
//# sourceMappingURL=serviceManager.js.map