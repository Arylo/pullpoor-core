import { flattenDeep } from "lodash";
import * as path from "path";
import { URL } from "url";
import { getBanksList as getList, startCatch } from "./helpers/banks";
import { rootPath } from "./helpers/constant";
import { getJSON } from "./helpers/net";
import store = require("./store");

export { getBanksList } from "./helpers/banks";
export { initCatchCache, getBankCache as getBank } from "./helpers/cache";
export const { getNotes } = store;

const getPackageObject = () => {
    const filePath = path.resolve(rootPath, "package.json");
    return require(filePath);
};

export const version = () => {
    return getPackageObject().version;
};

export const remoteVersion = async () => {
    const url = new URL("pullpoor-core", process.env.npm_config_registry);
    return (await getJSON(url.toString()))["dist-tags"].latest;
};

export const catchNotes = async (name?: string | string[]) => {
    const list =  !name ? getList() : Array.isArray(name) ? name : [name];
    const notes = await Promise.all(list.map((bankName) => startCatch(bankName)))
        .then((arr) => flattenDeep(arr));
    return [...new Set(notes)];
};
