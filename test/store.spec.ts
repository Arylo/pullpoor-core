import test from "ava";
import { resolve } from "path";
import * as constant from "../lib/helpers/constant";
import store = require("../lib/store");

test.before(() => {
    constant.setValue("configsPath", resolve(constant.rootPath, "test/banks/json"));
    constant.setValue("scriptsPath", resolve(__dirname, "scripts/json"));
});

test((t) => {
    const fields = [ "normal", "complex.0" ];

    store.addNotes(fields[0], [ "http://example.com" ]);
    t.is(store.getNotes(fields[0]).length, 1);
    t.is(store.getNotes().length, 1);

    store.addNotes(fields[0], [ "https://example.com" ]);
    t.is(store.getNotes(fields[0]).length, 2);
    t.is(store.getNotes().length, 2);

    store.addNotes(fields[0], [ "https://example.com" ]);
    t.is(store.getNotes(fields[0]).length, 2);
    t.is(store.getNotes().length, 2);

    store.addNotes(fields[1], [ "http://example.com" ]);
    t.is(store.getNotes(fields[1]).length, 1);
    t.is(store.getNotes().length, 2);
});
