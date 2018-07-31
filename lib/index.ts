import * as path from "path";
import { URL } from "url";
import { getBanksList as getList, startCatch } from "./helpers/banks";
import { rootPath } from "./helpers/constant";
import { getJSON } from "./helpers/net";

export { getBanksList } from "./helpers/banks";
export { initCatchCache, getBankCache as getBank } from "./helpers/cache";

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
    const set = new Set<string>();
    const names = name && typeof name === "string" ? [ name ] : name;
    const list = !names || names.length === 0 ? getList() : names;
    for (const bankName of list) {
        const notes = await startCatch(bankName);
        for (const note of notes) {
            set.add(note);
        }
    }
    return [...set];
};
