"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MQTTClientServiceClient = void 0;
const nodecg_io_core_1 = require("nodecg-io-core");
const mqtt_1 = require("mqtt");
class MQTTClientServiceClient {
    connect(url, username, password) {
        return new Promise((resolve, reject) => {
            this.client = (0, mqtt_1.connect)(url, {
                username: username,
                password: password,
            });
            this.client.on("error", (err) => {
                this.client.end();
                reject(err.message);
            });
            this.client.on("connect", resolve);
            this.once = this.client.once;
            this.on = this.client.on;
            this.close = this.client.end;
            this.off = this.client.off;
        });
    }
    subscribe(topics) {
        topics.forEach((topic) => {
            this.client.subscribe(topic);
        });
    }
    onClose(func) {
        return this.client.on("close", func);
    }
    onMessage(func) {
        return this.client.on("message", func);
    }
    onError(func) {
        return this.client.on("error", func);
    }
}
exports.MQTTClientServiceClient = MQTTClientServiceClient;
module.exports = (nodecg) => {
    new MQTTClientService(nodecg, "mqtt-client", __dirname, "../mqtt-schema.json").register();
};
class MQTTClientService extends nodecg_io_core_1.ServiceBundle {
    async validateConfig(config) {
        const client = new MQTTClientServiceClient();
        await client.connect(config.address, config.username, config.password);
        client.close();
        return (0, nodecg_io_core_1.emptySuccess)();
    }
    async createClient(config, logger) {
        const client = new MQTTClientServiceClient();
        await client.connect(config.address, config.username, config.password);
        client.subscribe(config.topics);
        logger.info("Successfully connected to the MQTT server.");
        return (0, nodecg_io_core_1.success)(client);
    }
    stopClient(client) {
        if (client.client.connected) {
            client.close();
        }
    }
    removeHandlers(client) {
        client.client.removeAllListeners();
    }
}
//# sourceMappingURL=index.js.map