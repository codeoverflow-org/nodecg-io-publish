import { Client as IRCClient } from "irc";
interface IRCServiceConfig {
    nick: string;
    host: string;
    port?: number;
    password?: string;
    reconnectTries?: number;
}
export declare class IRCServiceClient extends IRCClient {
    constructor(config: IRCServiceConfig);
    sendMessage(target: string, message: string): void;
}
export {};
//# sourceMappingURL=index.d.ts.map