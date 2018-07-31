import test from "ava";
import { resolve } from "path";
import { catchNotes, } from "../../lib";
import * as constant from "../../lib/helpers/constant";
import { sleep } from "../../lib/helpers/sleep";

test("getJSON with Cache", async (t) => {
    constant.setValue("configsPath", resolve(constant.rootPath, "test/banks/json"));
    constant.setValue("scriptsPath", resolve(__dirname, "../scripts/json"));

    const field = "normal";

    const list = await catchNotes(field);
    t.true(Array.isArray(list));
    t.is(list.length, 2);

    t.is((await catchNotes(field)).length, 0);
    await sleep(constant.DEFAULT_EXPIREDAT);
    t.is((await catchNotes(field)).length, 2);
});
