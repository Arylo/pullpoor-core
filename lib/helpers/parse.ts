import { PathLike } from "fs";
import * as lodash from "lodash";
import Config = require("y-config");
import { IBaseScript } from "../interfaces/script";
import { IYamlObject } from "../interfaces/yaml";
import { getBank } from "./banks";
import { getJSON } from "./net";
import { requireScript } from "./require";

export const parse = (filepath: PathLike) => {
    const config = new Config<IYamlObject>();
    config.addConfigPath(filepath);
    let bankObj: IYamlObject = config.getConfig();
    // Extends Start
    if (bankObj.extends) {
        const baseBankObj = getBank(bankObj.extends);
        bankObj = lodash.merge({ }, baseBankObj, bankObj);
        if (baseBankObj.base) {
            delete baseBankObj.base;
        }
        delete baseBankObj.extends;
    } else if (bankObj.extends_file) {
        const baseBankObj = requireScript(bankObj.extends_file);
        bankObj = lodash.merge({ }, baseBankObj, bankObj);
        if (baseBankObj.base) {
            delete baseBankObj.base;
        }
        delete baseBankObj.extends_file;
    }
    // Extends End
    // Get Addresses Fn Start
    if (bankObj.address) {
        bankObj.address_function = defaultAddressFn(bankObj);
    } else if (bankObj.address_script) {
        let script: IBaseScript;
        if (typeof bankObj.address_script === "string") {
            script = requireScript(bankObj.address_script);
        } else if (bankObj.name) {
            script = requireScript(bankObj.name);
        }
        if (!script || typeof script.getAddress !== "function") {
            throw new Error("Function `getAddress` isnt exist in the script file");
        }
        bankObj.address_function = script.getAddress;
    }
    // Get Addresses Fn End
    // Catch Notes Fn Start
    if (bankObj.catch && Array.isArray(bankObj.catch)) {
        bankObj.catch_function = defaultCatchFn(bankObj);
    } else if (bankObj.catch_script) {
        let script: IBaseScript;
        if (typeof bankObj.catch_script === "string") {
            script = requireScript(bankObj.catch_script);
        } else if (bankObj.name) {
            script = requireScript(bankObj.name);
        }
        if (!script || typeof script.catchNotes !== "function") {
            throw new Error("Function `catchNotes` isnt exist in the script file");
        }
        bankObj.catch_function = script.catchNotes;
    }
    // Catch Notes Fn End
    if (!bankObj.base) {
        if (!bankObj || typeof bankObj.address_function !== "function") {
            throw new Error(); // TODO:
        }
        if (!bankObj || typeof bankObj.catch_function !== "function") {
            throw new Error(); // TODO:
        }
    }
    return bankObj;
};

const defaultAddressFn = (obj: IYamlObject) => {
    return () => {
        return Promise.resolve(obj.address);
    };
};

const defaultCatchFn = (obj: IYamlObject) => {
    if (obj.catch_options && obj.catch_options.type === "json") {
        return (address: string) => {
            const steps = obj.catch;
            return getJSON(address).then((val) => {
                return steps
                    .map((step) => step + "")
                    .reduce((v, item) => {
                        if (v === undefined || v === null) {
                            return v;
                        }
                        return v[item];
                    }, val as any) as string[];
            });
        };
    }
    // TODO: 载入预构建方法
    throw new Error();
};
