import findUp = require("find-up");
import { dirname, resolve } from "path";

const obj = {
    configsPath: "",
    rootPath: dirname(findUp.sync("package.json")),
    scriptsPath: ""
};

obj.configsPath = resolve(obj.rootPath, "bands");
obj.scriptsPath = resolve(__dirname, "../scripts");

export let rootPath = obj.rootPath;
export let configsPath = obj.configsPath;
export let scriptsPath = obj.scriptsPath;

export const setValue = (key: "configsPath" | "scriptsPath", val: string) => {
    obj[key] = val;
    switch (key) {
        case "configsPath":
            configsPath = obj.configsPath;
            break;
        case "scriptsPath":
            scriptsPath = obj.scriptsPath;
            break;
    }
    return true;
};
