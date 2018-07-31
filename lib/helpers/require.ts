import * as fs from "fs";
import * as path from "path";
import { scriptsPath } from "./constant";

const scriptCache: { [path: string]: any } = { };

export const requireScript = (name: string) => {
    if (scriptCache[name]) {
        return require(path.resolve(scriptsPath, name));
    }
    const filepath = path.resolve(scriptsPath, `${name}.js`);
    if (!fs.existsSync(filepath)) {
        throw new Error("Non-exist Script File");
    } else {
        scriptCache[name] = true;
    }
    return require(path.resolve(scriptsPath, name));
};
