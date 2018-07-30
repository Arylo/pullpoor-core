import { PathLike } from "fs";
import Config = require("y-config");
import { IBaseScript } from "../interfaces/script";
import { IYamlObject } from "../interfaces/yaml";
import { getBank } from "./banks";
import { requireScript } from "./require";

export const parse = (filepath: PathLike) => {
    const config = new Config<IYamlObject>();
    config.addConfigPath(filepath);
    let bankObj: IYamlObject = config.getConfig();
    if (bankObj.extends) {
        const baseBankObj = getBank(bankObj.extends);
        bankObj = Object.assign({ }, baseBankObj, bankObj);
        if (baseBankObj.base) {
            delete baseBankObj.base;
        }
        delete baseBankObj.extends;
    } else if (bankObj.extends_file) {
        const baseBankObj = requireScript(bankObj.extends_file);
        bankObj = Object.assign({ }, baseBankObj, bankObj);
        if (baseBankObj.base) {
            delete baseBankObj.base;
        }
        delete baseBankObj.extends_file;
    }
    if (bankObj.address) {
        bankObj.address_funcion = async () => {
            return bankObj.address;
        };
    } else if (bankObj.address_script) {
        let script: IBaseScript;
        if (typeof bankObj.address_script === "string") {
            script = requireScript(bankObj.address_script);
        } else if (bankObj.name) {
            script = requireScript(bankObj.name);
        }
        if (!script || typeof script.getAddress !== "function") {
            throw new Error(); // TODO:
        }
        bankObj.address_funcion = script.getAddress;
    }
    if (bankObj.catch) {
        // TODO: 载入预构建方法
    } else if (bankObj.catch_script) {
        let script: IBaseScript;
        if (typeof bankObj.catch_script === "string") {
            script = requireScript(bankObj.catch_script);
        } else if (bankObj.name) {
            script = requireScript(bankObj.name);
        }
        if (!script || typeof script.catchNotes !== "function") {
            throw new Error(); // TODO:
        }
        bankObj.catch_funcion = script.catchNotes;
    }
    return bankObj;
};
