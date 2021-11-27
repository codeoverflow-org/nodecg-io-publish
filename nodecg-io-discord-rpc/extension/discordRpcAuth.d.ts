import * as rpc from "discord-rpc";
export interface DiscordRpcConfig {
    clientId: string;
    clientSecret: string;
    accessToken?: string;
    refreshToken?: string;
    redirectUrl?: string;
    expireTime?: number;
}
export declare function createLoginData(client: rpc.Client, config: DiscordRpcConfig, scopes: string[]): Promise<rpc.RPCLoginOptions>;
//# sourceMappingURL=discordRpcAuth.d.ts.map