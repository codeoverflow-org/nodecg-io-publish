"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamElementsServiceClient = void 0;
const io = require("socket.io-client");
const nodecg_io_core_1 = require("nodecg-io-core");
const events_1 = require("events");
class StreamElementsServiceClient extends events_1.EventEmitter {
    constructor(jwtToken) {
        super();
        this.jwtToken = jwtToken;
        this.subBombDetectionMap = new Map();
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
                    this.handleSubGift(data.data.sender, data, (subBomb) => this.emit("subbomb", subBomb), (gift) => this.emit("gift", gift));
                }
            }
            this.emit(data.type, data);
        });
    }
    handleSubGift(subGifter, gift, handlerSubBomb, handlerGift) {
        var _a;
        const gifter = subGifter !== null && subGifter !== void 0 ? subGifter : "anonymous";
        const subBomb = (_a = this.subBombDetectionMap.get(gifter)) !== null && _a !== void 0 ? _a : {
            subs: [],
            timeout: setTimeout(() => {
                this.subBombDetectionMap.delete(gifter);
                // Only fire sub bomb event if more than one sub were gifted.
                // Otherwise, this is just a single gifted sub.
                if (subBomb.subs.length > 1) {
                    const subBombEvent = {
                        gifterUsername: gifter,
                        subscribers: subBomb.subs,
                    };
                    handlerSubBomb(subBombEvent);
                    subBomb.subs.forEach(sub => {
                        sub.data.isFromSubBomb = true;
                    });
                }
                subBomb.subs.forEach(handlerGift);
            }, 1000),
        };
        subBomb.subs.push(gift);
        // New subs in this sub bomb. Refresh timeout in case another one follows.
        subBomb.timeout.refresh();
        this.subBombDetectionMap.set(gifter, subBomb);
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
    onSubscriber(handler, includeSubGifts = true) {
        this.on("subscriber", (data) => {
            if (data.data.gifted && !includeSubGifts)
                return;
            handler(data);
        });
    }
    onSubscriberBomb(handler) {
        this.on("subbomb", handler);
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
    setupReplicant(rep) {
        if (rep.value === undefined) {
            rep.value = {};
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function setValue(key, value) {
            if (rep.value === undefined) {
                rep.value = {};
            }
            rep.value[key] = value;
        }
        this.onSubscriber((data) => setValue("lastSubscriber", data));
        this.onSubscriberBomb((data) => setValue("lastSubBomb", data));
        this.onTip((data) => setValue("lastTip", data));
        this.onCheer((data) => setValue("lastCheer", data));
        this.onGift((data) => setValue("lastGift", data));
        this.onFollow((data) => setValue("lastFollow", data));
        this.onRaid((data) => setValue("lastRaid", data));
        this.onHost((data) => setValue("lastHost", data));
    }
}
exports.StreamElementsServiceClient = StreamElementsServiceClient;
//# sourceMappingURL=StreamElements.js.map