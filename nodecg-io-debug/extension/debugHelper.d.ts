/// <reference types="node" />
import { EventEmitter } from "events";
import { Logger } from "nodecg-io-core";
import NodeCG from "@nodecg/types";
export interface Color {
    red: number;
    green: number;
    blue: number;
}
export declare class DebugHelper extends EventEmitter {
    constructor(nodecg: NodeCG.ServerAPI, logger: Logger);
    private static hexToRGB;
    static createClient(nodecg: NodeCG.ServerAPI, logger: Logger): DebugHelper;
    onClick(listener: () => void): void;
    onClick1(listener: () => void): void;
    onClick2(listener: () => void): void;
    onClick3(listener: () => void): void;
    onClick4(listener: () => void): void;
    onClick5(listener: () => void): void;
    onNumber(listener: (value: number) => void): void;
    onRange0to100(listener: (value: number) => void): void;
    onRange0to1(listener: (value: number) => void): void;
    onRangeM1to1(listener: (value: number) => void): void;
    onColor(listener: (value: Color) => void): void;
    onDate(listener: (value: Date) => void): void;
    onBool(listener: (value: boolean) => void): void;
    onText(listener: (value: string) => void): void;
    onList(listener: (value: Array<string>) => void): void;
    onJSON(listener: (value: unknown) => void): void;
}
//# sourceMappingURL=debugHelper.d.ts.map