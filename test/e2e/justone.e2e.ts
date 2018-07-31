import test from "ava";
import { catchNotes } from "../../lib";

test(async (t) => {
    const list = await catchNotes();
    t.true(Array.isArray(list));
});
