import { TwitchServiceConfig } from "nodecg-io-twitch-auth";
export declare class TwitchAddonsClient {
    private readonly clientId;
    private readonly token;
    constructor(clientId: string, token: string);
    /**
     * Gets the global emotes of BetterTTV
     */
    getBetterTTVGlobalEmotes(): Promise<BetterTTVEmote[]>;
    /**
     * Gets the BetterTTV channel data associated with a twitch channel or undefined if that twitch user has
     * not registered for BetterTTV.
     */
    getBetterTTVChannel(channel: string): Promise<BetterTTVChannel | undefined>;
    /**
     * Gets the FFZ global emotes
     */
    getFFZGlobalEmotes(): Promise<FFZGlobalEmotes>;
    /**
     * Gets the FFZ channel data associated with a twitch channel or undefined if that twitch user has
     * not registered for FFZ.
     */
    getFFZChannel(channel: string): Promise<FFZChannel | undefined>;
    /**
     * Gets the 7TV global emotes
     */
    getSevenTVGlobalEmotes(): Promise<SevenTVGlobalEmotes>;
    /**
     * Gets the 7tv channel data associated with a twitch channel or undefined if that twitch user has
     * not registered for 7tv.
     */
    getSevenTVChannel(channel: string): Promise<SevenTVChannelEmotes | undefined>;
    /**
     * Gets an emote collection for a channel. Here all emotes are stored so you can access all of them
     * without always sending requests to the APIs and caring about undefined values. (If someone is not
     * registered somewhere, there'll just be empty lists here).
     * @param
     */
    getEmoteCollection(channel: string, options?: EmoteCollectionOptions): Promise<EmoteCollection>;
    /**
     * Gets all emote names from an emote collection.
     */
    getEmoteNames(emotes: EmoteCollection): string[];
    /**
     * Gets the emote URL for an emote name from an emote collection. If the requested resolution is
     * not available, you'll get the next available resolution that is smaller than the one you gave.
     * If there's no smaller resolution, you'll get the next bigger one.
     */
    getEmoteURL(emote: string, emotes: EmoteCollection, resolution: EmoteResolution): Promise<string | undefined>;
    /**
     * Gets a complete URL from a ffz URL. (This prepends `https:` to the ffz url)
     * @param part
     */
    getURL(part: FFZUrl): string;
    private getUserId;
    private static getFFZUrl;
    static createClient(config: TwitchServiceConfig): Promise<TwitchAddonsClient>;
}
/**
 * The data the better twitch tv API gives for a twitch channel
 */
export declare type BetterTTVChannel = {
    /**
     * UUID used by BetterTTV for this channel
     */
    id: string;
    /**
     * A list of names of accounts marked as bots in this channel.
     */
    bots: string[];
    /**
     * A list of emotes that were created by this channel's owner and uploaded to BetterTTV
     */
    channelEmotes: BetterTTVChannelEmote[];
    /**
     * A list of emotes that are not uploaded by this channel's owner but are available on this channel.
     */
    sharedEmotes: BetterTTVSharedEmote[];
};
/**
 * One emote from BetterTTV
 */
export declare type BetterTTVEmote = {
    /**
     * A UUID used to identify this emote
     */
    id: string;
    /**
     * The text in chat that trigger this emote to show up
     */
    code: string;
    /**
     * The type of the image.
     */
    imageType: "png" | "gif";
};
/**
 * One channel emote from BetterTTV
 */
export declare type BetterTTVChannelEmote = BetterTTVEmote & {
    /**
     * UUID of the user who created this emote. Pretty useless as it seems to be
     * always the same id that is also available in BetterTTVChannel
     */
    userId: string;
};
/**
 * One shared emote from BetterTTV
 */
export declare type BetterTTVSharedEmote = BetterTTVEmote & {
    /**
     * The user who created this emote
     */
    user: BetterTTVUser;
};
/**
 * A BetterTTV user
 */
