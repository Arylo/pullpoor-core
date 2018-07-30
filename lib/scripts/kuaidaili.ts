import cheerio = require("cheerio");
import { getHTML } from "../helpers/net";
import { OldScript } from "./base/oldImport";

// tslint:disable-next-line:new-parens
export = new class extends OldScript {

    public async getAddress() {
        return [
            "https://www.kuaidaili.com/free/inha/1/",
            "https://www.kuaidaili.com/free/intr/1/",
            "https://www.kuaidaili.com/free/inha/2/",
            "https://www.kuaidaili.com/free/intr/2/"
        ];
    }

    public async catchNotes(addr: string) {
        const list: string[] = [ ];
        return getHTML(addr)
            .then(($) => $(".con-body #list tbody tr"))
            .then((trs) => {
                for (const tr of trs.toArray()) {
                    const tds = cheerio("td", tr);
                    const txts =
                        [3, 0, 1].map((index) => tds.eq(index).text());
                    const url =
                        `${txts[0].toLowerCase()}://${txts[1]}:${txts[2]}`;
                    list.push(url);
                }
                return list;
            });
    }
};
