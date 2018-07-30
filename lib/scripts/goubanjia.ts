import cheerio = require("cheerio");
import { getHTML } from "../helpers/net";
import { OldScript } from "./base/oldImport";

// tslint:disable-next-line:new-parens
export = new class extends OldScript {

    public async getAddress() {
        return [
            "http://www.goubanjia.com/"
        ];
    }

    public async catchNotes(addr: string) {
        const reg = /<\w+\s+style="display:\s*none;">.+?>/g;
        const list: string[] = [ ];
        const trs = await getHTML(addr)
            .then(($) => $("table tbody tr"));
        for (let i = 0; i < trs.length - 1; i++) {
            const tr = trs.eq(i);
            const tds = cheerio("td", tr);

            const texts = [2, 0]
                .map((index) => tds.eq(index).html() as string)
                .map((item, index) => {
                    if (index === 1) {
                        item = item.replace(reg, "");
                    }
                    const $ = cheerio.load(item) as any;
                    return $.text();
                });
            list.push(`${texts[0]}://${texts[1]}`);
        }
        return list;
    }
};
