"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerialServiceClient = void 0;
const nodecg_io_core_1 = require("nodecg-io-core");
const serialport_1 = require("serialport");
class SerialServiceClient extends serialport_1.SerialPort {
    constructor(options, protocol, callback) {
        super(options, callback);
        this.parser = this.pipe(new serialport_1.ReadlineParser(protocol));
    }
    static async createClient(config) {
        const port = await SerialServiceClient.inferPort(config.device);
        if (!port.failed) {
            return await new Promise((resolve) => {
                var _a;
                const serialPort = new SerialServiceClient({
                    ...config.connection,
                    path: port.result,
                    baudRate: (_a = config.connection.baudRate) !== null && _a !== void 0 ? _a : 9600,
                }, config.protocol, (e) => {
                    if (e)
                        resolve((0, nodecg_io_core_1.error)(e.message));
                    else
                        resolve((0, nodecg_io_core_1.success)(serialPort));
                });
            });
        }
        else {
            return (0, nodecg_io_core_1.error)(port.errorMessage);
        }
    }
    static async inferPort(deviceInfo) {
        const result = [];
        const devices = await serialport_1.SerialPort.list();
        if (deviceInfo.port) {
            result.push(deviceInfo.port);
        }
        else {
            devices.forEach((element) => {
                if (deviceInfo.pnpId && element.pnpId && element.pnpId === deviceInfo.pnpId) {
                    result.push(element.path);
                }
                else if (deviceInfo.manufacturer &&
                    deviceInfo.serialNumber &&
                    element.manufacturer === deviceInfo.manufacturer &&
                    element.serialNumber === deviceInfo.serialNumber) {
                    result.push(element.path);
                }
            });
        }
        // Check if result isn't empty or ambiguous
        if (result[0] === undefined) {
            return (0, nodecg_io_core_1.error)("No device matched the provided criteria!");
        }
        else if (result.length > 1) {
            return (0, nodecg_io_core_1.error)("The provided criteria were ambiguous!");
        }
        else {
            return (0, nodecg_io_core_1.success)(result[0]);
        }
    }
    static async getConnectedDevices() {
        const list = await serialport_1.SerialPort.list();
        return list.map((dev) => {
            return {
                device: {
                    // If we know the manufacturer and serial number we prefer them over the port
                    // because reboots or replugging devices may change the port number.
                    // Only use the raw port number if we have to.
                    port: dev.manufacturer && dev.serialNumber ? undefined : dev.path,
                    manufacturer: dev.manufacturer,
                    serialNumber: dev.serialNumber,
                    pnpId: dev.pnpId,
                },
                connection: {},
                protocol: { delimiter: "\n" },
            };
        });
    }
    async send(payload) {
        const err = await new Promise((resolve) => {
            this.write(payload, (err) => {
                resolve(err);
            });
        });
        if (err) {
            return (0, nodecg_io_core_1.error)(err.message);
        }
        else {
            return (0, nodecg_io_core_1.emptySuccess)();
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onData(callback) {
        this.parser.on("data", callback);
    }
    removeAllParserListeners() {
        this.parser.removeAllListeners();
    }
}
exports.SerialServiceClient = SerialServiceClient;
//# sourceMappingURL=SerialClient.js.map