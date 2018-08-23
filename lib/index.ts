import { flattenDeep, merge } from "lodash";
import * as path from "path";
import { URL } from "url";
import { getBanksList as getList, startCatch } from "./helpers/banks";
import { getCatchCache, initCatchCache } from "./helpers/cache";
import { rootPath } from "./helpers/constant";
import { getJSON } from "./helpers/net";
import { ICatch, ICatchMap } from "./interfaces/catch";
import { IStore, IStoreMap } from "./interfaces/store";
import store = require("./store");

export { getBanksList } from "./helpers/banks";
export { getBankCache as getBank } from "./helpers/cache";
export { on, once } from "./event";

export const getNotes = (...args) => {
    return store.getNotes(...args);
};

const getPackageObject = () => {
    const filePath = path.resolve(rootPath, "package.json");
    return require(filePath);
};

export const version = () => {
    return getPackageObject().version;
};

export const remoteVersion = async () => {
    const url = new URL("pullpoor-core", process.env.npm_config_registry);
    try {
        const body = await getJSON(url.toString());
        return body["dist-tags"].latest;
    } catch (error) {
        throw error;
    }
};

export const init = (objs: ICatchMap | IStoreMap) => {
    const status = [
        initCatchCache(objs as ICatchMap),
        store.init(objs as IStoreMap)
    ];
    return status.indexOf(false) === -1;
};

export const catchNotes = async (name?: string | string[]) => {
    const list =  !name ? getList() : Array.isArray(name) ? name : [name];
    const notes = await Promise.all(list.map((bankName) => startCatch(bankName)))
        .then((arr) => flattenDeep(arr)) as string[];
    return [...new Set(notes)];
};

export function get(): ICatchMap & IStoreMap;
export function get(name: string): ICatch & IStore;
export function get(name?: string) {
    if (!name) {
        const obj: ICatchMap & IStoreMap = { };
        for (const bank of getList()) {
            obj[bank] = get(bank);
        }
        return obj;
    } else {
        return merge({ }, getCatchCache(name), store.getStore(name));
    }
}
