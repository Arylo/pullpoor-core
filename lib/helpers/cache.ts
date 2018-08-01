import * as dtss from "dtss";
import { ICatch } from "../interfaces/catch";
import { IYamlObject } from "../interfaces/yaml";

const bankCache: { [name: string]: IYamlObject } = { };
const catchCache: { [name: string]: ICatch } = { };

const defaultCatchCacheObject: ICatch = {
    hashes: { },
    latestUpdatedAt: 0,
    nextUpdatedAt: 0
};

const HASH_CACHE_TIME = dtss.h(1);

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
    const currentDate = Date.now();
    const bool = currentDate >= catchCache[name].nextUpdatedAt;
    if (bool) {
        for (const hash of Object.keys(catchCache[name].hashes)) {
            const date = catchCache[name].hashes[hash];
            if (currentDate >= date) {
                delete catchCache[name].hashes[hash];
            }
        }
    }
    return bool;
};

export const hasCatchCache = (name: string, hashNum: string) => {
    if (!catchCache[name].hashes[hashNum]) {
        catchCache[name].hashes[hashNum] = Date.now() + HASH_CACHE_TIME;
        return false;
    }
    return true;
};
