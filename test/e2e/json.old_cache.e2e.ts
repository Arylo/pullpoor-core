import test from "ava";
import { resolve } from "path";
import { catchNotes, initCatchCache } from "../../lib";
import * as constant from "../../lib/helpers/constant";
import { sleep } from "../../lib/helpers/sleep";

test("getJSON with Old Cache", async (t) => {
    constant.setValue("configsPath", resolve(constant.rootPath, "test/banks/json"));
    constant.setValue("scriptsPath", resolve(__dirname, "../scripts/json"));

    const field = "normal";

    initCatchCache({
        [field]: {
            hashes: {},
            latestUpdatedAt: Date.now(),
            nextUpdatedAt: Date.now() + constant.DEFAULT_EXPIREDAT
        }
    });

    t.is((await catchNotes(field)).length, 0);
    await sleep(constant.DEFAULT_EXPIREDAT);
    t.is((await catchNotes(field)).length, 2);
});
