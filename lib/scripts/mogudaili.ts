import cheerio = require("cheerio");
import { getJSON } from "../helpers/net";
import { OldScript } from "./base/oldImport";

// tslint:disable-next-line:new-parens
export = new class extends OldScript {

    public async getAddress() {
        return [
            "http://www.mogumiao.com/proxy/free/listFreeIp",
            "http://www.mogumiao.com/proxy/api/freeIp?count=20"
        ];
    }

    public async catchNotes(addr: string) {
        const list: string[] = [ ];
        return getJSON(addr)
            .then((data) => {
                return (data.msg || [ ]).map((item) => {
                    return `http://${item.ip.trim()}:${item.port}`;
                });
            });
    }
};
