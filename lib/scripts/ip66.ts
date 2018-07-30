import cheerio = require("cheerio");
import { getHTML } from "../helpers/net";
import { OldScript } from "./base/oldImport";

// tslint:disable-next-line:new-parens
export = new class extends OldScript {

    public async getAddress() {
        return [
            "http://www.66ip.cn/mo.php?sxb=&tqsl=10000&port=&export=&ktip=&sxa=&submit=%CC%E1++%C8%A1&textarea="
        ];
    }

    public async catchNotes(addr: string) {
        return getHTML(addr)
            .then(($) => $("body").html().replace(/\s+/g, ""))
            .then((html) => {
                return html
                    .match(/(\d+\.){3}\d+:\d+(?!:<br>)/gi)
                    .map((item) => item.toString())
                    .map((item) => `http://${item}`);
            });
    }
};
