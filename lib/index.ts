import * as fs from "fs";
import * as path from "path";
import updateNotifier = require("update-notifier");
import { getBanksList as getList, startCatch } from "./helpers/banks";
import { rootPath } from "./helpers/constant";
export { getBanksList } from "./helpers/banks";

const getPackageObject = () => {
    const filepath = path.resolve(rootPath, "package.json");
    return require(filepath);
};

export const version = () => {
    return getPackageObject().version;
};

export const remoteVersion = () => {
    return (updateNotifier({ pkg: getPackageObject() }).update || {
        latest: version()
    }).latest;
};

export const catchNotes = async (name?: string | string[]) => {
    const set = new Set<string>();
    const names = name && typeof name === "string" ? [name] : name;
    const list = !names || names.length === 0 ? getList() : names;
    for (const bankname of list) {
        const notes = await startCatch(bankname);
        for (const note of notes) {
            set.add(note);
        }
    }
    return [...set];
};
