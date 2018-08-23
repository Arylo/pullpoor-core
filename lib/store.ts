import * as dtss from "dtss";
import * as lodash from "lodash";
import { getBanksList } from "./helpers/banks";
import { IStore, IStoreMap } from "./interfaces/store";

const DEADLINE_DATE = dtss.d(5);
const DEFAULT_STORE: IStore = {
    book: { },
    notes: { }
};

// tslint:disable-next-line:new-parens
export = new class {

    private store: IStoreMap = { };

    public init(objs: IStoreMap) {
        if (Object.keys(this.store).length !== 0) {
            throw new Error("Init Fail, Because it is running");
        }
        Object.keys(objs).forEach((name) => {
            const obj = objs[name];
            this.store[name] = lodash.merge({ }, DEFAULT_STORE);
            Object.keys(this.store[name])
                .forEach((key) => {
                    this.store[name][key] = obj[key] || this.store[name][key];
                });
        });
        return true;
    }

    public clearOldNotes(name: string) {
        if (!this.store[name]) {
            return this;
        }
        const currentDate = Date.now();
        const dateKeys = Object.keys(this.store[name].book || { })
            .map((date) => parseInt(date, 10))
            .filter((date) => currentDate >= date);

        for (const dateKey of dateKeys) {
            const ns = this.store[name].book[`${dateKey}`];
            ns.forEach((n) => delete this.store[name].notes[n]);
            delete this.store[name].book[`${dateKey}`];
        }
        return this;
    }

    public addNotes(name: string, noteIds: string[]) {
        if (!this.store[name]) {
            this.store[name] = lodash.merge({ }, DEFAULT_STORE);
        }
        noteIds = lodash.difference(noteIds, this.getNotes(name));
        if (noteIds.length === 0) {
            return this;
        }
        const currentDate = Date.now();
        const deadline = currentDate + DEADLINE_DATE;
        for (const noteId of noteIds) {
            this.store[name].notes[noteId] = currentDate + DEADLINE_DATE;
            if (!this.store[name].book[`${deadline}`]) {
                this.store[name].book[`${deadline}`] = [ ];
            }
            this.store[name].book[`${deadline}`].push(noteId);
        }
        return this;
    }

    public getNotes(name?: string) {
        if (name) {
            try {
                return Object.keys(this.store[name].notes);
            } catch (error) {
                return [];
            }
        } else {
            const list: string[] = [ ];
            for (const bankName of getBanksList()) {
                list.push(...this.getNotes(bankName));
            }
            return [...new Set(list)];
        }
    }

    public getStore(name: string) {
        return this.store[name];
    }

};
