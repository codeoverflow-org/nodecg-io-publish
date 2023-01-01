import { Logger } from "nodecg-io-core";
import { Knex } from "knex";
export interface SQLConfig {
    client: string;
    logger: Logger;
    connection: Record<string, unknown>;
}
export type SQLClient = Knex<any, unknown[]>;
//# sourceMappingURL=index.d.ts.map