"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodecg_io_core_1 = require("nodecg-io-core");
module.exports = function (nodecg) {
    nodecg.log.info("Sample bundle for Google Sheets started");
    const googleApis = (0, nodecg_io_core_1.requireService)(nodecg, "googleapis");
    googleApis === null || googleApis === void 0 ? void 0 : googleApis.onAvailable(async (client) => {
        var _a;
        const gsheets = client.sheets("v4");
        try {
            const data = await gsheets.spreadsheets.values.get({
                spreadsheetId: "<ID>",
                range: "<tableSheetName>", //The sheet name, witch will used to get the data.
            }, undefined);
            data.data.values = (_a = data.data.values) === null || _a === void 0 ? void 0 : _a.filter((e) => !(!e[0] || 0 === e[0].length)); // filter out rows when column A is a empty String
            nodecg.log.info(data.data);
        }
        catch (error) {
            nodecg.log.error("Could it be, that you haven't specified the spreadsheetId and the range?");
            nodecg.log.error(error);
        }
    });
    googleApis === null || googleApis === void 0 ? void 0 : googleApis.onUnavailable(() => nodecg.log.info("GSheets client has been unset."));
};
//# sourceMappingURL=index.js.map