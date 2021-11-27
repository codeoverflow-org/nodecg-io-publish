"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugHelper = void 0;
const events_1 = require("events");
class DebugHelper extends events_1.EventEmitter {
    constructor(nodecg, logger) {
        super();
        logger.info("DebugHelper is ready to help debugging.");
        // Registering all listeners and defining redirection
        nodecg.listenFor("onClick", (value) => {
            this.emit("onClick");
            this.emit(`onClick${value}`);
        });
        nodecg.listenFor("onNumber", (value) => {
            this.emit("onNumber", parseInt(value));
        });
        for (const range of ["0to100", "0to1", "M1to1"]) {
            nodecg.listenFor(`onRange${range}`, (value) => {
                this.emit(`onRange${range}`, parseFloat(value));
            });
        }
        nodecg.listenFor("onColor", (value) => {
            this.emit("onColor", DebugHelper.hexToRGB(value));
        });
        nodecg.listenFor("onDate", (value) => {
            this.emit("onDate", new Date(value));
        });
        nodecg.listenFor("onBool", (value) => {
            this.emit("onBool", value);
        });
        nodecg.listenFor("onText", (value) => {
            this.emit("onText", value);
        });
        nodecg.listenFor("onList", (value) => {
            const list = value.split(",");
            this.emit("onList", list);
        });
        nodecg.listenFor("onJSON", (value) => {
            this.emit("onJSON", value);
        });
    }
    static hexToRGB(hex) {
        var _a, _b, _c;
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return {
            red: (result === null || result === void 0 ? void 0 : result[1]) ? parseInt((_a = result[1]) !== null && _a !== void 0 ? _a : "0", 16) : 0,
            green: (result === null || result === void 0 ? void 0 : result[2]) ? parseInt((_b = result[2]) !== null && _b !== void 0 ? _b : "0", 16) : 0,
            blue: (result === null || result === void 0 ? void 0 : result[3]) ? parseInt((_c = result[3]) !== null && _c !== void 0 ? _c : "0", 16) : 0,
        };
    }
    static createClient(nodecg, logger) {
        return new DebugHelper(nodecg, logger);
    }
    // Custom register handler functions
    onClick(listener) {
        this.on("onClick", listener);
    }
    onClick1(listener) {
        this.on("onClick1", listener);
    }
    onClick2(listener) {
        this.on("onClick2", listener);
    }
    onClick3(listener) {
        this.on("onClick3", listener);
    }
    onClick4(listener) {
        this.on("onClick4", listener);
    }
    onClick5(listener) {
        this.on("onClick5", listener);
    }
    onNumber(listener) {
        this.on("onNumber", listener);
    }
    onRange0to100(listener) {
        this.on("onRange0to100", listener);
    }
    onRange0to1(listener) {
        this.on("onRange0to1", listener);
    }
    onRangeM1to1(listener) {
        this.on("onRangeM1to1", listener);
    }
    onColor(listener) {
        this.on("onColor", listener);
    }
    onDate(listener) {
        this.on("onDate", listener);
    }
    onBool(listener) {
        this.on("onBool", listener);
    }
    onText(listener) {
        this.on("onText", listener);
    }
    onList(listener) {
        this.on("onList", listener);
    }
    onJSON(listener) {
        this.on("onJSON", listener);
    }
}
exports.DebugHelper = DebugHelper;
//# sourceMappingURL=debugHelper.js.map