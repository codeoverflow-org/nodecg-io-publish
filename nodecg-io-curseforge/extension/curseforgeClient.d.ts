export declare class CurseForge {
    /**
     * Get a curse addon.
     * @param addonId The id of the addon.
     */
    getAddon(addonId: number): Promise<CurseAddon>;
    /**
     * Get an array of curse addons.
     * @param addonIds An array of ids for multiple addons.
     */
    getMultipleAddons(addonIds: number[]): Promise<CurseAddon[]>;
    /**
     * Get an array of addons with the search results for the given query.
     * @param query The CurseSearchQuery to use. See documentation of CurseSearchQuery for more info.
     */
    searchForAddons(query: CurseSearchQuery): Promise<CurseAddon[]>;
    /**
     * Get a CurseFeaturedAddonsResponse for the given query. See documentation of CurseFeaturedAddonsResponse for more info.
     * @param query The CurseFeaturedAddonsQuery to use. See documentation of CurseFeaturedAddonsQuery for more info.
     */
    getFeaturedAddons(query: CurseFeaturedAddonsQuery): Promise<CurseFeaturedAddonsResponse>;
    /**
     * Get a CurseFingerprintResponse for given fingerprints. See documentation of CurseFingerprintResponse for more info.
     * @param fingerprints An array of murmurhash2 values of each file without whitespaces.
     */
    getAddonByFingerprint(fingerprints: number[]): Promise<CurseFingerprintResponse>;
    /**
     * Get an array of all available mod loaders.
     */
    getModloaderList(): Promise<CurseModLoader[]>;
    /**
     * Get an array of all available curse categories.
     */
    getCategoryInfoList(): Promise<CurseCategoryInfo[]>;
    /**
     * Get information of a specific category.
     * @param categoryId The id of the category you want information for.
     */
    getCategoryInfo(categoryId: number): Promise<CurseCategoryInfo>;
    /**
     * Get information of a specific section.
     * @param sectionId The id of the section you want information for.
     */
    getCategorySectionInfo(sectionId: number): Promise<CurseCategoryInfo[]>;
    /**
     * Get an array of all games information.
     * @param supportsAddons Optional parameter if only addons are displayed which support addons. Defaults to true.
     */
    getGamesInfoList(supportsAddons?: boolean): Promise<CurseGameInfo[]>;
    /**
     * Get the game info of a specific game.
     * @param gameId The id of the game you want information for.
     */
    getGameInfo(gameId: number): Promise<CurseGameInfo>;
    /**
     * Get the UTC time when the database was last updated.
     */
    getDatabaseTimestamp(): Promise<Date>;
    /**
     * Get the UTC time when the minecraft versions were last updated.
     */
    getMinecraftVersionTimestamp(): Promise<Date>;
    /**
     * Get the UTC time when the mod loader list was last updated.
     */
    getModLoaderTimestamp(): Promise<Date>;
    /**
     * Get the UTC time when the categories were last updated.
     */
    getCategoryTimestamp(): Promise<Date>;
    /**
     * Get the UTC time when the games were last updated.
     */
    getGameTimestamp(): Promise<Date>;
    rawRequest(method: HttpMethod, endpoint: string, data?: any): Promise<any>;
}
/**
 * A curse addon such as a Minecraft mod.
 */
export declare class CurseAddon {
    private readonly curse;
    readonly addonId: number;
    readonly info: CurseAddonInfo;
    constructor(curse: CurseForge, addonId: number, info: CurseAddonInfo);
    /**
     * Creates an addon.
     * @param curse The CurseForge instance.
     * @param addonId The id of the addon you want to create.
     */
    static create(curse: CurseForge, addonId: number): Promise<CurseAddon>;
    /**
     * Get all files of the addon.
     */
    getFiles(): Promise<CurseFileInfo[]>;
    /**
     * Get the description of an CurseAddon. It's raw html or markdown as a string.
     */
    getAddonDescription(): Promise<string>;
}
/**
 * A file from an addon.
 */
