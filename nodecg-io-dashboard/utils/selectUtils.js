export function updateOptionsMap(node, options) {
    updateOptionsArr(node, Object.keys(options));
}
export function updateOptionsArr(node, options) {
    var _a;
    const previouslySelected = (_a = node.options[node.selectedIndex]) === null || _a === void 0 ? void 0 : _a.value;
    // Remove all children.
    node.innerHTML = "";
    options.sort().forEach((optStr, i) => {
        const opt = document.createElement("option");
        opt.value = optStr;
        opt.innerText = optStr;
        node.options.add(opt);
        // Try to reselect the previously selected item
        if (optStr === previouslySelected) {
            node.selectedIndex = i;
        }
    });
}
//# sourceMappingURL=selectUtils.js.map