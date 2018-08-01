import * as cheerio from "cheerio";
import * as fs from "fs";
import * as md5 from "md5";
import * as path from "path";
import store = require("../store");
import { addBankCache, hasCatchCache, isStartCatch, refreshCatchCache } from "./cache";
import { configsPath, DEFAULT_EXPIREDAT } from "./constant";
import { getHTML } from "./net";
import { parse } from "./parse";
import { retryFnAsync } from "./retryFn";

export const getBank = (name: string) => {
    const filepath = path.resolve(configsPath, `${name}.yaml`);
    if (!fs.existsSync(filepath)) {
        throw new Error(`Non-exist Config File: ${name}`);
    }
    const obj = parse(filepath);
    obj.name = obj.name ? obj.name : name;
    obj.nickname = obj.nickname ? obj.nickname : name;
    obj.expiredAt = obj.expiredAt ? obj.expiredAt : DEFAULT_EXPIREDAT;
    // TODO: 检查完整性
    return addBankCache(name, obj);
};

export const getBanksList = () => {
    return fs.readdirSync(configsPath)
        .filter((filename) => {
            if (!/\.yaml$/.test(filename)) {
                return false;
            }
            const stat = fs.statSync(path.resolve(configsPath, filename));
            return stat.isFile();
        })
        .map((filename) => {
            return filename.replace(/\.yaml/, "");
        })
        .filter((name) => {
            return !getBank(name).base;
        });
};

export const startCatch = async (name: string) => {
    let list: string[] = [ ];
    const bank = getBank(name);

    if (bank.skip || bank.base) {
        return list;
    }

    // 未够时间刷新则跳过
    if (!isStartCatch(name)) {
        return list;
    }

    refreshCatchCache(name);

    const catchOptions = bank.catch_options;
    const isUseCache =
        catchOptions &&
        catchOptions.type === "html" &&
        catchOptions.hash_element &&
        typeof catchOptions.hash_element === "string";
    let addresses: string[] = [];
    try {
        await retryFnAsync(async () => {
            addresses = await bank.address_function();
        });
    } catch (error) {
        return list;
    }

    for (const address of addresses) {
        let eleP: PromiseLike<Cheerio>;
        if (isUseCache) {
            let ele: Cheerio;
            try {
                await retryFnAsync(async () => {
                    eleP = getHTML(address).then(($) => $(catchOptions.hash_element));
                    ele = await eleP;
                });
            } catch (error) {
                continue;
            }
            const md5sum = md5(ele.toArray().reduce((content, e) => {
                content += cheerio(e).html().toString();
                return content;
            }, ""));
            if (hasCatchCache(name, md5sum)) {
                continue;
            }
        }
        try {
            await retryFnAsync(async () => {
                list.push(...await bank.catch_function(address, eleP));
            });
        } catch (e) {
            continue;
        }
    }
    list = [...new Set(list)];
    store.clearOldNotes(name).addNotes(name, list);
    return list;
};
