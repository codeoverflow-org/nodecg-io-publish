import { Service } from "./service";
import NodeCG from "@nodecg/types";
import { Result } from "./utils/result";
/**
 * Manages services by allowing services to register them and allowing access of other components to the registered services.
 */
export declare class ServiceManager {
    private readonly nodecg;
    private services;
    constructor(nodecg: NodeCG.ServerAPI);
    /**
     * Registers the passed service which show it in the GUI and allows it to be instanced using {@link createServiceInstance}.
     * @param service the service you want to register.
     */
    registerService<R, C>(service: Service<R, C>): void;
    /**
     * Returns all registered services.
     */
    getServices(): Service<unknown, any>[];
    /**
     * Returns the service with the passed name.
     * @param serviceName The name of the service you want to get.
     * @return the service or undefined if no service with this name has been registered.
     */
    getService(serviceName: string): Result<Service<unknown, any>>;
}
//# sourceMappingURL=serviceManager.d.ts.map