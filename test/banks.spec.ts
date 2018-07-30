import test from "ava";
import { resolve } from "path";
import { getBanksList } from "../lib";
import * as constant from "../lib/helpers/constant";

test((t) => {
    constant.setValue("configsPath", resolve(constant.rootPath, "test/banks"));
    t.is(getBanksList().length, 0);
});

test("Custom config path", (t) => {
    constant.setValue("configsPath", resolve(constant.rootPath, "test/banks/no_running"));
    t.is(getBanksList().length, 2);
});

test("Custom config path with folder", (t) => {
    constant.setValue("configsPath", resolve(constant.rootPath, "test/banks/folder"));
    t.is(getBanksList().length, 0);
});
