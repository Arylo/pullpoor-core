import test from "ava";
import { resolve } from "path";
import { catchNotes } from "../../lib";
import * as constant from "../../lib/helpers/constant";

test("getJSON from one bank", async (t) => {
    constant.setValue("configsPath", resolve(constant.rootPath, "test/banks/json"));
    constant.setValue("scriptsPath", resolve(__dirname, "../scripts/json"));

    const list = await catchNotes("normal");
    t.true(Array.isArray(list));
    t.is(list.length, 2);
});

test("getJSON from complex structure #0", async (t) => {
    constant.setValue("configsPath", resolve(constant.rootPath, "test/banks/json"));
    constant.setValue("scriptsPath", resolve(__dirname, "../scripts/json"));

    const list = await catchNotes("complex.0");
    t.true(Array.isArray(list));
    t.is(list.length, 2);
});

test("getJSON from complex structure #1", async (t) => {
    constant.setValue("configsPath", resolve(constant.rootPath, "test/banks/json"));
    constant.setValue("scriptsPath", resolve(__dirname, "../scripts/json"));

    const list = await catchNotes("complex.1");
    t.true(Array.isArray(list));
    t.is(list.length, 2);
});
