export declare class IntelliJ {
    readonly address: string;
    readonly pluginManager: PluginManager;
    readonly localHistory: LocalHistory;
    constructor(address?: string);
    /**
     * Gets the PID of the IntelliJ process
     */
    getPid(): Promise<number>;
    /**
     * Gets the currently active Project with the given name. The Project must
     * be opened and it's window must hav the focus. If no project is found
     * or open, the promise is rejected.
     */
    getActiveProject(): Promise<Project>;
    /**
     * Gets the IntelliJ-Project with the given name. The Project must be opened. If
     * the project is not found or not open, the promise is rejected.
     */
    getProject(projectName: string): Promise<Project>;
    /**
     * Gets the given URL as an IntelliJFile. If the file is not found, the promise is
     * rejected.
     */
    getFile(url: string): Promise<VirtualFile>;
    /**
     * Runs the action with the given id. An action is for example an button in the
     * menu toolbar. A non-exhaustive list of actions can be found at
     * https://centic9.github.io/IntelliJ-Action-IDs/
     * An action place is a string that specifies from where the action call should
     * be simulated. Available action places can be found at
     * https://github.com/JetBrains/intellij-community/blob/master/platform/platform-api/src/com/intellij/openapi/actionSystem/ActionPlaces.java
     * This also allows you to call action that are not enabled (grey and not clickable) at
     * the moment. This could lead to unexpected behaviour. Use with caution
     * Please note that this method executes an action from outside of a project. That
     * means no project is available for the action. You might be looking for
     * `IntelliJProject.action()` as most actions need a project.
     * @param action The action id
     * @param place The place from where the event is simulated.
     * @param sync If this is set to true the methods blocks while the action is executing.
     */
    action(action: string, place: string, sync: boolean): Promise<void>;
    /**
     * Makes a raw request to IntelliJ
     */
    rawRequest(method: string, data: Record<string, unknown>): Promise<any>;
    equals(other: IntelliJ): boolean;
}
export declare class Project {
    protected readonly intellij: IntelliJ;
    readonly name: string;
    readonly runManager: RunManager;
    readonly taskManager: TaskManager;
    constructor(intellij: IntelliJ, name: string);
    /**
     * Gets the currently open file. If there are multiple files open (split screen), the
     * first one is returned. If there are no files open, the promise is rejected.
     */
    getOpenEditorFile(): Promise<VirtualFile>;
    /**
     * Checks whether the project is still valid. A project is no longer  valid if it was closed.
     */
    isValid(): Promise<boolean>;
    /**
     * Same as `isValid()` but the promise is rejected if the project is not valid any longer.
     */
    ensureValid(): Promise<void>;
    /**
     * Runs the action with the given id. An action is for example an button in the
     * menu toolbar. A non-exhaustive list of actions can be found at
     * https://centic9.github.io/IntelliJ-Action-IDs/
     * An action place is a string that specifies from where the action call should
     * be simulated. Available action places can be found at
     * https://github.com/JetBrains/intellij-community/blob/master/platform/platform-api/src/com/intellij/openapi/actionSystem/ActionPlaces.java
     * This also allows you to call action that are not enabled (grey and not clickable) at
     * the moment. This could lead to unexpected behaviour. Use with caution
     * @param action The action id
     * @param place The place from where the event is simulated.
     * @param sync If this is set to true the methods blocks while the action is executing.
     */
    action(action: string, place: string, sync: boolean): Promise<void>;
    equals(other: Project): boolean;
}
export declare class VirtualFile {
    protected readonly intellij: IntelliJ;
    readonly url: string;
    constructor(intellij: IntelliJ, vfs_file: string);
    /**
     * Gets whether the file exists
     */
    exists(): Promise<boolean>;
    /**
     * Attempts to delete the file from inside the IDE. This won't be detected
     * as an external change.
     */
    delete(): Promise<void>;
    /**
     * Gets the size of the file in bytes
     */
    size(): Promise<number>;
    /**
     * Checks whether the file is writable
     */
    isWritable(): Promise<boolean>;
    /**
     * Gets the line separator used by the file if any
     */
    lineSeparator(): Promise<string | null>;
    /**
     * Checks whether this IntelliJFile represents a directory
     */
    isDirectory(): Promise<boolean>;
    /**
     * Checks whether this IntelliJFile is a symbolic link
     */
    isSymlink(): Promise<boolean>;
    /**
     * Checks whether this IntelliJFile represents neither a directory nor a special file
     */
    isRegularFile(): Promise<boolean>;
    /**
     * Gets the parent of this IntelliJFile
     */
    parent(): Promise<VirtualFile>;
    /**
     * Sets the text-content of the file. This won't be detected
     * as an external change.
     * @param content The new content
     */
    setTextContent(content: string): Promise<void>;
    /**
     * Sets the binary-content of the file. This won't be detected
     * as an external change.
     * @param content The new content encoded with base64
     */
    setBinaryContent(content: string): Promise<void>;
    /**
     * Gets the text-content of the file.
     */
    getTextContent(): Promise<string>;
    /**
     * Gets the binary-content of the file.
     * @returns The content of the file encoded with base64
     */
    getBinaryContent(): Promise<string>;
    equals(other: VirtualFile): boolean;
}
export declare class RunManager {
    protected readonly intellij: IntelliJ;
    readonly project: Project;
    constructor(intellij: IntelliJ, project: Project);
    /**
     * Gets a run configuration with the given name. If there's no such configuration, the
     * promise is rejected.
     */
    getConfiguration(name: string): Promise<RunConfiguration>;
    /**
     * Gets an array of all run configurations.
     */
    getConfigurations(): Promise<Array<RunConfiguration>>;
    /**
     * Gets the currently selected run configuration.
     */
    getSelected(): Promise<RunConfiguration>;
    /**
     * Gets a type of a run configuration by id. This is something like `gradle`. If there's
     * no such type, the promise is rejected.
     */
    getType(name: string): Promise<RunType>;
    /**
     * Gets an array of all run configuration types.
     */
    getTypes(): Promise<Array<RunType>>;
    /**
     * Gets an array of all run configurations that ore of the given type.
     */
    getConfigurationsOfType(type: RunType): Promise<Array<RunConfiguration>>;
    /**
     * Adds a new run configuration to the project
     * @param name The name of the new configuration
     * @param type The type of the new configuration
     */
    addConfiguration(name: string, type: RunType): Promise<RunConfiguration>;
    equals(other: RunManager): boolean;
}
export declare class RunConfiguration {
    protected readonly intellij: IntelliJ;
    readonly manager: RunManager;
    readonly uid: string;
    constructor(intellij: IntelliJ, manager: RunManager, uid: string);
    /**
     * Gets the type of this run configuration
     */
    getType(): Promise<RunType>;
    /**
     * Deletes this run configuration
     */
    delete(): Promise<void>;
    /**
     * Sets this configuration as the selected one in the drop-down menu
     */
    select(): Promise<void>;
    /**
     * Gets the name of this run configuration
     */
    getName(): Promise<string>;
    /**
     * Checks whether this run configuration is a template
     */
    isTemplate(): Promise<boolean>;
    /**
     * Runs this configuration
     */
    run(): Promise<void>;
    equals(other: RunConfiguration): boolean;
}
export declare class RunType {
    protected readonly intellij: IntelliJ;
    readonly manager: RunManager;
    readonly name: string;
    constructor(intellij: IntelliJ, manager: RunManager, name: string);
    /**
     * Gets the display name of this run configuration type.
     */
    getDisplayName(): Promise<string>;
    /**
     * Gets the description for this run configuration type.
     */
    getDescription(): Promise<string>;
    equals(other: RunType): boolean;
}
export declare class TaskManager {
    protected readonly intellij: IntelliJ;
    readonly project: Project;
    constructor(intellij: IntelliJ, project: Project);
    /**
     * Gets a local task by it's id. To get the id of a task press Ctrl+Q in
     * the `Open Task` menu. Tasks imported from VCS won't be available through
     * this method. They may only be obtained via `getActiveTask()`
     */
    getTask(id: string): Promise<Task>;
    /**
     * Gets an array of all local tasks. Tasks imported from VCS won't be available
     * through this method. They may only be obtained via `getActiveTask()`
     * @param includeClosed Whether to include already completed tasks in th output array
     */
    getTasks(includeClosed: boolean): Promise<Array<Task>>;
    /**
     * Gets the currently active task.
     */
    getActiveTask(): Promise<Task>;
    /**
     * Adds a task with the given name to the project.
     */
    addTask(name: string): Promise<Task>;
    equals(other: TaskManager): boolean;
}
export declare class Task {
    protected readonly intellij: IntelliJ;
    readonly manager: TaskManager;
    readonly id: string;
    constructor(intellij: IntelliJ, manager: TaskManager, id: string);
    /**
     * Gets whether this task is open. That means it's not completed yet.
     */
    isOpen(): Promise<boolean>;
    /**
     * Gets whether this task is active. That means it's currently shown and the
     * user is probably working on it.
     */
    isActive(): Promise<boolean>;
    /**
     * Gets whether this is the default task. The default task can't be deleted.
     */
    isDefault(): Promise<boolean>;
    /**
     * Closes (completes) the task.
     */
    close(): Promise<void>;
    /**
     * Opens (uncompletes) the task.
     */
    reopen(): Promise<void>;
    /**
     * Activates the task.
     * @param clearContext Whether to clear the current context and show the
     * last context used with this task. (Helpful on large projects so you don't
     * need to open all those files again.)
     */
    activate(clearContext: boolean): Promise<void>;
    equals(other: Task): boolean;
}
export declare class PluginManager {
    protected readonly intellij: IntelliJ;
    constructor(intellij: IntelliJ);
    /**
     *  Gets the plugin with the given id. The plugin must be installed but it doesn't
     * need to be enabled.
     */
    getPlugin(id: string): Promise<Plugin>;
    /**
     * Gets an array of all installed plugins
     * @param includeDisabled Whether to include disabled plugins as well
     */
    getPlugins(includeDisabled: boolean): Promise<Array<Plugin>>;
    equals(other: PluginManager): boolean;
}
export declare class Plugin {
    protected readonly intellij: IntelliJ;
    readonly manager: PluginManager;
    readonly id: string;
    constructor(intellij: IntelliJ, manager: PluginManager, id: string);
    /**
     * Gets the name of this plugin
     */
    getName(): Promise<string>;
    /**
     * Gets whether the plugin is enabled
     */
    isEnabled(): Promise<boolean>;
    /**
     * Gets whether the plugin is an official JetBrains plugin
     */
    isJetBrainsPlugin(): Promise<boolean>;
    /**
     * Gets the plugins website or null if none given
     */
    getPluginWebsite(): Promise<string | null>;
    /**
     * Gets the plugins author name or null if none given
     */
    getAuthorName(): Promise<string | null>;
    /**
     * Gets the plugins author email or null if none given
     */
    getAuthorEmail(): Promise<string | null>;
    /**
     * Gets the plugins author website or null if none given
     */
    getAuthorWebsite(): Promise<string | null>;
    /**
     * Gets the plugins description
     */
    getDescription(): Promise<string>;
    /**
     * Gets the plugins changelog
     */
    getChangelog(): Promise<string>;
    /**
     * Gets the installed version of the plugin
     */
    getVersion(): Promise<string>;
    equals(other: Plugin): boolean;
}
export declare class LocalHistory {
    protected readonly intellij: IntelliJ;
    constructor(intellij: IntelliJ);
    /**
     * Gets the first (newest) label with the given name in the local history. If
     * there's no such label, the promise is rejected.
     */
    findLabel(name: string): Promise<HistoryLabel>;
    /**
     * Gets all labels currently in the local history. The most recent label is at
     * the first position of the array.
     */
    getLabels(): Promise<Array<HistoryLabel>>;
    /**
     * Gets all changes currently in the local history. The most recent label is at
     * the first position of the array. A label is considered a change that does not
     * modify any file.
     * @param file If given only changes that affect this file are returned.
     */
    getRecentChanges(file?: VirtualFile): Promise<Array<HistoryChange>>;
    /**
     * Adds a new label to the local history.
     * @param project The project where the label should show up in the history
     * @param name The name of the new label
     * @param color The color of the new label. Set it to -1 or don't specify it for the default.
     */
    addLabel(project: Project, name: string, color?: number): Promise<HistoryLabel>;
    equals(other: LocalHistory): boolean;
}
export declare class HistoryChange {
    protected readonly intellij: IntelliJ;
    readonly history: LocalHistory;
    readonly id: number;
    constructor(intellij: IntelliJ, history: LocalHistory, id: number);
    /**
     * Gets whether this change affects the given file. Be aware that a label (that
     * is as well la change) does not affect any file.
     */
    affects(file: VirtualFile): Promise<boolean>;
    /**
     * Reverts the given file to this change. It only works if the file is tracked
     * by the local history and there's were any changes made to the file since this
     * change was recorded.
     * If you leave out the file every change made since this change was recorded will
     * be reverted on every file one of those changes affected. So you can revert whole
     * projects. The project however does not limit this to one project. IntelliJ just
     * needs to know where to show dialogs if something goes wrong or the user gets asked
     * if write-protected files should really be modified. So be careful with this. You
     * could revert things in currently closed projects and don't even notice about it.
     */
    revert(project: Project, file?: VirtualFile): Promise<void>;
    /**
     * Gets the timestamp when this change was recorded.
     */
    timestamp(): Promise<number>;
    /**
     * Gets the text content of the given file at the time this change was recorded.
     */
    getTextContent(file: VirtualFile): Promise<string>;
    /**
     * Gets the binary content encoded with base64 of the given file at the time this change was recorded.
     */
    getByteContent(file: VirtualFile): Promise<string>;
    equals(other: HistoryChange): boolean;
}
export declare class HistoryLabel extends HistoryChange {
    constructor(intellij: IntelliJ, history: LocalHistory, id: number);
    /**
     * gets the name of the label
     */
    getName(): Promise<string>;
    /**
     * gets the color of the label or -1 if it's the default color.
     */
    getColor(): Promise<number>;
    equals(other: HistoryChange): boolean;
}
//# sourceMappingURL=intellij.d.ts.map