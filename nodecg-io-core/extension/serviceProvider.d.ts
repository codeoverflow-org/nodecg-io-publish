import { NodeCG } from "nodecg-types/types/server";
/**
 * A wrapper around a ServiceClient that has helper functions for setting up callbacks and
 * a function which just returns the current ServiceClient.
 * This class gets its client updates through the framework, namely using the {@link ServiceDependency.clientUpdateCallback}.
 */
export declare class ServiceProvider<C> {
    private currentClient;
    private em;
    constructor();
    /**
     * Returns the current client from the assigned service instance or undefined if it failed to create one or
     * the current bundle has no service instance assigned to it.
     * @return {C | undefined} the current client or undefined it there was an error or there is no assigned service instance.
     */
    getClient(): C | undefined;
    /**
     * Registers a callback that gets fired everytime the available client gets updated and is available,
     * meaning the bundle has an assigned service instance and it didn't produce an error while creating the client.
     * @param {(client: C) => void} handler a handler that gets called everytime the client gets available.
     */
    onAvailable(handler: (client: C) => void): void;
    /**
     * Registers a callback that is everytime called when there is no assigned service instance anymore or it tried
     * to create a service client and failed.
     * @param {() => void} handler a handler that gets called everytime the client gets unavailable.
     */
    onUnavailable(handler: () => void): void;
    /**
     * Updates the client and calls all registered handlers of {@link onAvailable} and {@link onUnavailable} depending
     * whether the passed client parameter was undefined or not.
     * This is only intended to be called by the framework and not by a bundle.
     * @param client the new client
     */
    updateClient(client: C | undefined): void;
}
/**
 * Allows for bundles to require services.
 * @param {NodeCG} nodecg the nodecg instance of your bundle. Is used to get the bundle name of the calling bundle.
 * @param {string} serviceType the type of service you want to require, e.g. "twitch" or "spotify".
 * @return {ServiceClientWrapper<C> | undefined} a service client wrapper for access to the service client
 *                                               or undefined if the core wasn't loaded or the service type doesn't exist.
 */
export declare function requireService<C>(nodecg: NodeCG, serviceType: string): ServiceProvider<C> | undefined;
//# sourceMappingURL=serviceProvider.d.ts.map