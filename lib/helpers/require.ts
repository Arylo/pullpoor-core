import * as fs from "fs";
import * as path from "path";
import { scriptsPath } from "./constant";

const scriptCache: { [path: string]: any } = { };

export const requireScript = (name: string) => {
    if (scriptCache[name]) {
        return require(path.resolve(scriptsPath, name));
    }
    const filePath = path.resolve(scriptsPath, `${name}.js`);
    // istanbul ignore if
    if (!fs.existsSync(filePath)) {
        throw new Error(`Non-exist Script File: ${name}`);
    } else {
        scriptCache[name] = true;
    }
    return require(path.resolve(scriptsPath, name));
};
