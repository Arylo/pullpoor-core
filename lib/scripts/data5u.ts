import cheerio = require("cheerio");
import { CatchCacheScript } from "./base/httpCacheScript";

const catchNotes = (addr: string, eleP: PromiseLike<Cheerio>) => {
    const list: string[] = [ ];
    return eleP.then((uls) => {
        for (const ul of uls.toArray()) {
            const lis = cheerio("li", ul);
            const texts =
                [3, 0, 1].map((index) => lis.eq(index).text().trim());
            const url =
                `${texts[0]}://${texts[1]}:${texts[2]}`;
            list.push(url);
        }
        return list;
    });
};

export = {
    catchNotes
} as CatchCacheScript;
