/// <reference types="node" />
import { EventEmitter } from "events";
export declare class Tiane extends EventEmitter {
    private readonly websocket;
    private constructor();
    static connect(address: string): Promise<Tiane>;
    close(): void;
    /**
     * Add a listener when TIANE wants to say something.
     * @param room the room previously created with `newRoom` to listen in.
     */
    onsay(room: string, handler: (text: string, user: string | null) => void): this;
    /**
     * Add a listener when a TIANE module sends an event.
     */
    onevent(event: string, handler: (event: string, data: unknown) => void): this;
    eventNames(): Array<string | symbol>;
    /**
     * Tell TIANE something. If the user does not exist, it's created ad-hoc
     * @param text The text that TIANE should process
     * @param user The user that told the message
     * @param room A romm that was created with `newRoom` where the message should come from.
     * @param role The role of the user. TIANE suggest 'USER' and 'ADMIN' for this but in the standard modules they're not used. So you could as well go for 'USER', 'MODERATOR' and 'OWNER' if you use it in your own modules.
     * @param explicit Whether the user has explicitely called TIANE (e.g. with a ping). If this is not the case TIANE will ignore the message except she asked the user before. If in doubt just set this to true.
     */
    send(text: string, user: string, room: string, role: string, explicit: boolean): void;
    /**
     * TIANE will tell the given user the given text.
     */
    notify(text: string, user: string): void;
    /**
     * Creates a new room with the given name
     * @param secure Whether this room should only allow secure modules to run.
     */
    newRoom(name: string, secure: boolean): void;
    /**
     * Associate the given output type with a room previously created with `newRoom`.
     */
    roomOutput(room: string, output: string): void;
    /**
     * Moves the given user to the given room.
     */
    moveTo(user: string, room: string): void;
}
//# sourceMappingURL=tiane.d.ts.map