export declare type BetterTTVUser = {
    /**
     * UUID used by BetterTTV for this user
     */
    id: string;
    /**
     * The login name of this user
     */
    name: string;
    /**
     * The display name (name with capitalisation) of this user
     */
    displayName: string;
    /**
     * This seems to be the helix id of the user.
     */
    providerId: string;
};
/**
 * A FFZ URL is always only a part of a URL. Use getURL() to get a complete URL.
 */
export declare type FFZUrl = string;
/**
 * A channel in the FrankerFaceZ API
 */
export declare type FFZChannel = {
    /**
     * Generic information about the channel
     */
    room: FFZRoom;
    /**
     * A record containing emote sets. The key of the record is the id of the emote set.
     */
    sets: Record<string, FFZEmoteSet>;
};
/**
 * Generic information abou a FFZ channel.
 */
export declare type FFZRoom = {
    /**
     * The helix id of the user
     */
    twitch_id: number;
    /**
     * The login name of the user
     */
    id: string;
    /**
     * I can not really say what this is and it seems to be false in most cases.
     */
    is_group: boolean;
    /**
     * The display name (name with capitalisation) of the user
     */
    display_name: string;
    /**
     * The custom moderator badge url.
     */
    moderatorBadge: string | null;
    mod_urls: unknown;
    user_badges: Record<string, unknown>;
    user_badge_ids: Record<string, unknown>;
    css: unknown;
};
/**
 * A set of FFZ emotes
 */
export declare type FFZEmoteSet = {
    /**
     * The id of the emote set.
     */
    id: number;
    /**
     * The title of the emote set.
     */
    title: string;
    icon: unknown;
    css: unknown;
    emoticons: FFZEmote[];
};
/**
 * One FFZ emote
 */
export declare type FFZEmote = {
    /**
     * The id of the emote
     */
    id: number;
    /**
     * The code used in chat to display this emote
     */
    name: string;
    width: number;
    height: number;
    public: boolean;
    offset: unknown;
    margins: unknown;
    css: unknown;
    owner: FFZUser;
    status: number;
    usage_count: number;
    created_at: string;
    last_updated: string;
    /**
     * URLS of the emote. The key is the resolution, which is always a number string.
     */
    urls: Record<string, FFZUrl>;
};
/**
 * A FFZ user
 */
export declare type FFZUser = {
    /**
     * The login name of the user
     */
    name: string;
    /**
     * The display name (name with capitalisation) of the user
     */
    display_name: string;
};
/**
 * Global emotes from FFZ
 */
export declare type FFZGlobalEmotes = {
    /**
     * Contains the ids of sets that everyone can use.
     */
    default_sets: number[];
    /**
     * The global emote sets. The key of the record is the id of the emote set.
     */
    sets: Record<string, FFZEmoteSet>;
};
/**
 * A badge object in 7TV. Contains image URLs and a list of all users who have the badge.
 *
 * The list of users depends on the query:
 * > `user_identifier: "object_id" | "twitch_id" | "login"`
 */
export declare type SevenTVBadge = {
    /**
     * 7TV Badge ID
     */
    id: string;
    /**
     * 7TV Badge Name
     * @example "Admin"
     */
    name: string;
    /**
     * 7TV Tooltip in case of Rendering for UI
     * @example "7TV Admin"
     */
    tooltip: string;
    /**
     * 7TV Badge URLs to grab the image url.
     * Url will always be at index [2].
     * @example [["1", "https://cdn.7tv.app/badge/60cd6255a4531e54f76d4bd4/1x", ""], ...]
     */
    urls: [string, string, string][];
    /**
     * A list of all userIds. The format of the IDs are determined by the query sent to obtain the data.
     *
     * @example
     * ```
     * // user_identifier = "twitch_id" (Twitch User ID)
     * ["24377667", "12345678", ...]
     * ```
     * @example
     * ```
     * //user_identifier = "login" (Twitch Usernames)
     * ["anatoleam", "mizkif", "devjimmyboy", ...]
     * ```
     * @example
     * ```
     * // user_identifier = "object_id" (7tv User ID)
     * ["60c5600515668c9de42e6d69", "3bc5437b814a67920f3dde4b", ...]
     * ```
     */
    users: string[];
};
/**
 * 7TV Emote Object
 */
