"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamElementsServiceClient = void 0;
const io = require("socket.io-client");
const nodecg_io_core_1 = require("nodecg-io-core");
const events_1 = require("events");
class StreamElementsServiceClient extends events_1.EventEmitter {
    constructor(jwtToken, handleTestEvents) {
        super();
        this.jwtToken = jwtToken;
        this.handleTestEvents = handleTestEvents;
    }
    createSocket() {
        this.socket = io("https://realtime.streamelements.com", { transports: ["websocket"] });
        this.onConnect(() => {
            this.socket.emit("authenticate", {
                method: "jwt",
                token: this.jwtToken,
            });
        });
        this.registerEvents();
    }
    registerEvents() {
        this.onEvent((data) => {
            if (data.type === "subscriber") {
                if (data.data.gifted) {
                    this.emit("gift", data);
                }
            }
            this.emit(data.type, data);
        });
        if (this.handleTestEvents) {
            this.onTestEvent((data) => {
                if (data.listener) {
                    this.emit("test", data);
                }
            });
        }
    }
    async connect() {
        return new Promise((resolve, _reject) => {
            this.createSocket();
            this.onConnect(resolve);
        });
    }
    async testConnection() {
        return new Promise((resolve, _reject) => {
            this.createSocket();
            this.onAuthenticated(() => {
                this.close();
                resolve((0, nodecg_io_core_1.emptySuccess)());
            });
            this.onConnectionError((err) => {
                resolve((0, nodecg_io_core_1.error)(err));
            });
            this.onUnauthorized((err) => {
                resolve((0, nodecg_io_core_1.error)(err));
            });
        });
    }
    close() {
        this.socket.close();
    }
    onConnect(handler) {
        this.socket.on("connect", handler);
    }
    onAuthenticated(handler) {
        this.socket.on("authenticated", handler);
    }
    onUnauthorized(handler) {
        this.socket.on("unauthorized", (err) => {
            handler(err.message);
        });
    }
    onConnectionError(handler) {
        this.socket.on("connect_error", handler);
    }
    onEvent(handler) {
        this.socket.on("event", (data) => {
            if (data) {
                handler(data);
            }
        });
    }
    onTestEvent(handler) {
        this.socket.on("event:test", (data) => {
            if (data) {
                handler(data);
            }
        });
    }
    onSubscriber(handler) {
        this.on("subscriber", handler);
    }
    onTip(handler) {
        this.on("tip", handler);
    }
    onCheer(handler) {
        this.on("cheer", handler);
    }
    onGift(handler) {
        this.on("gift", handler);
    }
    onFollow(handler) {
        this.on("follow", handler);
    }
    onRaid(handler) {
        this.on("raid", handler);
    }
    onHost(handler) {
        this.on("host", handler);
    }
    onTest(handler) {
        this.on("test", handler);
    }
    setupReplicant(rep) {
        if (rep.value === undefined) {
            rep.value = {};
        }
        this.on("subscriber", (data) => (rep.value.lastSubscriber = data));
        this.on("tip", (data) => (rep.value.lastTip = data));
        this.on("cheer", (data) => (rep.value.lastCheer = data));
        this.on("gift", (data) => (rep.value.lastGift = data));
        this.on("follow", (data) => (rep.value.lastFollow = data));
        this.on("raid", (data) => (rep.value.lastRaid = data));
        this.on("host", (data) => (rep.value.lastHost = data));
    }
}
exports.StreamElementsServiceClient = StreamElementsServiceClient;
//# sourceMappingURL=StreamElements.js.map