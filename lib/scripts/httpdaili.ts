import cheerio = require("cheerio");
import { getHTML } from "../helpers/net";
import { OldScript } from "./base/oldImport";

// tslint:disable-next-line:new-parens
export = new class extends OldScript {

    public async getAddress() {
        return [
            "http://www.httpdaili.com/"
        ];
    }

    public async catchNotes(addr: string) {
        const list: string[] = [ ];
        const tables = await getHTML(addr)
            .then(($) => $("table table"));
        for (let i = 0; i < tables.length; i++) {
            const protocol = i <= 1 ? "http" : "https";
            const table = tables.eq(i);
            const trs = cheerio("tbody tr", table);
            for (let j = 2; j < trs.length; j++) {
                const tr = trs.eq(j);
                const tds = cheerio("td", tr);
                const texts =
                    [0, 1].map((index) => tds.eq(index).text().trim());
                const url = `${protocol}://${texts[0]}:${texts[1]}`;
                list.push(url);
            }
        }
        return list;
    }

};
