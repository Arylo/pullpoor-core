import { ICatch } from "../interfaces/catch";
import { IYamlObject } from "../interfaces/yaml";

const bankCache: { [name: string]: IYamlObject } = { };
const catchCache: { [name: string]: ICatch } = { };

const defaultCatchCacheObject: ICatch = {
    hashes: { },
    latestUpdatedAt: 0,
    nextUpdatedAt: 0
};

export const getBankCache = (name: string) => {
    return bankCache[name];
};

export const addBankCache = (name: string, obj: IYamlObject) => {
    if (!bankCache[name]) {
        bankCache[name] = obj;
    }
    if (!(obj.base || obj.skip)) {
        addCatchCache(name);
    }
    return bankCache[name];
};

export const initCatchCache = (objs) => {
    if (Object.keys(catchCache).length !== 0) {
        throw new Error("Init Fail, Because it is running");
    }
    Object.keys(objs).forEach((name) => {
        const obj = objs[name];
        catchCache[name] = Object.assign({ }, defaultCatchCacheObject);
        Object.keys(catchCache[name])
            .forEach((key) => catchCache[name][key] = obj[key]);
    });
    return true;
};

export const addCatchCache = (name) => {
    if (!catchCache[name]) {
        catchCache[name] = Object.assign({ }, defaultCatchCacheObject);
    }
    return catchCache[name];
};

export const refreshCatchCache = (name: string) => {
    catchCache[name].latestUpdatedAt = Date.now();
    catchCache[name].nextUpdatedAt =
        catchCache[name].latestUpdatedAt + getBankCache(name).expiredAt;
};

export const isStartCatch = (name: string) => {
    return Date.now() >= catchCache[name].nextUpdatedAt;
};

export const hasCatchCache = (name: string, hashNum: string) => {
    if (!catchCache[name].hashes[hashNum]) {
        catchCache[name].hashes[hashNum] = Date.now();
        return false;
    }
    return true;
};
