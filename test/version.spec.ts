import test from "ava";
import { remoteVersion, version } from "../lib";

test("Function version()", (t) => {
    t.is(typeof version(), "string");
});

test("Function remoteVersion()", (t) => {
    t.is(typeof remoteVersion(), "string");
});
