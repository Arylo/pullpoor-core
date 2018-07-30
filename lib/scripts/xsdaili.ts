import cheerio = require("cheerio");
import { URL } from "url";
import { getHTML } from "../helpers/net";
import { IBaseScript } from "../interfaces/script";

const getAddress = async () => {
    const list: string[] = [ ];
    const rootAddrs = ["http://www.xsdaili.com/"]
        .concat(Array(5).fill("").map((_, index) => {
            const i = index === 0 ? index : parseInt(`${Math.random() * 20}`, 10);
            return `http://www.xsdaili.com/dayProxy/${index + 1}.html`;
        }));
    for (const addr of rootAddrs) {
        await getHTML(addr)
            .then(($) =>
                $(`a[href^='/dayProxy/ip/']`)
            )
            .then((as: any) => {
                for (const a of as.toArray()) {
                    const url = new URL("http://www.xsdaili.com/");
                    url.pathname = cheerio(a).attr("href");
                    list.push(url.toString());
                }
            });
    }
    return [...new Set(list)];
};

const catchNotes = (addr: string) => {
    const list: string[] = [ ];
    return getHTML(addr)
        .then(($) => $(".cont").html().replace(/\s+/g, ""))
        .then((html) => {
            const reg = /((?:\d+\.){3}\d+:\d+)@(HTTPS?)/i;
            return html
                .match(new RegExp(reg, "g"))
                .map((str) => str.toString())
                .map((str) => {
                    const matches = str.match(reg);
                    return `${matches[2].toLowerCase()}://${matches[1]}`;
                });
        });
};

export = {
    catchNotes,
    getAddress
} as IBaseScript;
