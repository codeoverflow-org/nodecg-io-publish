import NodeCG from "@nodecg/types";
import { requireService } from "nodecg-io-core";
import { SerialServiceClient } from "nodecg-io-serial";

module.exports = function (nodecg: NodeCG.ServerAPI) {
    nodecg.log.info("Sample bundle for serial started");

    const service = requireService<SerialServiceClient>(nodecg, "serial");
    let interval: NodeJS.Timeout | undefined;

    service?.onAvailable((client) => {
        nodecg.log.info("Serial client has been updated, logging incoming data.");
        client.onData((data: string) => {
            nodecg.log.info(data);
        });

        interval = setInterval(() => {
            client.send("ping\n");
        }, 10000);
    });

    service?.onUnavailable(() => {
        nodecg.log.info("Serial client has been unset.");
        if (interval) {
            clearInterval(interval);
        }
    });
};
