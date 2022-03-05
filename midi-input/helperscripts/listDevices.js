"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const midi = tslib_1.__importStar(require("easymidi"));
const inputs = midi.getInputs();
const outputs = midi.getOutputs();
// This script is executed by itself and not by nodecg.
// Therefore we can't use the nodecg logger and fall back to console.log.
/* eslint-disable no-console */
console.log("Midi Inputs");
inputs.forEach((element) => {
    console.log("    " + element);
});
console.log("Midi Outputs");
outputs.forEach((element) => {
    console.log("    " + element);
});
//# sourceMappingURL=listDevices.js.map