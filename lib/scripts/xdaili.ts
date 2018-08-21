import { URL } from "url";

import { getJSON } from "../helpers/net";
import { OldScript } from "./base/oldImport";

// tslint:disable-next-line:new-parens
export = new class extends OldScript {

    public async getAddress() {
        return ["", ""].map((_, index) => {
            const url =
                new URL("http://www.xdaili.cn/ipagent/freeip/getFreeIps");
            url.searchParams.set("page", `${index}`);
            return url.toString();
        });
    }

    public async catchNotes(addr: string) {
        return getJSON(addr)
            .then((res) => {
                return res.RESULT.rows || [ ];
            }).then((arr) => {
                return arr.map((item) => {
                    return `http://${item.ip.trim()}:${item.port}`;
                });
            });
    }

};
