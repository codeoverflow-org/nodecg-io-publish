"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceBundle = void 0;
const tslib_1 = require("tslib");
const fs = (0, tslib_1.__importStar)(require("fs"));
const path = (0, tslib_1.__importStar)(require("path"));
/**
 * Class helping to create a nodecg-io service
 *
 * Models a service that a bundle can depend upon and used to access e.g., a twitch chat or similar.
 * @typeParam R an interface type that describes the user provided config for the service.
 *              Intended to hold configurations and authentication information that the service needs to provide a client.
 * @typeParam C the type of client that the service will provide to bundles using {@link createClient}.
 */
class ServiceBundle {
    /**
     * This constructor creates the service and gets the nodecg-io-core
     * @param nodecg the current NodeCG instance
     * @param serviceName the name of the service in all-lowercase-and-with-hyphen
     * @param pathSegments the path to the schema.json most likely __dirname, "../serviceName-schema.json"
     */
    constructor(nodecg, serviceName, ...pathSegments) {
        /**
         * This flag can be enabled by services if they can't implement removeHandlers but also have some handlers that
         * should be reset if a bundleDependency has been changed.
         * It gets rid of the handlers by stopping the client and creating a new one, to which then only the
         * now wanted handlers get registered (e.g., if a bundle doesn't use this service any more, but another still does).
         * Not ideal, but if your service can't implement removeHandlers for some reason it is still better than
         * having dangling handlers that still fire events even though they shouldn't.
         */
        this.reCreateClientToRemoveHandlers = false;
        /**
         * This flag says that this service cannot be configured and doesn't need any config passed to {@link createClient}.
         * If this is set, {@link validateConfig} will never be called.
         * @default false
         */
        this.requiresNoConfig = false;
        this.nodecg = nodecg;
        this.serviceType = serviceName;
        this.schema = this.readSchema(pathSegments);
        this.nodecg.log.info(this.serviceType + " bundle started.");
        this.core = this.nodecg.extensions["nodecg-io-core"];
        if (this.core === undefined) {
            this.nodecg.log.error("nodecg-io-core isn't loaded! " + this.serviceType + " bundle won't function without it.");
        }
    }
    /**
     * Registers this service bundle at the core bundle, makes it appear in the GUI and makes it usable.
     * @return a service provider for this service, can be used by bundles to depend on this service.
     */
    register() {
        var _a;
        (_a = this.core) === null || _a === void 0 ? void 0 : _a.registerService(this);
    }
    readSchema(pathSegments) {
        if (pathSegments.length === 0)
            return undefined;
        const joinedPath = path.resolve(...pathSegments);
        try {
            const fileContent = fs.readFileSync(joinedPath, "utf8");
            return JSON.parse(fileContent);
        }
        catch (err) {
            this.nodecg.log.error("Couldn't read and parse service schema at " + joinedPath.toString());
            return undefined;
        }
    }
}
exports.ServiceBundle = ServiceBundle;
//# sourceMappingURL=serviceBundle.js.map