/// <reference types="node" />
import { NodeCG } from "nodecg-types/types/server";
import { ObjectMap, Service, ServiceInstance } from "./service";
import { Result } from "./utils/result";
import { ServiceManager } from "./serviceManager";
import { BundleManager } from "./bundleManager";
import { EventEmitter } from "events";
/**
 * Manages instances of services and their configs/clients.
 */
export declare class InstanceManager extends EventEmitter {
    private readonly nodecg;
    private readonly services;
    private readonly bundles;
    private serviceInstances;
    private ajv;
    constructor(nodecg: NodeCG, services: ServiceManager, bundles: BundleManager);
    /**
     * Finds and returns the service instance with the passed name if it exists.
     * @param instanceName the name of the instance you want to get.
     * @return the wanted service instance if it has been found, undefined otherwise.
     */
    getServiceInstance(instanceName: string): ServiceInstance<unknown, unknown> | undefined;
    /**
     * Returns all existing service instances.
     * @return {ObjectMap<ServiceInstance<unknown, unknown>>} a map of the instance name to the instance.
     */
    getServiceInstances(): ObjectMap<ServiceInstance<unknown, unknown>>;
    /**
     * Creates a service instance of the passed service.
     * @param serviceType the type of the service of which a instance should be created
     * @param instanceName how the instance should be named
     * @return void if everything went fine and a string describing the issue if not
     */
    createServiceInstance(serviceType: string, instanceName: string): Result<void>;
    /**
     * Deletes a service instance with the passed name.
     * @param instanceName the name of the service instance that should be deleted.
     * @return true if it has been found and deleted, false if it couldn't been found.
     */
    deleteServiceInstance(instanceName: string): boolean;
    /**
     * Updates the config of a service instance.
     * Before actually setting the new config, it validates it against the json schema of the service and
     * the validate function of the service.
     * @param instanceName the name of the service instance of which the config should be set.
     * @param config the actual config that will be given to the service instance.
     * @param validation whether the config should be validated, defaults to true.
     *                   Should only be false if it has been validated at a previous point in time, e.g. loading after startup.
     * @return void if everything went fine and a string describing the issue if something went wrong.
     */
    updateInstanceConfig(instanceName: string, config: unknown, validation?: boolean): Promise<Result<void>>;
    /**
     * Updates the client of a service instance by calling the underlying service to generate a new client
     * using the new config and also let all bundle depending on it update their client.
     * @param inst the instance of which the client should be generated.
     * @param instanceName the name of the service instance, used for letting all bundles know of the new client.
     * @param service the service of the service instance, needed to stop old client
     */
    updateInstanceClient<R, C>(inst: ServiceInstance<R, C>, instanceName: string, service: Service<R, C>): Promise<Result<void>>;
    /**
     * Removes all handlers from the service client of the instance and lets bundles readd their handlers.
     * @param instanceName the name of the instance which handlers should be re-registered
     */
    private reregisterHandlersOfInstance;
}
//# sourceMappingURL=instanceManager.d.ts.map