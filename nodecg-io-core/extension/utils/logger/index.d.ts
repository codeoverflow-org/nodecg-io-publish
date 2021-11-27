import { NodeCG } from "nodecg-types/types/server";
export declare class Logger {
    private name;
    private nodecg;
    constructor(name: string, nodecg: NodeCG);
    trace(...args: any[]): void;
    debug(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
}
//# sourceMappingURL=index.d.ts.map