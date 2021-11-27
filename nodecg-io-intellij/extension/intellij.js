"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryLabel = exports.HistoryChange = exports.LocalHistory = exports.Plugin = exports.PluginManager = exports.Task = exports.TaskManager = exports.RunType = exports.RunConfiguration = exports.RunManager = exports.VirtualFile = exports.Project = exports.IntelliJ = void 0;
const tslib_1 = require("tslib");
const node_fetch_1 = (0, tslib_1.__importDefault)(require("node-fetch"));
class IntelliJ {
    constructor(address) {
        // Check if protocol is defined and default to http if missing
        if (address === null || address === void 0 ? void 0 : address.includes("://")) {
            this.address = address;
        }
        else {
            this.address = `http://${address !== null && address !== void 0 ? address : "127.0.0.1:19524"}`;
        }
        this.pluginManager = new PluginManager(this);
        this.localHistory = new LocalHistory(this);
    }
    /**
     * Gets the PID of the IntelliJ process
     */
    async getPid() {
        return await this.rawRequest("get_pid", {});
    }
    /**
     * Gets the currently active Project with the given name. The Project must
     * be opened and it's window must hav the focus. If no project is found
     * or open, the promise is rejected.
     */
    async getActiveProject() {
        const result = await this.rawRequest("get_project", { project: null });
        if (result !== null) {
            return new Project(this, result);
        }
        else {
            throw new Error("No project active");
        }
    }
    /**
     * Gets the IntelliJ-Project with the given name. The Project must be opened. If
     * the project is not found or not open, the promise is rejected.
     */
    async getProject(projectName) {
        const result = await this.rawRequest("get_project", { project: projectName });
        if (result !== null) {
            return new Project(this, result);
        }
        else {
            throw new Error("Project not found");
        }
    }
    /**
     * Gets the given URL as an IntelliJFile. If the file is not found, the promise is
     * rejected.
     */
    async getFile(url) {
        const result = await this.rawRequest("vfs_get_by_url", { url: url });
        if (result !== null) {
            return new VirtualFile(this, result);
        }
        else {
            throw new Error("File not found");
        }
    }
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
    async action(action, place, sync) {
        await this.rawRequest("run_action", {
            action: action,
            place: place,
            sync: sync,
            project: null,
        });
    }
    /**
     * Makes a raw request to IntelliJ
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async rawRequest(method, data) {
        const response = await (0, node_fetch_1.default)(this.address, {
            method: "POST",
            body: JSON.stringify({
                method: method,
                data: data,
            }),
        });
        const json = await response.json();
        if (json.success) {
            return json.data;
        }
        else if ("data" in json && "error_msg" in json.data) {
            throw new Error(json.data.error_msg);
        }
        else {
            throw new Error("unknown");
        }
    }
    equals(other) {
        return this.address === other.address;
    }
}
exports.IntelliJ = IntelliJ;
class Project {
    constructor(intellij, name) {
        this.intellij = intellij;
        this.name = name;
        this.runManager = new RunManager(intellij, this);
        this.taskManager = new TaskManager(intellij, this);
    }
    /**
     * Gets the currently open file. If there are multiple files open (split screen), the
     * first one is returned. If there are no files open, the promise is rejected.
     */
    async getOpenEditorFile() {
        const result = await this.intellij.rawRequest("get_open_editor_file", { project: this.name });
        if (result !== null) {
            return new VirtualFile(this.intellij, result);
        }
        else {
            throw new Error("File not found");
        }
    }
    /**
     * Checks whether the project is still valid. A project is no longer  valid if it was closed.
     */
    async isValid() {
        return await this.intellij.rawRequest("is_project_valid", { project: this.name });
    }
    /**
     * Same as `isValid()` but the promise is rejected if the project is not valid any longer.
     */
    async ensureValid() {
        const result = await this.intellij.rawRequest("is_project_valid", { project: this.name });
        if (!result) {
            throw new Error("Project is no longer valid");
        }
    }
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
    async action(action, place, sync) {
        await this.intellij.rawRequest("run_action", {
            action: action,
            place: place,
            sync: sync,
            project: this.name,
        });
    }
    equals(other) {
        return this.intellij.equals(other.intellij) && this.name === other.name;
    }
}
exports.Project = Project;
class VirtualFile {
    constructor(intellij, vfs_file) {
        this.intellij = intellij;
        this.url = vfs_file;
    }
    /**
     * Gets whether the file exists
     */
    async exists() {
        return await this.intellij.rawRequest("vfs_exists", { vfs_file: this.url });
    }
    /**
     * Attempts to delete the file from inside the IDE. This won't be detected
     * as an external change.
     */
    async delete() {
        await this.intellij.rawRequest("vfs_delete", { vfs_file: this.url });
    }
    /**
     * Gets the size of the file in bytes
     */
    async size() {
        return await this.intellij.rawRequest("vfs_size", { vfs_file: this.url });
    }
    /**
     * Checks whether the file is writable
     */
    async isWritable() {
        return await this.intellij.rawRequest("vfs_writable", { vfs_file: this.url });
    }
    /**
     * Gets the line separator used by the file if any
     */
    async lineSeparator() {
        return await this.intellij.rawRequest("vfs_line_sep", { vfs_file: this.url });
    }
    /**
     * Checks whether this IntelliJFile represents a directory
     */
    async isDirectory() {
        return await this.intellij.rawRequest("vfs_directory", { vfs_file: this.url });
    }
    /**
     * Checks whether this IntelliJFile is a symbolic link
     */
    async isSymlink() {
        return await this.intellij.rawRequest("vfs_symlink", { vfs_file: this.url });
    }
    /**
     * Checks whether this IntelliJFile represents neither a directory nor a special file
     */
    async isRegularFile() {
        return await this.intellij.rawRequest("vfs_regular", { vfs_file: this.url });
    }
    /**
     * Gets the parent of this IntelliJFile
     */
    async parent() {
        const new_vfs = await this.intellij.rawRequest("vfs_parent", { vfs_file: this.url });
        return new VirtualFile(this.intellij, new_vfs);
    }
    /**
     * Sets the text-content of the file. This won't be detected
     * as an external change.
     * @param content The new content
     */
    async setTextContent(content) {
        await this.intellij.rawRequest("vfs_set_content_text", {
            vfs_file: this.url,
            content: content,
        });
    }
    /**
     * Sets the binary-content of the file. This won't be detected
     * as an external change.
     * @param content The new content encoded with base64
     */
    async setBinaryContent(content) {
        await this.intellij.rawRequest("vfs_set_content_bytes", {
            vfs_file: this.url,
            content: content,
        });
    }
    /**
     * Gets the text-content of the file.
     */
    async getTextContent() {
        return await this.intellij.rawRequest("vfs_get_content_text", { vfs_file: this.url });
    }
    /**
     * Gets the binary-content of the file.
     * @returns The content of the file encoded with base64
     */
    async getBinaryContent() {
        return await this.intellij.rawRequest("vfs_get_content_bytes", { vfs_file: this.url });
    }
    equals(other) {
        return this.intellij.equals(other.intellij) && this.url === other.url;
    }
}
exports.VirtualFile = VirtualFile;
class RunManager {
    constructor(intellij, project) {
        this.intellij = intellij;
        this.project = project;
    }
    /**
     * Gets a run configuration with the given name. If there's no such configuration, the
     * promise is rejected.
     */
    async getConfiguration(name) {
        const result = await this.intellij.rawRequest("run_get_configuration", {
            project: this.project.name,
            configuration: name,
        });
        if (result !== null) {
            return new RunConfiguration(this.intellij, this, result);
        }
        else {
            throw new Error("Configuration not found");
        }
    }
    /**
     * Gets an array of all run configurations.
     */
    async getConfigurations() {
        const result = await this.intellij.rawRequest("run_get_configurations", { project: this.project.name });
        return result.map((value) => {
            return new RunConfiguration(this.intellij, this, value);
        });
    }
    /**
     * Gets the currently selected run configuration.
     */
    async getSelected() {
        const result = await this.intellij.rawRequest("run_get_selected", { project: this.project.name });
        if (result !== null) {
            return new RunConfiguration(this.intellij, this, result);
        }
        else {
            throw new Error("No configuration selected");
        }
    }
    /**
     * Gets a type of a run configuration by id. This is something like `gradle`. If there's
     * no such type, the promise is rejected.
     */
    async getType(name) {
        const result = await this.intellij.rawRequest("run_get_type", {
            project: this.project.name,
            type: name,
        });
        if (result !== null) {
            return new RunType(this.intellij, this, result);
        }
        else {
            throw new Error("Configuration-Type not found");
        }
    }
    /**
     * Gets an array of all run configuration types.
     */
    async getTypes() {
        const result = await this.intellij.rawRequest("run_get_types", {
            project: this.project.name,
        });
        return result.map((value) => {
            return new RunType(this.intellij, this, value);
        });
    }
    /**
     * Gets an array of all run configurations that ore of the given type.
     */
    async getConfigurationsOfType(type) {
        const result = await this.intellij.rawRequest("run_get_configurations_of_type", {
            project: this.project.name,
            type: type.name,
        });
        return result.map((value) => {
            return new RunConfiguration(this.intellij, this, value);
        });
    }
    /**
     * Adds a new run configuration to the project
     * @param name The name of the new configuration
     * @param type The type of the new configuration
     */
    async addConfiguration(name, type) {
        const result = await this.intellij.rawRequest("run_add_configuration", {
            project: this.project.name,
            type: type.name,
            name: name,
        });
        return new RunConfiguration(this.intellij, this, result);
    }
    equals(other) {
        return this.project.equals(other.project);
    }
}
exports.RunManager = RunManager;
class RunConfiguration {
    constructor(intellij, manager, uid) {
        this.intellij = intellij;
        this.manager = manager;
        this.uid = uid;
    }
    /**
     * Gets the type of this run configuration
     */
    async getType() {
        const result = await this.intellij.rawRequest("run_get_type_from_configuration", {
            project: this.manager.project.name,
            configuration: this.uid,
        });
        return new RunType(this.intellij, this.manager, result);
    }
    /**
     * Deletes this run configuration
     */
    async delete() {
        await this.intellij.rawRequest("run_remove_configuration", {
            project: this.manager.project.name,
            configuration: this.uid,
        });
    }
    /**
     * Sets this configuration as the selected one in the drop-down menu
     */
    async select() {
        await this.intellij.rawRequest("run_select_configuration", {
            project: this.manager.project.name,
            configuration: this.uid,
        });
    }
    /**
     * Gets the name of this run configuration
     */
    async getName() {
        return await this.intellij.rawRequest("run_get_configuration_name", {
            project: this.manager.project.name,
            configuration: this.uid,
        });
    }
    /**
     * Checks whether this run configuration is a template
     */
    async isTemplate() {
        return await this.intellij.rawRequest("run_get_configuration_is_template", {
            project: this.manager.project.name,
            configuration: this.uid,
        });
    }
    /**
     * Runs this configuration
     */
    async run() {
        await this.intellij.rawRequest("run_start_configuration", {
            project: this.manager.project.name,
            configuration: this.uid,
        });
    }
    equals(other) {
        return this.manager.equals(other.manager) && this.uid === other.uid;
    }
}
exports.RunConfiguration = RunConfiguration;
class RunType {
    constructor(intellij, manager, name) {
        this.intellij = intellij;
        this.manager = manager;
        this.name = name;
    }
    /**
     * Gets the display name of this run configuration type.
     */
    async getDisplayName() {
        return await this.intellij.rawRequest("run_get_type_name", {
            project: this.manager.project.name,
            type: this.name,
        });
    }
    /**
     * Gets the description for this run configuration type.
     */
    async getDescription() {
        return await this.intellij.rawRequest("run_get_type_description", {
            project: this.manager.project.name,
            type: this.name,
        });
    }
    equals(other) {
        return this.manager.equals(other.manager) && this.name === other.name;
    }
}
exports.RunType = RunType;
class TaskManager {
    constructor(intellij, project) {
        this.intellij = intellij;
        this.project = project;
    }
    /**
     * Gets a local task by it's id. To get the id of a task press Ctrl+Q in
     * the `Open Task` menu. Tasks imported from VCS won't be available through
     * this method. They may only be obtained via `getActiveTask()`
     */
    async getTask(id) {
        const result = await this.intellij.rawRequest("tasks_get", {
            project: this.project.name,
            task: id,
        });
        if (result !== null) {
            return new Task(this.intellij, this, result);
        }
        else {
            throw new Error("Task not found");
        }
    }
    /**
     * Gets an array of all local tasks. Tasks imported from VCS won't be available
     * through this method. They may only be obtained via `getActiveTask()`
     * @param includeClosed Whether to include already completed tasks in th output array
     */
    async getTasks(includeClosed) {
        const result = await this.intellij.rawRequest("tasks_get_all", {
            project: this.project.name,
            include_completed: includeClosed,
        });
        return result.map((value) => {
            return new Task(this.intellij, this, value);
        });
    }
    /**
     * Gets the currently active task.
     */
    async getActiveTask() {
        const result = await this.intellij.rawRequest("tasks_get_active", { project: this.project.name });
        return new Task(this.intellij, this, result);
    }
    /**
     * Adds a task with the given name to the project.
     */
    async addTask(name) {
        const result = await this.intellij.rawRequest("tasks_add", {
            project: this.project.name,
            summary: name,
        });
        return new Task(this.intellij, this, result);
    }
    equals(other) {
        return this.project.equals(other.project);
    }
}
exports.TaskManager = TaskManager;
class Task {
    constructor(intellij, manager, id) {
        this.intellij = intellij;
        this.manager = manager;
        this.id = id;
    }
    /**
     * Gets whether this task is open. That means it's not completed yet.
     */
    async isOpen() {
        return await this.intellij.rawRequest("tasks_is_open", {
            project: this.manager.project.name,
            task: this.id,
        });
    }
    /**
     * Gets whether this task is active. That means it's currently shown and the
     * user is probably working on it.
     */
    async isActive() {
        return await this.intellij.rawRequest("tasks_is_active", {
            project: this.manager.project.name,
            task: this.id,
        });
    }
    /**
     * Gets whether this is the default task. The default task can't be deleted.
     */
    async isDefault() {
        return await this.intellij.rawRequest("tasks_is_default", {
            project: this.manager.project.name,
            task: this.id,
        });
    }
    /**
     * Closes (completes) the task.
     */
    async close() {
        await this.intellij.rawRequest("tasks_close", {
            project: this.manager.project.name,
            task: this.id,
        });
    }
    /**
     * Opens (uncompletes) the task.
     */
    async reopen() {
        await this.intellij.rawRequest("tasks_reopen", {
            project: this.manager.project.name,
            task: this.id,
        });
    }
    /**
     * Activates the task.
     * @param clearContext Whether to clear the current context and show the
     * last context used with this task. (Helpful on large projects so you don't
     * need to open all those files again.)
     */
    async activate(clearContext) {
        await this.intellij.rawRequest("tasks_activate", {
            project: this.manager.project.name,
            task: this.id,
            clear_context: clearContext,
        });
    }
    equals(other) {
        return this.manager.equals(other.manager) && this.id === other.id;
    }
}
exports.Task = Task;
class PluginManager {
    constructor(intellij) {
        this.intellij = intellij;
    }
    /**
     *  Gets the plugin with the given id. The plugin must be installed but it doesn't
     * need to be enabled.
     */
    async getPlugin(id) {
        const result = await this.intellij.rawRequest("plugin_get", {
            plugin_id: id,
        });
        if (result !== null) {
            return new Plugin(this.intellij, this, result);
        }
        else {
            throw new Error("Plugin not found");
        }
    }
    /**
     * Gets an array of all installed plugins
     * @param includeDisabled Whether to include disabled plugins as well
     */
    async getPlugins(includeDisabled) {
        const result = await this.intellij.rawRequest("plugin_get_all", {
            include_disabled: includeDisabled,
        });
        return result.map((value) => {
            return new Plugin(this.intellij, this, value);
        });
    }
    equals(other) {
        return this.intellij.equals(other.intellij);
    }
}
exports.PluginManager = PluginManager;
class Plugin {
    constructor(intellij, manager, id) {
        this.intellij = intellij;
        this.manager = manager;
        this.id = id;
    }
    /**
     * Gets the name of this plugin
     */
    async getName() {
        return await this.intellij.rawRequest("plugin_name", { plugin_id: this.id });
    }
    /**
     * Gets whether the plugin is enabled
     */
    async isEnabled() {
        return await this.intellij.rawRequest("plugin_enabled", { plugin_id: this.id });
    }
    /**
     * Gets whether the plugin is an official JetBrains plugin
     */
    async isJetBrainsPlugin() {
        return await this.intellij.rawRequest("plugin_is_jb", { plugin_id: this.id });
    }
    /**
     * Gets the plugins website or null if none given
     */
    async getPluginWebsite() {
        return await this.intellij.rawRequest("plugin_get_website", { plugin_id: this.id });
    }
    /**
     * Gets the plugins author name or null if none given
     */
    async getAuthorName() {
        return await this.intellij.rawRequest("plugin_get_author_name", { plugin_id: this.id });
    }
    /**
     * Gets the plugins author email or null if none given
     */
    async getAuthorEmail() {
        return await this.intellij.rawRequest("plugin_get_author_email", { plugin_id: this.id });
    }
    /**
     * Gets the plugins author website or null if none given
     */
    async getAuthorWebsite() {
        return await this.intellij.rawRequest("plugin_get_author_website", { plugin_id: this.id });
    }
    /**
     * Gets the plugins description
     */
    async getDescription() {
        const result = await this.intellij.rawRequest("plugin_get_description", { plugin_id: this.id });
        if (result === null) {
            throw new Error("No description available");
        }
        else {
            return result;
        }
    }
    /**
     * Gets the plugins changelog
     */
    async getChangelog() {
        const result = await this.intellij.rawRequest("plugin_get_changelog", { plugin_id: this.id });
        if (result === null) {
            throw new Error("No changelog available");
        }
        else {
            return result;
        }
    }
    /**
     * Gets the installed version of the plugin
     */
    async getVersion() {
        const result = await this.intellij.rawRequest("plugin_get_version", { plugin_id: this.id });
        if (result === null) {
            throw new Error("No version available");
        }
        else {
            return result;
        }
    }
    equals(other) {
        return this.manager.equals(other.manager) && this.id === other.id;
    }
}
exports.Plugin = Plugin;
class LocalHistory {
    constructor(intellij) {
        this.intellij = intellij;
    }
    /**
     * Gets the first (newest) label with the given name in the local history. If
     * there's no such label, the promise is rejected.
     */
    async findLabel(name) {
        const result = await this.intellij.rawRequest("lh_find_label", { label: name });
        return new HistoryLabel(this.intellij, this, result);
    }
    /**
     * Gets all labels currently in the local history. The most recent label is at
     * the first position of the array.
     */
    async getLabels() {
        const result = await this.intellij.rawRequest("lh_get_labels", {});
        return result.map((value) => {
            return new HistoryLabel(this.intellij, this, value);
        });
    }
    /**
     * Gets all changes currently in the local history. The most recent label is at
     * the first position of the array. A label is considered a change that does not
     * modify any file.
     * @param file If given only changes that affect this file are returned.
     */
    async getRecentChanges(file) {
        if (file === undefined) {
            const result = await this.intellij.rawRequest("lh_get_changes", { vfs_file: null });
            return result.map((value) => {
                return new HistoryChange(this.intellij, this, value);
            });
        }
        else {
            const result = await this.intellij.rawRequest("lh_get_changes", { vfs_file: file.url });
            return result.map((value) => {
                return new HistoryChange(this.intellij, this, value);
            });
        }
    }
    /**
     * Adds a new label to the local history.
     * @param project The project where the label should show up in the history
     * @param name The name of the new label
     * @param color The color of the new label. Set it to -1 or don't specify it for the default.
     */
    async addLabel(project, name, color = -1) {
        const result = await this.intellij.rawRequest("lh_add_label", {
            project: project.name,
            label: name,
            color: color,
        });
        return new HistoryLabel(this.intellij, this, result);
    }
    equals(other) {
        return this.intellij.equals(other.intellij);
    }
}
exports.LocalHistory = LocalHistory;
class HistoryChange {
    constructor(intellij, history, id) {
        this.intellij = intellij;
        this.history = history;
        this.id = id;
    }
    /**
     * Gets whether this change affects the given file. Be aware that a label (that
     * is as well la change) does not affect any file.
     */
    async affects(file) {
        return await this.intellij.rawRequest("lh_change_affects", {
            change_id: this.id,
            vfs_file: file.url,
        });
    }
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
    async revert(project, file) {
        if (file === undefined) {
            await this.intellij.rawRequest("lh_change_revert", {
                project: project.name,
                change_id: this.id,
                vfs_file: null,
            });
        }
        else {
            await this.intellij.rawRequest("lh_change_revert", {
                project: project.name,
                change_id: this.id,
                vfs_file: file.url,
            });
        }
    }
    /**
     * Gets the timestamp when this change was recorded.
     */
    async timestamp() {
        return await this.intellij.rawRequest("lh_change_timestamp", { change_id: this.id });
    }
    /**
     * Gets the text content of the given file at the time this change was recorded.
     */
    async getTextContent(file) {
        return await this.intellij.rawRequest("lh_change_text", {
            change_id: this.id,
            vfs_file: file.url,
        });
    }
    /**
     * Gets the binary content encoded with base64 of the given file at the time this change was recorded.
     */
    async getByteContent(file) {
        return await this.intellij.rawRequest("lh_change_bytes", {
            change_id: this.id,
            vfs_file: file.url,
        });
    }
    equals(other) {
        return this.history.equals(other.history) && this.id === other.id;
    }
}
exports.HistoryChange = HistoryChange;
class HistoryLabel extends HistoryChange {
    constructor(intellij, history, id) {
        super(intellij, history, id);
    }
    /**
     * gets the name of the label
     */
    async getName() {
        return await super.intellij.rawRequest("lh_label_name", { change_id: this.id });
    }
    /**
     * gets the color of the label or -1 if it's the default color.
     */
    async getColor() {
        return await this.intellij.rawRequest("lh_label_color", { change_id: this.id });
    }
    equals(other) {
        return this.history.equals(other.history) && this.id === other.id;
    }
}
exports.HistoryLabel = HistoryLabel;
//# sourceMappingURL=intellij.js.map