import NodeCG from "@nodecg/types";
import { Service } from "./service";
import { ServiceProvider } from "./serviceProvider";
/**
 * Config schema for the core bundle.
 * This is also defined in the configschema.json file.
 */
export interface NodeCGBundleConfig {
    automaticLogin?: {
        enabled?: boolean;
        password?: string;
    };
}
/**
 * Main type of NodeCG extension that the core bundle exposes.
 * Contains references to all internal modules.
 */
export interface NodeCGIOCore {
    registerService<R, C>(service: Service<R, C>): void;
    requireService<C>(nodecg: NodeCG.ServerAPI, serviceType: string): ServiceProvider<C> | undefined;
}
//# sourceMappingURL=index.d.ts.map