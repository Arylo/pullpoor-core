import test from "ava";
import * as lodash from "lodash";
import { catchNotes, getBanksList } from "../../lib";

test(async (t) => {
    const list = ["yqie", "yundaili"]
        .concat(lodash.sampleSize(getBanksList(), 3));
    const notes = await catchNotes(list);
    t.true(Array.isArray(notes));
});
