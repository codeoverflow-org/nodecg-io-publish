"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("midi-io sample bundle started");
    const inputService = (0, nodecg_io_core_1.requireService)(nodecg, "midi-input");
    const outputService = (0, nodecg_io_core_1.requireService)(nodecg, "midi-output");
    let midiInput = null;
    let midiOutput = null;
    inputService === null || inputService === void 0 ? void 0 : inputService.onAvailable((client) => {
        nodecg.log.info("Midi-input client has been updated, setting listeners.");
        midiInput = client;
        if (midiOutput !== null) {
            setListeners(midiInput, midiOutput);
        }
    });
    outputService === null || outputService === void 0 ? void 0 : outputService.onAvailable((client) => {
        nodecg.log.info("Midi-output client has been updated, setting listeners.");
        midiOutput = client;
        if (midiInput !== null) {
            setListeners(midiInput, midiOutput);
        }
    });
    inputService === null || inputService === void 0 ? void 0 : inputService.onUnavailable(() => nodecg.log.info("Midi-input client has been unset."));
    outputService === null || outputService === void 0 ? void 0 : outputService.onUnavailable(() => nodecg.log.info("Midi-output client has been unset."));
    // Copy from "samples/midi-input/extension/index.ts"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function printMessage(msg, event) {
        let str = "";
        for (const prop in msg) {
            str += prop + " " + msg[prop].toString() + " ";
        }
        nodecg.log.info(event + " " + str);
    }
    function setListeners(inp, out) {
        inp.on("cc", (msg) => {
            printMessage(msg, "cc");
            if (msg.value > 63) {
                msg.value = Math.round(Math.random() * 127);
            }
            out.send("cc", msg);
        });
        inp.on("noteon", (msg) => {
            printMessage(msg, "noteon");
            if (msg.velocity !== 0) {
                msg.velocity = Math.round(Math.random() * 127);
            }
            out.send("noteon", msg);
        });
        inp.on("noteoff", (msg) => {
            printMessage(msg, "noteoff");
            out.send("noteoff", msg);
        });
    }
};
//# sourceMappingURL=index.js.map