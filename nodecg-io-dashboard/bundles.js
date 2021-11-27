import { __awaiter } from "tslib";
import { updateOptionsArr, updateOptionsMap } from "./utils/selectUtils";
import { config, sendAuthenticatedMessage } from "./crypto";
document.addEventListener("DOMContentLoaded", () => {
    config.onChange(() => {
        renderBundles();
        renderInstanceSelector();
    });
});
// HTML Elements
const selectBundle = document.getElementById("selectBundle");
const selectBundleDepTypes = document.getElementById("selectBundleDepType");
const selectBundleInstance = document.getElementById("selectBundleInstance");
function renderBundles() {
    if (!config.data) {
        return;
    }
    updateOptionsMap(selectBundle, config.data.bundles);
    renderBundleDeps();
}
export function renderBundleDeps() {
    var _a;
    if (!config.data) {
        return;
    }
    const bundle = (_a = selectBundle.options[selectBundle.selectedIndex]) === null || _a === void 0 ? void 0 : _a.value;
    if (bundle === undefined) {
        return;
    }
    const bundleDependencies = config.data.bundles[bundle];
    if (bundleDependencies === undefined) {
        return;
    }
    updateOptionsArr(selectBundleDepTypes, bundleDependencies.map((dep) => dep.serviceType));
    renderInstanceSelector();
}
export function renderInstanceSelector() {
    var _a, _b, _c, _d, _e, _f;
    if (!config.data) {
        return;
    }
    // Rendering options
    const serviceType = (_a = selectBundleDepTypes.options[selectBundleDepTypes.selectedIndex]) === null || _a === void 0 ? void 0 : _a.value;
    const instances = [];
    for (const instName in config.data.instances) {
        if (!Object.prototype.hasOwnProperty.call(config.data.instances, instName)) {
            continue;
        }
        if (((_b = config.data.instances[instName]) === null || _b === void 0 ? void 0 : _b.serviceType) === serviceType) {
            instances.push(instName);
        }
    }
    updateOptionsArr(selectBundleInstance, instances);
    const noneOption = document.createElement("option");
    noneOption.innerText = "none";
    noneOption.value = "none";
    selectBundleInstance.prepend(noneOption);
    // Selecting option of current set instance
    const bundle = (_c = selectBundle.options[selectBundle.selectedIndex]) === null || _c === void 0 ? void 0 : _c.value;
    if (bundle === undefined) {
        return;
    }
    const currentInstance = (_e = (_d = config.data.bundles[bundle]) === null || _d === void 0 ? void 0 : _d.find((dep) => dep.serviceType === serviceType)) === null || _e === void 0 ? void 0 : _e.serviceInstance;
    let index = 0;
    for (let i = 0; i < selectBundleInstance.options.length; i++) {
        if (((_f = selectBundleInstance.options.item(i)) === null || _f === void 0 ? void 0 : _f.value) === currentInstance) {
            index = i;
            break;
        }
    }
    selectBundleInstance.selectedIndex = index;
}
export function setSelectedServiceDependency() {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const bundle = (_a = selectBundle.options[selectBundle.selectedIndex]) === null || _a === void 0 ? void 0 : _a.value;
        const instance = (_b = selectBundleInstance.options[selectBundleInstance.selectedIndex]) === null || _b === void 0 ? void 0 : _b.value;
        const type = (_c = selectBundleDepTypes.options[selectBundleDepTypes.selectedIndex]) === null || _c === void 0 ? void 0 : _c.value;
        if (bundle === undefined || type === undefined) {
            return;
        }
        yield setServiceDependency(bundle, instance === "none" ? undefined : instance, type);
    });
}
export function unsetAllBundleDependencies() {
    var _a;
    const bundles = (_a = config.data) === null || _a === void 0 ? void 0 : _a.bundles;
    if (bundles === undefined) {
        return;
    }
    Object.entries(bundles).forEach(([bundleName, dependencies]) => {
        dependencies.forEach((dep) => setServiceDependency(bundleName, undefined, dep.serviceType));
    });
}
function setServiceDependency(bundle, instance, serviceType) {
    return __awaiter(this, void 0, void 0, function* () {
        const msg = {
            bundleName: bundle,
            instanceName: instance,
            serviceType,
        };
        try {
            yield sendAuthenticatedMessage("setServiceDependency", msg);
        }
        catch (err) {
            nodecg.log.error(err);
        }
    });
}
//# sourceMappingURL=bundles.js.map