export declare class CurseFile {
    readonly addon: CurseAddon;
    readonly fileId: number;
    readonly info: CurseFileInfo;
    constructor(addon: CurseAddon, fileId: number, info: CurseFileInfo);
    /**
     * Creates a file.
     * @param curse The CurseForge instance.
     * @param addon The parent addon of the file.
     * @param fileId The id of the specific file.
     */
    static create(curse: CurseForge, addon: CurseAddon, fileId: number): Promise<CurseFile>;
    /**
     * Get the download url of the file.
     */
    getDownloadUrl(): string;
    /**
     * Get the changelog of a file.
     * It is raw html or markdown as a string.
     */
    getFileChangelog(): Promise<string>;
}
export declare type CurseGameInfo = {
    /**
     * The game id
     */
    id: number;
    /**
     * The game name
     */
    name: string;
    /**
     * The slug used in urls
     */
    slug: string;
    /**
     * The date when the game was last modified
     */
    dateModified: string;
    /**
     * The files of the game
     */
    gameFiles: CurseGameFile[];
    fileParsingRules: CurseParsingRule[];
    /**
     * The category sections of a game
     */
    categorySections: CurseCategorySection[];
    maxFreeStorage: number;
    maxPremiumStorage: number;
    maxFileSize: number;
    addonSettingsFolderFilter: string | null;
    addonSettingsStartingFolder: string | null;
    addonSettingsFileFilter: string | null;
    addonSettingsFileRemovalFilter: string | null;
    /**
     * Whether the game supports addons or not
     */
    supportsAddons: boolean;
    supportsPartnerAddons: boolean;
    supportedClientConfiguration: number;
    /**
     * Whether the game supports notifications or not
     */
    supportsNotifications: boolean;
    profilerAddonId: number;
    /**
     * The category id on Twitch of the game
     */
    twitchGameId: number;
    clientGameSettingsId: number;
};
export declare type CurseParsingRule = {
    commentStripPattern: string;
    fileExtension: string;
    inclusionPattern: string;
    gameId: number;
    id: number;
};
export declare type CurseGameFile = {
    /**
     * The id of a games file
     */
    id: number;
    /**
     * The game id
     */
    gameId: number;
    /**
     * Whether a file is required for the game or not
     */
    isRequired: boolean;
    /**
     * The file name
     */
    fileName: string;
    /**
     * The file type id
     */
    fileType: number;
    /**
     * The platform type id
     */
    platformType: number;
};
export declare type CurseGameDetectionHint = {
    id: number;
    hintType: number;
    hintPath: string;
    hintKey: string | null;
    hintOptions: number;
    /**
     * The game id
     */
    gameId: number;
};
export declare type CurseModLoader = {
    /**
     * The loader name
     */
    name: string;
    /**
     * The game version the loader is for
     */
    gameVersion: string;
    /**
     * Whether it's the latest loader version for the game version or not
     */
    latest: boolean;
    /**
     * Whether it's the recommended loader version for the game version or not
     */
    recommended: boolean;
    /**
     * The date when the loader was last modified
     */
    dateModified: string;
};
export declare type CurseAddonInfo = {
    /**
     * The addon id
     */
    id: number;
    /**
     * The addon name
     */
    name: string;
    /**
     * All users marked as owner or author
     */
    authors: CurseAddonAuthor[];
    /**
     * All attachments such as the logo or screenshots
     */
    attachments: CurseAddonAttachment[];
    /**
     * The url to the addon
     */
    websiteUrl: string;
    /**
     * The game id
     */
    gameId: number;
    /**
     * The small summary shown on overview sites
     */
    summary: string;
    /**
     * The default files id
     */
    defaultFileId: number;
    /**
     * The download count
     */
    downloadCount: number;
    /**
     * The latest release, beta and alpha file
     */
    latestFiles: LatestCurseFileInfo[];
    /**
     * The categories the addon is included in
     */
    categories: CurseCategory[];
    /**
     * The CurseProjectStatus
     */
    status: number;
    /**
     * The primary category id
     */
    primaryCategoryId: number;
    /**
     * The category section the project is included in
     */
    categorySection: CurseCategorySection;
    /**
     * The slug used in urls
     */
    slug: string;
    /**
     * The basic information about latest release, beta and alpha of each game version
     */
    gameVersionLatestFiles: CurseGameVersionLatestFile[];
    isFeatured: boolean;
    /**
     * The value used for sorting by popularity
     */
    popularityScore: number;
    /**
     * The current popularity rank of the game
     */
    gamePopularityRank: number;
    /**
     * The primary language
     */
    primaryLanguage: string;
    /**
     * The games slug used in urls
     */
    gameSlug: string;
    /**
     * The games name
     */
    gameName: string;
    /**
     * The portal you find the addon on
     */
    portalName: string;
    /**
     * The date when the addon was last modified
     */
    dateModified: string;
    /**
     * The date when the addon was created
     */
    dateCreated: string;
    /**
     * The date when the last file was added
     */
    dateReleased: string;
    /**
     * Whether the addon is public visible or not
     */
    isAvailable: boolean;
    /**
     * Whether the addon is in experimental state or not
     */
    isExperiemental: boolean;
};
export declare type CurseAddonAuthor = {
    /**
     * The authors name
     */
    name: string;
    /**
     * The url to the authors profile
     */
    url: string;
    /**
     * The project id the title data is correct for
     */
    projectId: number;
    id: number;
    /**
     * The id for the authors title in the project
     * null for owner
     */
    projectTitleId: number | null;
    /**
     * The name for the authors title in the project
     * null for owner
     */
    projectTitleTitle: string | null;
    /**
     * The user id
     */
    userId: number;
    /**
     * The twitch id of the users linked twitch account
     */
    twitchId: number;
};
export declare type CurseAddonAttachment = {
    /**
     * The attachment id
     */
    id: number;
    /**
     * The project id
     */
    projectId: number;
    /**
     * The attachment description
     */
    description: string;
    /**
     * Whether it's the logo or not
     */
    isDefault: boolean;
    /**
     * Thr url to a compressed version
     */
    thumbnailUrl: string;
    /**
     * The attachment name
     */
    title: string;
    /**
     * The url to an uncompressed version
     */
    url: string;
    /**
     * The attachment status
     */
    status: number;
};
export declare type CurseFileInfo = {
    /**
     * The file id
     */
    id: number;
    /**
     * The displayed name
     */
    displayName: string;
    /**
     * The real file name
     */
    fileName: string;
    /**
     * The date the file was uploaded
     */
    fileDate: string;
    /**
     * The file size in byte
     */
    fileLength: number;
    /**
     * The CurseReleaseType
     */
    releaseType: number;
    /**
     * The CurseFileStatus
     */
    fileStatus: number;
    /**
     * The url where the file can be downloaded
     */
    downloadUrl: string;
    /**
     * Whether it's an additional file or not
     */
    isAlternate: boolean;
    /**
     * The id of the additional file
     */
    alternateFileId: number;
    /**
     * All the dependencies
     */
    dependencies: CurseDependency[];
    /**
     * Whether the file is public visible or not
     */
    isAvailable: boolean;
    /**
     * All the modules of the file
     */
    modules: CurseModule[];
    /**
     * The murmurhash2 fingerprint without whitespaces
     */
    packageFingerprint: number;
    /**
     * The game versions the file is for
     */
    gameVersion: string[];
    installMetadata: unknown;
    /**
     * The file id of the corresponding server pack
     */
    serverPackFileId: number | null;
    /**
     * Whether the file has an install script or not
     */
    hasInstallScript: boolean;
    /**
     * The date the game version was released
     */
    gameVersionDateReleased: string;
    gameVersionFlavor: unknown;
};
export declare type LatestCurseFileInfo = CurseFileInfo & {
    sortableGameVersion: CurseSortableGameVersion[];
    /**
     * The changelog
     */
    changelog: string | null;
    /**
     * Whether the file is compatible with client or not
     */
    isCompatibleWithClient: boolean;
    categorySectionPackageType: number;
    restrictProjectFileAccess: number;
    /**
     * The CurseProjectStatus
     */
    projectStatus: number;
    renderCacheId: number;
    fileLegacyMappingId: number | null;
    /**
     * The id of the files addon
     */
    projectId: number;
    parentProjectFileId: number | null;
    parentFileLegacyMappingId: number | null;
    fileTypeId: number | null;
    exposeAsAlternative: unknown;
    packageFingerprintId: number;
    gameVersionMappingId: number;
    gameVersionId: number;
    /**
     * The game id
     */
    gameId: number;
    /**
     * Whether this is a server pack or not
     */
    isServerPack: boolean;
    gameVersionFlavor: undefined;
};
export declare type CurseGameVersionLatestFile = {
    /**
     * The game version
     */
    gameVersion: string;
    /**
     * The file id
     */
    projectFileId: number;
    /**
     * The file name
     */
    projectFileName: string;
    /**
     * The file type
     */
    fileType: number;
    gameVersionFlavor: unknown;
};
export declare type CurseCategory = {
    /**
     * The category id
     */
    categoryId: number;
    /**
     * The category name
     */
    name: string;
    /**
     * The url to the category
     */
    url: string;
    /**
     * The url to the avatar
     */
    avatarUrl: string;
    /**
     * The id to the parent category section
     */
    parentId: number;
    /**
     * The id to the root category section
     */
    rootId: number;
    /**
     * The project id
     */
    projectId: number;
    avatarId: number;
    /**
     * The game id
     */
    gameId: number;
};
export declare type CurseCategorySection = {
    /**
     * The category section id
     */
    id: number;
    /**
     * The game id the section is for
     */
    gameId: number;
    /**
     * The section name
     */
    name: string;
    packageType: number;
    /**
     * The path where the files should be downloaded to
     */
    path: string;
    initialInclusionPattern: string;
    extraIncludePattern: unknown;
    /**
     * The game category id. This value can be used for `sectionId` in
     * a search query.
     */
    gameCategoryId: number;
};
export declare type CurseCategoryInfo = {
    /**
     * The category id
     */
    id: number;
    /**
     * The category name
     */
    name: string;
    /**
     * The category slug used in urls
     */
    slug: string;
    /**
     * The url to the avatar
     */
    avatarUrl: string;
    /**
     * The date the category was last updated
     */
    dateModified: string;
    /**
     * The parent game category id
     */
    parentGameCategoryId: number | null;
    /**
     * The root game category id. For root categories, this is null.
     */
    rootGameCategoryId: number | null;
    /**
     * The game id the category belongs to
     */
    gameId: number;
};
export declare type CurseDependency = {
    /**
     * The addon id
     */
    addonId: number;
    /**
     * The CurseDependencyType
     */
    type: number;
};
export declare type CurseModule = {
    /**
     * The folder/file name
     */
    foldername: string;
    /**
     * The folder/file fingerprint
     */
    fingerprint: number;
};
export declare type CurseSortableGameVersion = {
    gameVersionPadded: string;
    gameVersion: string;
    gameVersionReleaseDate: string;
    gameVersionName: string;
};
export declare type CurseFingerprintResponse = {
    isCacheBuilt: boolean;
    /**
     * All exact matches of the given fingerprints
     */
    exactMatches: CurseFileInfo[];
    /**
     * The fingerprints which matched
     */
    exactFingerprints: number[];
    /**
     * All files which matched partially
     */
    partialMatches: CurseFileInfo[];
    /**
     * The fingerprints which matched partially
     */
    partialMatchFingerprints: number[];
    /**
     * All fingerprints you sent
     */
    installedFingerprints: number[];
    /**
     * All fingerprints which didn't match
     */
    unmatchedFingerprints: number[];
};
export declare type CurseFeaturedAddonsResponse = {
    /**
     * All featured files which matched the query
     */
    Featured: CurseFileInfo[];
    /**
     * All popular files which matched the query
     */
    Popular: CurseFileInfo[];
    /**
     * All recently updated files which matched the query
     */
    RecentlyUpdated: CurseFileInfo[];
};
export declare type CurseReleaseType = "release" | "beta" | "alpha";
export declare type CurseDependencyType = "embedded_library" | "optional" | "required" | "tool" | "incompatible" | "include";
export declare type CurseFileStatus = "status_1" | "status_2" | "status_3" | "approved" | "rejected" | "status_6" | "deleted" | "archived";
export declare type CurseProjectStatus = "new" | "status_2" | "status_3" | "approved" | "status_5" | "status_6" | "status_7" | "status_8" | "deleted";
export declare type CurseSearchQuery = {
    /**
     * Id of a category to search in. This is not for root categories.
     * Root categories should use sectionId instead.
     */
    categoryID?: number;
    gameId: number;
    gameVersion?: string;
    index?: number;
    pageSize?: number;
    searchFilter?: string;
    /**
     * Id of a category to search in. This is only for root categories.
     * Other categories should use categoryID instead.
     */
    sectionId?: number;
    sort?: number;
};
export declare type CurseFeaturedAddonsQuery = {
    GameId: number;
    addonIds?: number[];
    featuredCount?: number;
    popularCount?: number;
    updatedCount?: number;
};
export declare class MagicValues {
    private static readonly RELEASE;
    private static readonly RELEASE_INVERSE;
    private static readonly DEPENDENCY;
    private static readonly DEPENDENCY_INVERSE;
    private static readonly FILE_STATUS;
    private static readonly FILE_STATUS_INVERSE;
    private static readonly PROJECT_STATUS;
    private static readonly PROJECT_STATUS_INVERSE;
    static releaseType(value: number): CurseReleaseType;
    static releaseType(value: CurseReleaseType): number;
    static dependencyType(value: number): CurseDependencyType;
    static dependencyType(value: CurseDependencyType): number;
    static fileStatus(value: number): CurseFileStatus;
    static fileStatus(value: CurseFileStatus): number;
    static projectStatus(value: number): CurseProjectStatus;
    static projectStatus(value: CurseProjectStatus): number;
    private static mapMagicValue;
    private static inverse;
}
export declare type HttpMethod = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH";
//# sourceMappingURL=curseforgeClient.d.ts.map