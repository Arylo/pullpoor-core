import test from "ava";
import { resolve } from "path";
import { catchNotes } from "../../lib";
import * as constant from "../../lib/helpers/constant";

test("getJSON from banks", async (t) => {
    constant.setValue("configsPath", resolve(constant.rootPath, "test/banks/json"));
    constant.setValue("scriptsPath", resolve(__dirname, "../scripts/json"));

    const list = await catchNotes();
    t.true(Array.isArray(list));
    t.is(list.length, 2);
});
