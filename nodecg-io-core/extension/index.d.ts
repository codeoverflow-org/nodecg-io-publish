import { NodeCG } from "nodecg-types/types/server";
import { Service } from "./service";
import { ServiceProvider } from "./serviceProvider";
/**
 * Main type of NodeCG extension that the core bundle exposes.
 * Contains references to all internal modules.
 */
export interface NodeCGIOCore {
    registerService<R, C>(service: Service<R, C>): void;
    requireService<C>(nodecg: NodeCG, serviceType: string): ServiceProvider<C> | undefined;
}
//# sourceMappingURL=index.d.ts.map