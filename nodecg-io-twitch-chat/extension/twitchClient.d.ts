import { ChatClient } from "@twurple/chat";
import { TwitchServiceConfig } from "nodecg-io-twitch-auth";
export declare class TwitchChatServiceClient extends ChatClient {
    /**
     * Creates a instance of TwitchServiceClient using the credentials from the passed config.
     */
    static createClient(cfg: TwitchServiceConfig): Promise<TwitchChatServiceClient>;
    /**
     * Joins a twitch chat channel and automatically rejoins after a reconnect.
     * @param channel the channel to join
     */
    join(channel: string): Promise<void>;
}
//# sourceMappingURL=twitchClient.d.ts.map