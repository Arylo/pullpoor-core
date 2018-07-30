import cheerio = require("cheerio");
import { getHTML } from "../helpers/net";
import { OldScript } from "./base/oldImport";

// tslint:disable-next-line:new-parens
export = new class extends OldScript {

    public async getAddress() {
        const list: string[] = [ ];
        return getHTML("http://www.mayidaili.com/share/")
            .then(($) =>
                $(`a[href^='http://www.mayidaili.com/share/view/']`)
            )
            .then((as: any) => {
                for (const a of as.toArray()) {
                    list.push(cheerio(a).attr("href"));
                }
                return [...new Set(list)];
            });
    }

    public async catchNotes(addr: string) {
        const list: string[] = [ ];
        return getHTML(addr)
            .then(($) => $(".container p"))
            .then((p) => {
                return p.text()
                    .match(/(\d+\.){3}\d+:\d+/gi)
                    .map((item) => item.toString())
                    .map((item) => `http://${item}`);
            });
    }
};
