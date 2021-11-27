import WebSocket from "ws";
export declare class WSClientServiceClient extends WebSocket {
    constructor(address: string);
    onClose(func: () => void): this;
    onMessage(func: (message: WebSocket.Data) => void): this;
    onError(func: (error: Error) => void): this;
}
//# sourceMappingURL=index.d.ts.map