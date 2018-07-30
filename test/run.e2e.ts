import test from "ava";
import { resolve } from "path";
import { catchNotes } from "../lib";
import * as constant from "../lib/helpers/constant";

test.skip(async (t) => {
    const list = await catchNotes();
    t.true(Array.isArray(list));
});

test("skip", async (t) => {
    constant.setValue("configsPath", resolve(constant.rootPath, "test/banks/no_running"));

    const list = await catchNotes("skip");
    t.true(Array.isArray(list));
    t.is(list.length, 0);
});

test("base", async (t) => {
    constant.setValue("configsPath", resolve(constant.rootPath, "test/banks/no_running"));

    const list = await catchNotes("base");
    t.true(Array.isArray(list));
    t.is(list.length, 0);
});
