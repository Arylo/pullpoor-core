import test from "ava";
import { resolve } from "path";
import * as constant from "../lib/helpers/constant";

test((t) => {
    const obj = JSON.parse(JSON.stringify({
        configsPath: constant.configsPath,
        rootPath: constant.rootPath,
        scriptsPath: constant.scriptsPath
    }));
    constant.setValue("configsPath", resolve(constant.rootPath, "test/banks"));
    constant.setValue("scriptsPath", resolve(__dirname, "scripts"));
    t.not(obj.configsPath, constant.configsPath);
    t.not(obj.scriptsPath, constant.scriptsPath);
});
