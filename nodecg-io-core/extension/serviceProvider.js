"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireService = exports.ServiceProvider = void 0;
const events_1 = require("events");
/**
 * A wrapper around a ServiceClient that has helper functions for setting up callbacks and
 * a function which just returns the current ServiceClient.
 * This class gets its client updates through the framework, namely using the {@link ServiceDependency.clientUpdateCallback}.
 */
class ServiceProvider {
    constructor() {
        this.em = new events_1.EventEmitter();
        // Make service client non-enumerable, that way it won't be serialized, which would cause problems.
        Object.defineProperty(this, "currentClient", {
            enumerable: false,
            writable: true,
        });
    }
    /**
     * Returns the current client from the assigned service instance or undefined if it failed to create one or
     * the current bundle has no service instance assigned to it.
     * @return {C | undefined} the current client or undefined it there was an error or there is no assigned service instance.
     */
    getClient() {
        return this.currentClient;
    }
    /**
     * Registers a callback that gets fired every time the available client gets updated and is available,
     * meaning the bundle has an assigned service instance, and it didn't produce an error while creating the client.
     * @param {(client: C) => void} handler a handler that gets called every time the client gets available.
     */
    onAvailable(handler) {
        this.em.on("set", handler);
    }
    /**
     * Registers a callback that is every time called when there is no assigned service instance any more, or it tried
     * to create a service client and failed.
     * @param {() => void} handler a handler that gets called every time the client gets unavailable.
     */
    onUnavailable(handler) {
        this.em.on("unset", handler);
    }
    /**
     * Updates the client and calls all registered handlers of {@link onAvailable} and {@link onUnavailable} depending on
     * whether the passed client parameter was undefined or not.
     * This is only intended to be called by the framework and not by a bundle.
     * @param client the new client
     */
    updateClient(client) {
        this.currentClient = client;
        this.em.emit(client ? "set" : "unset", client);
    }
}
exports.ServiceProvider = ServiceProvider;
/**
 * Allows for bundles to require services.
 * @param {NodeCG} nodecg the NodeCG instance of your bundle. Is used to get the bundle name of the calling bundle.
 * @param {string} serviceType the type of service you want to require, e.g., "twitch" or "spotify".
 * @return {ServiceClientWrapper<C> | undefined} a service client wrapper for access to the service client
 *                                               or undefined if the core wasn't loaded or the service type doesn't exist.
 */
function requireService(nodecg, serviceType) {
    const core = nodecg.extensions["nodecg-io-core"];
    if (core === undefined) {
        nodecg.log.error(`nodecg-io-core isn't loaded! Can't require ${serviceType} service for bundle ${nodecg.bundleName}.`);
        return;
    }
    return core.requireService(nodecg, serviceType);
}
exports.requireService = requireService;
//# sourceMappingURL=serviceProvider.js.map