import * as cheerio from "cheerio";
import * as fs from "fs";
import * as md5 from "md5";
import * as path from "path";
import { IYamlObject } from "../interfaces/yaml";
import { rootPath } from "./constant";
import { getHTML } from "./net";
import { parse } from "./parse";
import { retryFnAsync } from "./retryFn";

const configsPath = path.resolve(rootPath, "banks");

const bankCache: { [name: string]: IYamlObject } = { };

export const getBank = (name: string) => {
    const filepath = path.resolve(configsPath, `${name}.yaml`);
    if (!fs.existsSync(filepath)) {
        throw new Error(); // TODO:
    }
    const obj = parse(filepath);
    obj.name = obj.name ? obj.name : name;
    obj.nickname = obj.nickname ? obj.nickname : name;
    return bankCache[name] = obj;
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
        });
};

const cacheSet = new Set<string>();

export const startCatch = async (name: string) => {
    const list: string[] = [ ];
    const bank = getBank(name);

    if (bank.skip || bank.base) {
        return list;
    }

    const catchOptions = bank.catch_options;
    const isUseCache =
        catchOptions &&
        catchOptions.type === "html" &&
        catchOptions.hash_element &&
        typeof catchOptions.hash_element === "string";
    let addresses: string[] = [];
    await retryFnAsync(async () => {
        addresses = await bank.address_funcion();
    });

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
            if (cacheSet.has(md5sum)) {
                continue;
            }
            cacheSet.add(md5sum);
        }
        try {
            await retryFnAsync(async () => {
                list.push(...await bank.catch_funcion(address, eleP));
            });
        } catch (e) {
            continue;
        }
    }
    return [...new Set(list)];
};
