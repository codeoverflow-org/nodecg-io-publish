import { NodeCGIOCore } from ".";
import { NodeCG } from "nodecg-types/types/server";
import { ObjectMap, Service } from "./service";
import { Result } from "./utils/result";
import { Logger } from "./utils/logger";
/**
 * Class helping to create a nodecg-io service
 *
 * Models a service that a bundle can depend upon and use to access e.g. a twitch chat or similar.
 * @typeParam R a interface type that describes the user provided config for the service.
 *              Intended to hold configurations and authentication information that the service needs to provide a client.
 * @typeParam C the type of a client that the service will provide to bundles using {@link createClient}.
 */
export declare abstract class ServiceBundle<R, C> implements Service<R, C> {
    core: NodeCGIOCore | undefined;
    nodecg: NodeCG;
    serviceType: string;
    schema?: ObjectMap<unknown>;
    /**
     * The default value for the config.
     */
    defaultConfig?: R;
    /**
     * Config presets that the user can choose to load as their config.
     * Useful for e.g. detected devices with everything already filled in for that specific device.
     * Can also be used to show the user multiple different authentication methods or similar.
     */
    presets?: ObjectMap<R>;
    /**
     * This constructor creates the service and gets the nodecg-io-core
     * @param nodecg the current NodeCG instance
     * @param serviceName the name of the service in all-lowercase-and-with-hyphen
     * @param pathSegments the path to the schema.json most likely __dirname, "../serviceName-schema.json"
     */
    constructor(nodecg: NodeCG, serviceName: string, ...pathSegments: string[]);
    /**
     * Registers this service bundle at the core bundle, makes it appear in the GUI and makes it usable.
     * @return a service provider for this service, can be used by bundles to depend on this service.
     */
    register(): void;
    /**
     * This function validates the passed config after it has been validated against the json schema (if applicable).
     * Should make deeper checks like checking validity of auth tokens.
     * @param config the config which should be validated.
     * @param logger the logger which logs with the instance.name as prefix
     * @return void if the config passes validation and an error string describing the issue if not.
     */
    abstract validateConfig(config: R, logger: Logger): Promise<Result<void>>;
    /**
     * Creates a client to the service using the validated config.
     * The returned result will be passed to bundles and they should be able to use the service with this returned client.
     *
     * @param config the user provided config for the service.
     * @param logger the logger which logs with the instance.name as prefix
     * @return the client if everything went well and an error string describing the issue if a error occured.
     */
    abstract createClient(config: R, logger: Logger): Promise<Result<C>>;
    /**
     * Stops a client of this service that is not needed anymore.
     * Services should close any connections that might exist here.
     *
     * @param client the client that needs to be stopped.
     * @param logger the logger which logs with the instance.name as prefix
     */
    abstract stopClient(client: C, logger: Logger): void;
    /**
     * Removes all handlers from a service client.
     * This is used when a bundle no longer uses a service client it still has its handlers registered.
     * Then this function is called that should remove all handlers
     * and then all bundles that are still using this client will asked to re-register their handlers
     * by running the onAvailable callback of the specific bundle.
     *
     * Can be left unimplemented if the serivce doesn't has any handlers e.g. a http wrapper
     * @param client the client of which all handlers should be removed
     */
    removeHandlers?(client: C): void;
    /**
     * This flag can be enabled by services if they can't implement removeHandlers but also have some handlers that
     * should be reset if a bundleDependency has been changed.
     * It gets rid of the handlers by stopping the client and creating a new one, to which then only the
     * now wanted handlers get registered (e.g. if a bundle doesn't uses this service anymore but another still does).
     * Not ideal, but if your service can't implement removeHandlers for some reason it is still better than
     * having dangling handlers that still fire events eventho they shouldn't.
     */
    reCreateClientToRemoveHandlers: boolean;
    /**
     * This flag says that this service cannot be configured and doesn't need any config passed to {@link createClient}.
     * If this is set {@link validateConfig} will never be called.
     * @default false
     */
    requiresNoConfig: boolean;
    private readSchema;
}
//# sourceMappingURL=serviceBundle.d.ts.map