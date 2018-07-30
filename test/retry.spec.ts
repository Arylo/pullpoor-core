import test from "ava";
import { retryCount, retryFnAsync } from "../lib/helpers/retryFn";

test("No Error", async (t) => {
    t.plan(1);
    await retryFnAsync(() => {
        t.pass();
        return Promise.resolve();
    });
});

test("Fail once", async (t) => {
    const failCount = 1;
    let index = 0;
    t.plan(2);
    await retryFnAsync(() => {
        if (index !== failCount) {
            index++;
            t.pass();
            return Promise.reject();
        }
        t.pass();
        return Promise.resolve();
    });
});

test("Fail twice", async (t) => {
    const failCount = 2;
    let index = 0;
    t.plan(3);
    await retryFnAsync(() => {
        if (index !== failCount) {
            index++;
            t.pass();
            return Promise.reject();
        }
        t.pass();
        return Promise.resolve();
    });
});

test("Fail three times", async (t) => {
    const failCount = 3;
    let index = 0;
    t.plan(4);
    await retryFnAsync(() => {
        if (index !== failCount) {
            index++;
            t.pass();
            return Promise.reject();
        }
        t.pass();
        return Promise.resolve();
    });
});

test("Fail four times", async (t) => {
    const failCount = 4;
    let index = 0;
    t.plan(5);
    await retryFnAsync(() => {
        if (index !== failCount) {
            index++;
            t.pass();
            return Promise.reject();
        }
        t.pass();
        return Promise.resolve();
    });
});

test("Fail five times", async (t) => {
    const failCount = 5;
    let index = 0;
    t.plan(5);
    try {
        await retryFnAsync(() => {
            if (index !== failCount) {
                index++;
                t.pass();
                return Promise.reject();
            }
            t.pass();
            return Promise.resolve();
        });
    // tslint:disable-next-line:no-empty
    } catch (e) { }
});

test("Always Fail", async (t) => {
    t.plan(retryCount);
    try {
        await retryFnAsync(() => {
            t.pass();
            return Promise.reject();
        });
    // tslint:disable-next-line:no-empty
    } catch (e) { }
});

test("Custom Fail count #0", async (t) => {
    t.plan(1);
    try {
        await retryFnAsync(() => {
            t.pass();
            return Promise.reject();
        }, 1);
    // tslint:disable-next-line:no-empty
    } catch (e) { }
});

test("Custom Fail count #1", async (t) => {
    t.plan(10);
    try {
        await retryFnAsync(() => {
            t.pass();
            return Promise.reject();
        }, 10);
    // tslint:disable-next-line:no-empty
    } catch (e) { }
});
