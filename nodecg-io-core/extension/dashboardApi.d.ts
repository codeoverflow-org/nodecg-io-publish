import { NodeCG } from "nodecg-types/types/server";
import { BundleManager } from "./bundleManager";
import { InstanceManager } from "./instanceManager";
import { ServiceManager } from "./serviceManager";
import { PersistenceManager } from "./persistenceManager";
export declare type DashboardApiRequest = {
    type: string;
} | CreateServiceInstanceRequest | UpdateInstanceConfigRequest | DeleteServiceInstanceRequest | SetServiceDependencyRequest;
export interface AuthenticatedRequest {
    type: string;
    password: string;
}
export interface CreateServiceInstanceRequest extends AuthenticatedRequest {
    serviceType: string;
    instanceName: string;
}
export interface UpdateInstanceConfigRequest extends AuthenticatedRequest {
    instanceName: string;
    config: unknown;
}
export interface DeleteServiceInstanceRequest extends AuthenticatedRequest {
    instanceName: string;
}
export interface SetServiceDependencyRequest extends AuthenticatedRequest {
    bundleName: string;
    instanceName: string | undefined;
    serviceType: string;
}
export declare const dashboardApiPath = "/nodecg-io-core/";
export declare class DashboardApi {
    private nodecg;
    private services;
    private instances;
    private bundles;
    private persist;
    private readonly routes;
    private readonly authenticatedRoutes;
    private sessionValue;
    constructor(nodecg: NodeCG, services: ServiceManager, instances: InstanceManager, bundles: BundleManager, persist: PersistenceManager);
    private createServiceInstance;
    private updateInstanceConfig;
    private deleteServiceInstance;
    private setServiceDependency;
    private isLoaded;
    private load;
    private getServices;
    private isFirstStartup;
    private getSessionValue;
    private handleRequest;
    mountApi(): void;
    /**
     * A malicious bundle could try and mount a fake dashboard Api before nodecg-io-core and
     * get access to e.g. the nodecg-io configuration password.
     *
     * To circumvent this at least a bit, we generate a random session value and serve it using a route.
     * Once nodecg has loaded all bundles it will start its express server with all routes.
     *
     * To check if another bundle already registered a route on the same path, we call
     * the getSessionValue route. If the response is the same as the stored session value only we know
     * everything is fine.
     * If not, we know that another bundle has already mounted the dashboard api and we'll stop
     * nodecg to prevent any password leakage.
     *
     * Any bundle can still mess with nodecg-io by simply overwriting its source file,
     * this is just a little layer of protection so that not any bundle can get
     * the password with like three lines of code.
     */
    private verifySuccessfulMount;
}
//# sourceMappingURL=dashboardApi.d.ts.map