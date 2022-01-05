"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardApi = exports.dashboardApiPath = void 0;
const tslib_1 = require("tslib");
const crypto = (0, tslib_1.__importStar)(require("crypto"));
const http = (0, tslib_1.__importStar)(require("http"));
const result_1 = require("./utils/result");
exports.dashboardApiPath = "/nodecg-io-core/";
class DashboardApi {
    constructor(nodecg, services, instances, bundles, persist) {
        this.nodecg = nodecg;
        this.services = services;
        this.instances = instances;
        this.bundles = bundles;
        this.persist = persist;
        this.routes = {
            createServiceInstance: this.createServiceInstance.bind(this),
            updateInstanceConfig: this.updateInstanceConfig.bind(this),
            deleteServiceInstance: this.deleteServiceInstance.bind(this),
            setServiceDependency: this.setServiceDependency.bind(this),
            isLoaded: this.isLoaded.bind(this),
            load: this.load.bind(this),
            getServices: this.getServices.bind(this),
            isFirstStartup: this.isFirstStartup.bind(this),
            getSessionValue: this.getSessionValue.bind(this),
        };
        // For all these routes the password will be checked before the request is handled.
        // If the password is invalid or the framework hasn't been loaded yet, the request will be rejected.
        this.authenticatedRoutes = [
            "createServiceInstance",
            "updateInstanceConfig",
            "deleteServiceInstance",
            "setServiceDependency",
        ];
        this.sessionValue = crypto.randomBytes(16).toString("hex");
    }
    async createServiceInstance(msg) {
        return this.instances.createServiceInstance(msg.serviceType, msg.instanceName);
    }
    async updateInstanceConfig(msg) {
        const inst = this.instances.getServiceInstance(msg.instanceName);
        if (inst === undefined) {
            return (0, result_1.error)("Service instance doesn't exist.");
        }
        else {
            return await this.instances.updateInstanceConfig(msg.instanceName, msg.config);
        }
    }
    async deleteServiceInstance(msg) {
        return (0, result_1.success)(this.instances.deleteServiceInstance(msg.instanceName));
    }
    async setServiceDependency(msg) {
        if (msg.instanceName === undefined) {
            const success = this.bundles.unsetServiceDependency(msg.bundleName, msg.serviceType);
            if (success) {
                return (0, result_1.emptySuccess)();
            }
            else {
                return (0, result_1.error)("Service dependency couldn't be found.");
            }
        }
        else {
            const instance = this.instances.getServiceInstance(msg.instanceName);
            if (instance === undefined) {
                return (0, result_1.error)("Service instance couldn't be found.");
            }
            else {
                return this.bundles.setServiceDependency(msg.bundleName, msg.instanceName, instance);
            }
        }
    }
    async isLoaded() {
        return (0, result_1.success)(this.persist.isLoaded());
    }
    async load(req) {
        return this.persist.load(req.password);
    }
    async getServices() {
        return (0, result_1.success)(this.services.getServices());
    }
    async isFirstStartup() {
        return (0, result_1.success)(this.persist.isFirstStartup());
    }
    async getSessionValue() {
        return (0, result_1.success)(this.sessionValue);
    }
    async handleRequest(req, res) {
        const message = req.body;
        const handler = this.routes[message.type];
        if (handler === undefined) {
            res.status(404).json((0, result_1.error)(`No route with type "${message.type}" found.`));
            return;
        }
        if (this.authenticatedRoutes.includes(message.type)) {
            const msg = req.body;
            if (this.persist.checkPassword(msg.password) === false) {
                res.status(400).json((0, result_1.error)("The password is invalid."));
            }
        }
        const result = await handler(message);
        res.json(result);
    }
    mountApi() {
        const app = this.nodecg.Router();
        this.nodecg.mount(app);
        app.post(exports.dashboardApiPath, (req, res) => {
            this.handleRequest(req, res);
        });
        this.nodecg.Replicant("bundles", "nodecg").on("change", () => this.verifySuccessfulMount());
        this.nodecg.log.info("Succesfully mounted nodecg-io dashboard API.");
    }
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
    async verifySuccessfulMount() {
        await new Promise((res) => setImmediate(res));
        const payload = JSON.stringify({
            type: "getSessionValue",
        });
        const httpOptions = {
            method: "POST",
            path: exports.dashboardApiPath,
            hostname: "127.0.0.1",
            port: this.nodecg.config.port,
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(payload),
            },
        };
        const request = http.request(httpOptions, (resp) => {
            let responseBody = "";
            resp.on("data", (data) => (responseBody += data));
            resp.on("end", () => {
                const result = JSON.parse(responseBody);
                if (result.failed || result.result !== this.sessionValue) {
                    this.nodecg.log.error("Failed to verify dashboard API.");
                    process.exit(1);
                }
                else {
                    this.nodecg.log.debug("Dashboard API verified.");
                }
            });
            resp.on("error", (err) => {
                this.nodecg.log.error(`Failed to verify dashboard API: ${err}`);
                process.exit(1);
            });
        });
        request.write(payload);
        request.end();
    }
}
exports.DashboardApi = DashboardApi;
//# sourceMappingURL=dashboardApi.js.map