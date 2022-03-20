"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Xdotool = void 0;
const tslib_1 = require("tslib");
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
const child_process_1 = require("child_process");
const stringio_1 = require("@rauschma/stringio");
class Xdotool {
    constructor(logger, host, port) {
        this.logger = logger;
        if ((host.startsWith("127.0.0.") || host === "localhost") && port < 0) {
            this.address = null;
        }
        else {
            this.address = `http://${host}:${port}`;
        }
    }
    async testConnection() {
        if (this.address === null) {
            const childProcess = (0, child_process_1.spawn)("xdotool", ["version"], {
                stdio: ["ignore", "ignore", process.stderr],
                env: process.env,
            });
            await (0, stringio_1.onExit)(childProcess);
            if (childProcess.exitCode === 0) {
                // Success
                return true;
            }
            else if (childProcess.exitCode === 127) {
                // Not found
                throw new Error(`xdotool not found`);
            }
            else {
                return false;
            }
        }
        else {
            const response = await (0, node_fetch_1.default)(`${this.address}/nodecg-io`, { method: "GET" });
            return response.status === 404;
        }
    }
    async sendCommand(command) {
        if (this.address === null) {
            const childProcess = (0, child_process_1.spawn)("xdotool", ["-"], {
                stdio: ["pipe", "ignore", process.stderr],
                env: process.env,
            });
            childProcess.stdin.end(`${command}\n`, "utf-8");
            await (0, stringio_1.onExit)(childProcess);
            if (childProcess.exitCode !== 0) {
                throw new Error(`xdotool returned error code ${childProcess.exitCode}`);
            }
        }
        else {
            try {
                await (0, node_fetch_1.default)(`${this.address}/send/${command}`, { method: "GET" });
            }
            catch (err) {
                this.logger.error(`Error while using the xdotool Connector: ${err}`);
            }
        }
    }
}
exports.Xdotool = Xdotool;
//# sourceMappingURL=xdotool.js.map