
import cheerio = require("cheerio");
import { getHTML } from "../helpers/net";

export const catchNotes = (addr: string) => {
    const list: string[] = [ ];
    return getHTML(addr)
        .then(($) => $(".sortable tbody tr"))
        .then((trs) => {
            for (const tr of trs.toArray()) {
                const tds = cheerio("td", tr);
                const texts =
                    [0, 1].map((index) => tds.eq(index).html());
                const url = `http://${texts[0]}:${texts[1]}`;
                list.push(url);
            }
            return list;
        });
};
