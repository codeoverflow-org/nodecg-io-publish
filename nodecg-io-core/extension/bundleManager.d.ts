/// <reference types="node" />
import { NodeCG } from "nodecg-types/types/server";
import { ObjectMap, Service, ServiceDependency, ServiceInstance } from "./service";
import { Result } from "./utils/result";
import { EventEmitter } from "events";
import { ServiceProvider } from "./serviceProvider";
/**
 * Manages bundles and their dependencies on nodecg-io services.
 */
export declare class BundleManager extends EventEmitter {
    private readonly nodecg;
    private readonly bundles;
    constructor(nodecg: NodeCG);
    /**
     * Gets all bundle dependencies
     * @return {ObjectMap<ServiceDependency<unknown>[]>} all bundle dependencies
     */
    getBundleDependencies(): ObjectMap<ServiceDependency<unknown>[]>;
    /**
     * Registers that a bundle has a dependency on a specific service.
     * @param bundleName the name of the bundle that registers its dependency.
     * @param service the service that the bundle depends upon.
     * @param clientUpdate the callback that should be called if a client becomes available or gets updated.
     * @return a {@link ServiceProvider} that allows the bundle to access the service client, if a service instance is set
     * and there were no errors in the client creation.
     */
    registerServiceDependency<C>(bundleName: string, service: Service<unknown, C>): ServiceProvider<C> | undefined;
    /**
     * Assigns a service instance to the service dependency of a bundle and gives the bundle access to the current
     * service client. Future client updates will be handled through {@link BundleManager.handleInstanceUpdate}.
     * @param bundleName the name of the bundle that has the dependency on the service.
     * @param instanceName the name of the service instance that should be used to satisfy the dependency of the bundle.
     * @param instance the service instance object that should be used to satisfy the dependency of the bundle.
     */
    setServiceDependency(bundleName: string, instanceName: string, instance: ServiceInstance<unknown, unknown>): Result<void>;
    /**
     * Unsets a service dependency of any service instance. Removes the connection between the bundle and the service instance.
     * @param bundleName the bundle of which the service instance should be unset.
     * @param serviceType the service type of which the service instance that should be unset
     * @return a boolean indicating if the operation was successful of if the service instance of the service dependency
     *         was already unset.
     */
    unsetServiceDependency(bundleName: string, serviceType: string): boolean;
    /**
     * Handles client updates of service instances and distributes them to all bundles that depend upon this service
     * and have this service instance set.
     * @param serviceInstance the service instance of which the client has been updated
     * @param instName the name of the service instance
     */
    handleInstanceUpdate(serviceInstance: ServiceInstance<unknown, unknown>, instName: string): void;
}
//# sourceMappingURL=bundleManager.d.ts.map