import { Logger } from "nodecg-io-core";
import { Knex } from "knex";
export interface SQLConfig {
    client: string;
    logger: Logger;
    connection: Record<string, unknown>;
}
export declare type SQLClient = Knex;
//# sourceMappingURL=index.d.ts.map