"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    constructor(name, nodecg) {
        this.name = name;
        this.nodecg = nodecg;
    }
    trace(...args) {
        this.nodecg.log.trace(`[${this.name}] ${args[0]}`, ...args.slice(1));
    }
    debug(...args) {
        this.nodecg.log.debug(`[${this.name}] ${args[0]}`, ...args.slice(1));
    }
    info(...args) {
        this.nodecg.log.info(`[${this.name}] ${args[0]}`, ...args.slice(1));
    }
    warn(...args) {
        this.nodecg.log.warn(`[${this.name}] ${args[0]}`, ...args.slice(1));
    }
    error(...args) {
        this.nodecg.log.error(`[${this.name}] ${args[0]}`, ...args.slice(1));
    }
}
exports.Logger = Logger;
//# sourceMappingURL=index.js.map