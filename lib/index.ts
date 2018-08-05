import { flattenDeep, merge } from "lodash";
import * as path from "path";
import { URL } from "url";
import { getBanksList as getList, startCatch } from "./helpers/banks";
import { getBankCache, initCatchCache } from "./helpers/cache";
import { rootPath } from "./helpers/constant";
import { getJSON } from "./helpers/net";
import { ICatchMap } from "./interfaces/catch.d";
import { IStoreMap } from "./interfaces/store.d";
import store = require("./store");

export { getBanksList } from "./helpers/banks";
export { getBankCache as getBank } from "./helpers/cache";
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
        .then((arr) => flattenDeep(arr));
    return [...new Set(notes)];
};

export const get = (name: string) => {
    return merge({ }, getBankCache(name), store.getStore(name));
};
