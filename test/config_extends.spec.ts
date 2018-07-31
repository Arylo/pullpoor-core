import test from "ava";
import { resolve } from "path";
import { getBank } from "../lib/helpers/banks";
import * as constant from "../lib/helpers/constant";

test("Config Extends with Config file", (t) => {
    constant.setValue("configsPath", resolve(constant.rootPath, "test/banks/extends"));
    const obj = getBank("yaml");
    t.not(obj.address[0], "http://example.com");
    t.is(obj.address[0], "https://example.com");
    t.is(obj.catch_options.type, "json");
});

test("Config Extends with Js file", (t) => {
    constant.setValue("configsPath", resolve(constant.rootPath, "test/banks/extends"));
    constant.setValue("scriptsPath", resolve(__dirname, "scripts/extends"));
    const obj = getBank("script");
    t.not(obj.address[0], "http://example.com");
    t.is(obj.address[0], "https://example.com");
});
