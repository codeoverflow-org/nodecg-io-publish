import { AuthProvider, TokenInfo } from "@twurple/auth";
export interface TwitchServiceConfig {
    oauthKey: string;
}
export declare function createAuthProvider(cfg: TwitchServiceConfig): Promise<AuthProvider>;
/**
 * Gets the token info for the passed config.
 */
export declare function getTokenInfo(cfg: TwitchServiceConfig): Promise<TokenInfo>;
/**
 * Strips any "oauth:" before the token away, because the client needs the token without it.
 */
export declare function normalizeToken(cfg: TwitchServiceConfig): string;
//# sourceMappingURL=index.d.ts.map