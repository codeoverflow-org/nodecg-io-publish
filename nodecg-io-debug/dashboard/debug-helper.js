"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/// <reference types="nodecg-types/types/browser" />
const monaco = (0, tslib_1.__importStar)(require("monaco-editor"));
// Buttons
for (let i = 1; i <= 5; i++) {
    setHandler(`#click_button${i}`, "onclick", () => {
        nodecg.sendMessage("onClick", i);
    });
}
// Numbers
for (let i = 0; i < 5; i++) {
    const num = 10 ** i;
    setHandler(`#number_button${num}`, "onclick", () => {
        nodecg.sendMessage("onNumber", num);
    });
}
setHandler("#number_input1_send", "onclick", () => {
    var _a;
    const num = (_a = document.querySelector("#number_input1")) === null || _a === void 0 ? void 0 : _a.value;
    nodecg.sendMessage("onNumber", num);
});
setHandler("#number_input2", "onchange", () => {
    var _a;
    const num = (_a = document.querySelector("#number_input2")) === null || _a === void 0 ? void 0 : _a.value;
    nodecg.sendMessage("onNumber", num);
});
// Ranges
for (const range of ["0to100", "0to1", "M1to1"]) {
    const selector = "#range_" + range;
    (_a = document.querySelector(selector)) === null || _a === void 0 ? void 0 : _a.addEventListener("change", () => {
        var _a;
        const num = (_a = document.querySelector(selector)) === null || _a === void 0 ? void 0 : _a.value;
        nodecg.sendMessage(`onRange${range}`, num);
    });
}
// Color
(_b = document.querySelector("#color_color")) === null || _b === void 0 ? void 0 : _b.addEventListener("input", () => {
    var _a;
    const color = (_a = document.querySelector("#color_color")) === null || _a === void 0 ? void 0 : _a.value;
    nodecg.sendMessage(`onColor`, color);
});
// Dates
for (const element of ["#date_date", "#date_datetime"]) {
    (_c = document.querySelector(element)) === null || _c === void 0 ? void 0 : _c.addEventListener("change", () => {
        var _a;
        const date = (_a = document.querySelector(element)) === null || _a === void 0 ? void 0 : _a.value;
        nodecg.sendMessage(`onDate`, date);
    });
}
// Booleans
setHandler("#bool_false", "onclick", () => {
    nodecg.sendMessage("onBool", false);
});
setHandler("#bool_true", "onclick", () => {
    nodecg.sendMessage("onBool", true);
});
// Text
for (const element of ["oneline", "multiline"]) {
    setHandler(`#text_${element}_send`, "onclick", () => {
        var _a;
        const value = (_a = document.querySelector(`#text_${element}`)) === null || _a === void 0 ? void 0 : _a.value;
        nodecg.sendMessage("onText", value);
    });
}
// Lists
setHandler("#list_list_send", "onclick", () => {
    var _a;
    const value = (_a = document.querySelector("#list_list")) === null || _a === void 0 ? void 0 : _a.value;
    nodecg.sendMessage("onList", value);
});
// JSON
const instanceMonaco = document.getElementById("instanceMonaco");
if (instanceMonaco === null) {
    throw new Error("Could not find instanceMonaco");
}
const jsonCode = JSON.stringify({ data: 42 }, null, 4);
const model = monaco.editor.createModel(jsonCode, "json");
const debugMonacoEditor = monaco.editor.create(instanceMonaco, {
    model: model,
    theme: "vs-dark",
});
window.addEventListener("resize", () => debugMonacoEditor.layout());
setHandler("#json_send", "onclick", () => {
    const jsonString = debugMonacoEditor.getValue();
    try {
        const json = JSON.parse(jsonString);
        nodecg.sendMessage("onJSON", json);
    }
    catch (e) {
        nodecg.log.error(`Cannot send invalid json: ${e}`);
    }
});
// Util functions
function setHandler(querySelector, type, fn) {
    const element = document.querySelector(querySelector);
    if (!element) {
        nodecg.log.error(`Cannot set handler for element with this query selector: ${querySelector}`);
        return;
    }
    element[type] = fn;
}
//# sourceMappingURL=debug-helper.js.map