import test from "ava";
import { resolve } from "path";
import { catchNotes, getNotes } from "../../lib";
import * as constant from "../../lib/helpers/constant";

test.before(() => {
    constant.setValue("configsPath", resolve(constant.rootPath, "test/banks/json"));
    constant.setValue("scriptsPath", resolve(__dirname, "../scripts/json"));
});

test("getJSON from one bank", async (t) => {
    const field = "normal";

    const list = await catchNotes(field);
    t.true(Array.isArray(list));
    t.is(list.length, 2);
});

test("getJSON from complex structure #0", async (t) => {
    const list = await catchNotes("complex.0");
    t.true(Array.isArray(list));
    t.is(list.length, 2);
});

test("getJSON from complex structure #1", async (t) => {
    const list = await catchNotes("complex.1");
    t.true(Array.isArray(list));
    t.is(list.length, 2);
});