export declare type SevenTVEmote = {
    /**
     * Unique ID of 7TV Emote.
     */
    id: string;
    /**
     * Name of emote. What users type to display an emote.
     * @example "FeelsDankMan"
     */
    name: string;
    /**
     * Owner of the emote.
     */
    owner: SevenTVUser;
    /**
     * Number corresponding to the global visibility
     */
    visibility: number;
    /**
     * API Docs don't say what this is,
     * most likely a list of strings corresponding to `visibility` property.
     */
    visibility_simple: unknown[];
    /**
     * MIME Type of Emote Asset.
     * Most are served as `image/gif` or `image/png`
     * @example "image/webp"
     */
    mime: string;
    /**
     * Status of emote.
     * Whether emote is approved or not by 7TV Moderators.
     * @example 3
     */
    status: number;
    /**
     * Docs don't say the type of this. I'd guess it's a creator-defined list of strings used for search purposes.
     * @example []
     */
    tags: unknown[];
    /**
     * List of widths with length/index corresponding to urls in #urls.
     * @example [27,41,65,110]
     */
    width: number[];
    /**
     * List of heights with length/index corresponding to urls in #urls.
     * @example [32,48,76,128]
     */
    height: number[];
    /**
     * List of tuples with type `[${Resolution}, ${URL of Emote}]`
     */
    urls: [string, string][];
};
/**
 * List of emotes for a specified Channel
 */
export declare type SevenTVChannelEmotes = SevenTVEmote[];
/**
 * List of Global Emotes for 7TV.
 */
export declare type SevenTVGlobalEmotes = SevenTVEmote[];
/**
 * 7TV User Object.
 */
export declare type SevenTVUser = {
    /**
     * ID of the User in 7TV API.
     */
    id: string;
    /**
     * Twitch ID of the User.
     */
    twitch_id: string;
    /**
     * Twitch Login of the User.
     */
    login: string;
    /**
     * Twitch Display Name of the User.
     */
    display_name: string;
    /**
     * 7TV object describing permissions for this user.
     */
    role: {
        /**
         * Role ID
         */
        id: string;
        /**
         * Role Name.
         */
        name: string;
        /**
         * Position in Role's Userlist
         */
        position: number;
        /**
         * Color of Role.
         */
        color: number;
        /**
         * Number that describes allowed perms of User.
         */
        allowed: number;
        /**
         * Number that describes denied perms of User.
         */
        denied: number;
    };
};
/**
 * Contains a list of emote sets from BTTV and / or FFZ
 */
export declare type EmoteCollection = {
    bttvChannel: BetterTTVChannelEmote[];
    bttvShared: BetterTTVSharedEmote[];
    bttvGlobal: BetterTTVEmote[];
    ffz: FFZEmoteSet[];
    ffzGlobal: FFZEmoteSet[];
    stv: SevenTVChannelEmotes;
    stvGlobal: SevenTVGlobalEmotes;
};
/**
 * Options for method getEmoteCollection.
 */
export declare type EmoteCollectionOptions = {
    /**
     * Include each providers' global emotes in the returned collection.
     * @default true
     */
    includeGlobal?: boolean;
    /**
     * Include [7TV](https://7tv.app) emotes in the returned collection.
     * @default false
     */
    include7tv?: boolean;
};
/**
 * Resolution of an emote image
 */
export declare type EmoteResolution = 1 | 2 | 3 | 4;
//# sourceMappingURL=twitchAddonsClient.d.ts.map