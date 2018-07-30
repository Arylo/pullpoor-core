import * as fs from "fs";
import * as path from "path";

const scriptCache: { [path: string]: any } = { };
const scriptsPath = path.resolve(__dirname, "../scripts");

export const requireScript = (name: string) => {
    if (scriptCache[name]) {
        return require(path.resolve(scriptsPath, name));
    }
    const filepath = path.resolve(scriptsPath, `${name}.js`);
    if (!fs.existsSync(filepath)) {
        throw new Error(); // TODO: 丢失内容
    } else {
        scriptCache[name] = true;
    }
    return require(path.resolve(scriptsPath, name));
};
