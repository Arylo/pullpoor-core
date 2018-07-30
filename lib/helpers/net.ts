import { URL } from "url";

import cheerio = require("cheerio");
import ua = require("random-useragent");
import rp = require("request-promise");
import { sleep } from "./sleep";

const getOptions = {
    headers: {
        "Cache-Control": "max-age=0",
        "Connection": "keep-alive"
    },
    method: "GET",
    timeout: 60 * 1000
};

let isFirstHtml = true;

export const getHTML = async (url: string, opts?) => {
    const options = Object.assign({ }, getOptions, {
        headers: {
            "Host": new URL(url).host,
            "Referer": url,
            "User-Agent": ua.getRandom()
        },
        uri: url,
        transform(body) {
            return cheerio.load(body);
        }
    }, opts);
    if (!isFirstHtml) {
        await sleep(500);
    } else {
        isFirstHtml = false;
    }
    return rp(options);
};

let isFirstJson = true;

export const getJSON = async (url: string, opts?) => {
    const options = Object.assign({ }, getOptions, {
        headers: {
            "Host": new URL(url).host,
            "Referer": url,
            "User-Agent": ua.getRandom()
        },
        uri: url,
        transform(body) {
            return typeof body === "string" ? JSON.parse(body) : body;
        }
    }, opts);
    if (!isFirstJson) {
        await sleep(500);
    } else {
        isFirstJson = false;
    }
    return rp(options);
};
