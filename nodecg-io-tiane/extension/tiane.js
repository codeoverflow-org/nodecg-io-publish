"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tiane = void 0;
const tslib_1 = require("tslib");
const ws_1 = (0, tslib_1.__importDefault)(require("ws"));
const events_1 = require("events");
class Tiane extends events_1.EventEmitter {
    constructor(websocket) {
        super();
        this.websocket = websocket;
        this.websocket.onmessage = (evt) => {
            const data = evt.data;
            if (data !== undefined) {
                const json = JSON.parse(data);
                switch (json.action) {
                    case "say": {
                        this.emit("say-" + json.room, json.msg, json.ping);
                        break;
                    }
                    case "event": {
                        this.emit("event-" + json.name, json.data);
                    }
                }
                this.emit("message", json.msg, json.ping);
            }
        };
    }
    static async connect(address) {
        if (!address.includes("://")) {
            address = "ws://" + address;
        }
        const websocket = new ws_1.default(address);
        await new Promise((resolve, reject) => {
            websocket.once("error", reject);
            websocket.on("open", () => {
                websocket.off("error", reject);
                resolve(undefined);
            });
        });
        return new Tiane(websocket);
    }
    close() {
        this.websocket.close();
    }
    /**
     * Add a listener when TIANE wants to say something.
     * @param room the room previously created with `newRoom` to listen in.
     */
    onsay(room, handler) {
        super.on("say-" + room, handler);
        return this;
    }
    /**
     * Add a listener when a TIANE module sends an event.
     */
    onevent(event, handler) {
        super.on("event-" + event, handler);
        return this;
    }
    eventNames() {
        return ["message"];
    }
    /**
     * Tell TIANE something. If the user does not exist, it's created ad-hoc
     * @param text The text that TIANE should process
     * @param user The user that told the message
     * @param room A romm that was created with `newRoom` where the message should come from.
     * @param role The role of the user. TIANE suggest 'USER' and 'ADMIN' for this but in the standard modules they're not used. So you could as well go for 'USER', 'MODERATOR' and 'OWNER' if you use it in your own modules.
     * @param explicit Whether the user has explicitely called TIANE (e.g. with a ping). If this is not the case TIANE will ignore the message except she asked the user before. If in doubt just set this to true.
     */
    send(text, user, room, role, explicit) {
        this.websocket.send(JSON.stringify({
            action: "listen",
            msg: text,
            user: user,
            room: room,
            role: role,
            explicit: explicit,
        }));
    }
    /**
     * TIANE will tell the given user the given text.
     */
    notify(text, user) {
        this.websocket.send(JSON.stringify({
            action: "notify",
            msg: text,
            user: user,
        }));
    }
    /**
     * Creates a new room with the given name
     * @param secure Whether this room should only allow secure modules to run.
     */
    newRoom(name, secure) {
        this.websocket.send(JSON.stringify({
            action: "create_room",
            room: name,
            secure: secure,
        }));
    }
    /**
     * Associate the given output type with a room previously created with `newRoom`.
     */
    roomOutput(room, output) {
        this.websocket.send(JSON.stringify({
            action: "set_output",
            room: room,
            output: output,
        }));
    }
    /**
     * Moves the given user to the given room.
     */
    moveTo(user, room) {
        this.websocket.send(JSON.stringify({
            action: "set_user_to_room",
            user: user,
            room: room,
        }));
    }
}
exports.Tiane = Tiane;
//# sourceMappingURL=tiane.js.map