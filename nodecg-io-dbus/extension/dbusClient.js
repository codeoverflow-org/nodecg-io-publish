"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBusObject = exports.DBusClient = void 0;
const tslib_1 = require("tslib");
const dbus = (0, tslib_1.__importStar)(require("dbus-next"));
class DBusClient {
    constructor(config) {
        this.session = dbus.sessionBus(config);
        this.system = dbus.systemBus();
    }
    async proxy(config) {
        const proxy = await (config.system ? this.system : this.session).getProxyObject(config.iface, config.path);
        return config.create(this, proxy);
    }
    static createClient(config) {
        return new DBusClient(config);
    }
}
exports.DBusClient = DBusClient;
class DBusObject {
    constructor(client, proxy) {
        this.client = client;
        this.proxy = proxy;
        this.properties = proxy.getInterface("org.freedesktop.DBus.Properties");
    }
    async getProperty(iface, name) {
        return await this.properties.Get(iface, name);
    }
    async setProperty(iface, name, value) {
        return await this.properties.Set(iface, name, value);
    }
}
exports.DBusObject = DBusObject;
//# sourceMappingURL=dbusClient.js.map