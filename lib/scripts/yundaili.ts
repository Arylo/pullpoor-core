import cheerio = require("cheerio");
import { IBaseGetAddressScript } from "../interfaces/script";
import { CatchCacheScript } from "./base/httpCacheScript";

// tslint:disable-next-line:new-parens
export = new class extends CatchCacheScript implements IBaseGetAddressScript {

    public getAddress = async () => {
        const list = [
            "http://www.ip3366.net/",
            "http://www.ip3366.net/free/"
        ];
        for (let style = 1, end = 4; style < end; style++) {
            for (let page = 1, size = 10; page < size; page++) {
                list.push(`http://www.ip3366.net/?stype=${style}&page=${page}`);
            }
        }
        return list;
    }

    public catchNotes(address: string, elePromise: PromiseLike<Cheerio>) {
        const list: string[] = [ ];
        return elePromise.then((trs) => {
            for (const tr of trs.toArray()) {
                const tds = cheerio("td", tr);
                const texts = [3, 0, 1].map((index) => tds.eq(index).text().trim());
                const url =
                    `${texts[0].toLowerCase()}://${texts[1]}:${texts[2]}`;
                list.push(url);
            }
            return list;
        });
    }

};
