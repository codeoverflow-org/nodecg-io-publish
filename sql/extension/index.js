"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for the template service started.");
    const sql = (0, nodecg_io_core_1.requireService)(nodecg, "sql");
    sql === null || sql === void 0 ? void 0 : sql.onAvailable(async (sql) => {
        // In the following, we demonstrate some simple examples on how to use knex.js
        nodecg.log.info("SQL service available.");
        // Select the columns 'Id' and 'Content' from the table 'Test' (not typesafe)
        (await sql("Test").select("Id", "Content")).forEach((row) => nodecg.log.info(`Received row with id: ${row.Id}`));
        (await sql("Test")).forEach((row) => nodecg.log.info(`Received content: ${row.Content}`));
        // An example on how to use *where*
        (await sql("Test2").where("Id", 3)).forEach((row) => nodecg.log.info(`Content of element with Id == 3: ${row.Content}`));
        // An example on how to use *join*
        (await sql("Test")
            .leftJoin("Test2", "Test.Id", "Test2.Id")
            .select("Test.Content as Content1", "Test2.Content as Content2")).forEach((match) => nodecg.log.info(`Matching elements: '${match.Content1}' and '${match.Content2}'`));
        // An example on how to use *insert* (we assume Id to be auto-incrementing and leave it empty)
        await sql("Test2").insert({ Content: `Some random content: ${Math.random()}` });
        // Way more examples can be found on knexjs.org
    });
    sql === null || sql === void 0 ? void 0 : sql.onUnavailable(() => {
        nodecg.log.info("SQL service unavailable.");
    });
};
//# sourceMappingURL=index.js.map