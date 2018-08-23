import * as dtss from "dtss";
import findUp = require("find-up");
import { dirname, resolve } from "path";

export const rootPath = dirname(findUp.sync("package.json", { cwd: __dirname }));
export let configsPath = resolve(rootPath, "banks");
export let scriptsPath = resolve(__dirname, "../scripts");

export const setValue = (key: "configsPath" | "scriptsPath", val: string) => {
    switch (key) {
        case "configsPath":
            configsPath = val;
            break;
        case "scriptsPath":
            scriptsPath = val;
            break;
    }
    return true;
};

export const DEFAULT_EXPIREDAT = dtss.m(30);
