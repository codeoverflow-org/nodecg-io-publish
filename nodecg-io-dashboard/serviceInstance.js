import { __awaiter } from "tslib";
import * as monaco from "monaco-editor";
import { updateOptionsArr, updateOptionsMap } from "./utils/selectUtils";
import { objectDeepCopy } from "./utils/deepCopy";
import { config, sendAuthenticatedMessage } from "./crypto";
const editorDefaultText = "<---- Select a service instance to start editing it in here";
const editorCreateText = "<---- Create a new service instance on the left and then you can edit it in here";
const editorInvalidServiceText = "!!!!! Service of this instance couldn't be found.";
const editorNotConfigurableText = "----- This service cannot be configured.";
document.addEventListener("DOMContentLoaded", () => {
    config.onChange(() => {
        renderServices();
        renderInstances();
    });
});
// Inputs
const selectInstance = document.getElementById("selectInstance");
const selectService = document.getElementById("selectService");
const selectPreset = document.getElementById("selectPreset");
const inputInstanceName = document.getElementById("inputInstanceName");
// Website areas
const instanceServiceSelector = document.getElementById("instanceServiceSelector");
const instancePreset = document.getElementById("instancePreset");
const instanceNameField = document.getElementById("instanceNameField");
const instanceEditButtons = document.getElementById("instanceEditButtons");
const instanceCreateButton = document.getElementById("instanceCreateButton");
const instanceMonaco = document.getElementById("instanceMonaco");
if (instanceMonaco === null) {
    throw new Error("Couldn't find instanceMonaco");
}
const editor = monaco.editor.create(instanceMonaco, {
    theme: "vs-dark",
});
const spanInstanceNotice = document.getElementById("spanInstanceNotice");
const buttonSave = document.getElementById("buttonSave");
// HTML Handlers
window.addEventListener("resize", () => {
    updateMonacoLayout();
});
export function updateMonacoLayout() {
    editor === null || editor === void 0 ? void 0 : editor.layout();
}
// Instance drop-down
export function onInstanceSelectChange(value) {
    showNotice(undefined);
    switch (value) {
        case "new":
            showInMonaco(true, editorCreateText);
            setCreateInputs(true, false, true, false);
            inputInstanceName.value = "";
            break;
        case "select":
            showInMonaco(true, editorDefaultText);
            setCreateInputs(false, false, true, false);
            break;
        default:
            showConfig(value);
    }
}
function showConfig(instName) {
    var _a, _b, _c, _d;
    const inst = (_a = config.data) === null || _a === void 0 ? void 0 : _a.instances[instName];
    const service = (_b = config.data) === null || _b === void 0 ? void 0 : _b.services.find((svc) => svc.serviceType === (inst === null || inst === void 0 ? void 0 : inst.serviceType));
    if (!service) {
        showInMonaco(true, editorInvalidServiceText);
    }
    else if (service.requiresNoConfig) {
        showInMonaco(true, editorNotConfigurableText);
    }
    else {
        showInMonaco(false, (_c = inst === null || inst === void 0 ? void 0 : inst.config) !== null && _c !== void 0 ? _c : {}, service === null || service === void 0 ? void 0 : service.schema);
    }
    setCreateInputs(false, true, !((_d = service === null || service === void 0 ? void 0 : service.requiresNoConfig) !== null && _d !== void 0 ? _d : false), (service === null || service === void 0 ? void 0 : service.presets) !== undefined);
    if (service === null || service === void 0 ? void 0 : service.presets) {
        renderPresets(service.presets);
    }
}
// Preset drop-down
export function selectInstanceConfigPreset() {
    var _a, _b, _c, _d, _e, _f;
    const selectedPresetName = (_a = selectPreset.options[selectPreset.selectedIndex]) === null || _a === void 0 ? void 0 : _a.value;
    if (!selectedPresetName) {
        return;
    }
    const instName = (_b = selectInstance.options[selectInstance.selectedIndex]) === null || _b === void 0 ? void 0 : _b.value;
    if (!instName) {
        return;
    }
    const instance = (_c = config.data) === null || _c === void 0 ? void 0 : _c.instances[instName];
    if (!instance) {
        return;
    }
    const service = (_d = config.data) === null || _d === void 0 ? void 0 : _d.services.find((svc) => svc.serviceType === instance.serviceType);
    const presetValue = (_f = (_e = service === null || service === void 0 ? void 0 : service.presets) === null || _e === void 0 ? void 0 : _e[selectedPresetName]) !== null && _f !== void 0 ? _f : {};
    showInMonaco(false, presetValue, service === null || service === void 0 ? void 0 : service.schema);
}
// Save button
export function saveInstanceConfig() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (editor === undefined) {
            return;
        }
        showNotice(undefined);
        try {
            const instName = (_a = selectInstance.options[selectInstance.selectedIndex]) === null || _a === void 0 ? void 0 : _a.value;
            const config = JSON.parse(editor.getValue());
            const msg = {
                config: config,
                instanceName: instName,
            };
            showNotice("Saving...");
            yield sendAuthenticatedMessage("updateInstanceConfig", msg);
            showNotice("Successfully saved.");
        }
        catch (err) {
            nodecg.log.error(`Couldn't save instance config: ${err}`);
            showNotice(String(err));
        }
    });
}
// Delete button
export function deleteInstance() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const msg = {
            instanceName: (_a = selectInstance.options[selectInstance.selectedIndex]) === null || _a === void 0 ? void 0 : _a.value,
        };
        const deleted = yield sendAuthenticatedMessage("deleteServiceInstance", msg);
        if (deleted) {
            selectServiceInstance("select");
        }
        else {
            nodecg.log.info(`Couldn't delete the instance "${msg.instanceName}" for some reason, please check the nodecg log`);
        }
    });
}
// Create button
export function createInstance() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        showNotice(undefined);
        const service = (_a = selectService.options[selectService.options.selectedIndex]) === null || _a === void 0 ? void 0 : _a.value;
        const name = inputInstanceName.value;
        const msg = {
            serviceType: service,
            instanceName: name,
        };
        try {
            yield sendAuthenticatedMessage("createServiceInstance", msg);
        }
        catch (e) {
            showNotice(String(e));
            return;
        }
        // Give the browser some time to create the new instance select option and to add them to the DOM
        setTimeout(() => {
            selectServiceInstance(name);
        }, 250);
    });
}
// Render functions of Replicants
function renderServices() {
    if (!config.data) {
        return;
    }
    updateOptionsArr(selectService, config.data.services.map((svc) => svc.serviceType));
}
function renderInstances() {
    var _a;
    if (!config.data) {
        return;
    }
    const previousSelected = ((_a = selectInstance.options[selectInstance.selectedIndex]) === null || _a === void 0 ? void 0 : _a.value) || "select";
    // Render instances
    updateOptionsMap(selectInstance, config.data.instances);
    // Add new and select options
    const selectOption = document.createElement("option");
    selectOption.innerText = "Select...";
    selectOption.value = "select";
    selectInstance.prepend(selectOption);
    const newOption = document.createElement("option");
    newOption.innerText = "New...";
    newOption.value = "new";
    selectInstance.options.add(newOption);
    // Restore previous selection
    selectServiceInstance(previousSelected);
}
function renderPresets(presets) {
    updateOptionsMap(selectPreset, presets);
    // Add "Select..." element that hints the user that he can use this select box
    // to choose a preset
    const selectHintOption = document.createElement("option");
    selectHintOption.innerText = "Select...";
    selectPreset.prepend(selectHintOption);
    selectPreset.selectedIndex = 0; // Select newly added hint
}
// Util functions
function selectServiceInstance(instanceName) {
    for (let i = 0; i < selectInstance.options.length; i++) {
        const opt = selectInstance.options[i];
        if ((opt === null || opt === void 0 ? void 0 : opt.value) === instanceName) {
            // If already selected a re-render monaco is not needed
            if (selectInstance.selectedIndex !== i) {
                selectInstance.selectedIndex = i;
                onInstanceSelectChange(instanceName);
            }
            break;
        }
    }
}
// Hides/unhides parts of the website based on the passed parameters
function setCreateInputs(createMode, instanceSelected, showSave, serviceHasPresets) {
    function setVisible(node, visible) {
        if (visible && (node === null || node === void 0 ? void 0 : node.classList.contains("hidden"))) {
            node === null || node === void 0 ? void 0 : node.classList.remove("hidden");
        }
        else if (!visible && !(node === null || node === void 0 ? void 0 : node.classList.contains("hidden"))) {
            node === null || node === void 0 ? void 0 : node.classList.add("hidden");
        }
    }
    setVisible(instanceEditButtons, !createMode && instanceSelected);
    setVisible(instancePreset, !createMode && instanceSelected && serviceHasPresets);
    setVisible(instanceCreateButton, createMode);
    setVisible(instanceNameField, createMode);
    setVisible(instanceServiceSelector, createMode);
    setVisible(buttonSave, showSave);
}
export function showNotice(msg) {
    if (spanInstanceNotice !== null) {
        spanInstanceNotice.innerText = msg !== undefined ? msg : "";
    }
}
function showInMonaco(readOnly, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
content, schema) {
    editor === null || editor === void 0 ? void 0 : editor.updateOptions({ readOnly });
    const type = typeof content === "object" ? "json" : "text";
    const contentStr = typeof content === "object" ? JSON.stringify(content, null, 4) : content;
    // JSON Schema stuff
    // Get rid of old models, as they have to be unique and we may add the same again
    monaco.editor.getModels().forEach((m) => m.dispose());
    // This model uri can be completely made up as long the uri in the schema matches with the one in the language model.
    const modelUri = monaco.Uri.parse(`mem://nodecg-io/selectedServiceSchema.json`);
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions(schema
        ? {
            validate: true,
            schemas: [
                {
                    uri: modelUri.toString(),
                    fileMatch: [modelUri.toString()],
                    schema: objectDeepCopy(schema),
                },
            ],
        }
        : {
            validate: false,
            schemas: [],
        });
    editor === null || editor === void 0 ? void 0 : editor.setModel(monaco.editor.createModel(contentStr, type, schema ? modelUri : undefined));
}
//# sourceMappingURL=serviceInstance.js.map