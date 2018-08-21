import cheerio = require("cheerio");
import { URL } from "url";
import { getHTML } from "../helpers/net";
import { OldScript } from "./base/oldImport";

// tslint:disable-next-line:new-parens
export = new class extends OldScript {

    public async getAddress() {
        return [
            "on", // 全国
            "%B5%E7%D0%C5", // 电信
            "%C1%AA%CD%A8", // 联通
            "%D2%C6%B6%AF" // 移动
        ].map((item) => {
            const url = new URL("http://www.89ip.cn/tqdl.html");
            // url.searchParams.set("sxb", "");
            // url.searchParams.set("ports", "");
            // url.searchParams.set("ktip", "");
            // url.searchParams.set("submit", "%CC%E1++%C8%A1");
            url.searchParams.set("num", "2000");
            url.searchParams.set("isp", item);
            return url.toString();
        });
    }

    public async catchNotes(addr: string) {
        return getHTML(addr)
            .then(($) => $(".fly-panel>div").eq(0).html().replace(/\s+/g, ""))
            .then((html) => {
                return html
                    .match(/(\d+\.){3}\d+:\d+(?!:<br>)/gi)
                    .map((item) => item.toString().trim())
                    .map((item) => `http://${item}`);
            });
    }
};
