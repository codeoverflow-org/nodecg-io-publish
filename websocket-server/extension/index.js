"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for WebSocket Server started");
    const webSocketServer = (0, nodecg_io_core_1.requireService)(nodecg, "websocket-server");
    webSocketServer === null || webSocketServer === void 0 ? void 0 : webSocketServer.onAvailable((server) => {
        nodecg.log.info("WebSocket Server has been updated. Ready for connections.");
        server.on("connection", (websocket) => {
            websocket.on("message", (message) => {
                if (message.toString().toLowerCase() === "ping") {
                    websocket.send("pong");
                }
                else {
                    server.clients.forEach((client) => client.send(message));
                }
            });
        });
    });
    webSocketServer === null || webSocketServer === void 0 ? void 0 : webSocketServer.onUnavailable(() => nodecg.log.info("WebSocket Server has been unset."));
};
//# sourceMappingURL=index.js.map