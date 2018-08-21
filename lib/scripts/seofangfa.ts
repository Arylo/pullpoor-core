import cheerio = require("cheerio");
import { getHTML } from "../helpers/net";
import { OldScript } from "./base/oldImport";

// tslint:disable-next-line:new-parens
export = new class extends OldScript {

    public async getAddress() {
        return [
            "https://ip.seofangfa.com/"
        ];
    }

    public async catchNotes(addr: string) {
        const list: string[] = [ ];
        return getHTML(addr)
            .then(($) => $("tr"))
            .then((trs) => {
                for (const tr of trs.toArray()) {
                    const tds = cheerio("td", tr);
                    const texts =
                        [0, 1].map((index) => tds.eq(index).text().trim());
                    const url = `http://${texts[0]}:${texts[1]}`;
                    list.push(url);
                }
                return list;
            });
    }

};
