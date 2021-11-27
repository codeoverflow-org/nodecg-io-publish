import { BasicPubSubClient, SingleUserPubSubClient } from "@twurple/pubsub";
import { TwitchServiceConfig } from "nodecg-io-twitch-auth";
import { AuthProvider } from "@twurple/auth";
export declare class TwitchPubSubServiceClient extends SingleUserPubSubClient {
    private basicClient;
    constructor(auth: AuthProvider, basicClient: BasicPubSubClient);
    /**
     * Creates a instance of TwitchServiceClient using the credentials from the passed config.
     */
    static createClient(cfg: TwitchServiceConfig): Promise<TwitchPubSubServiceClient>;
    disconnect(): Promise<void>;
}
//# sourceMappingURL=pubSubClient.d.ts.map