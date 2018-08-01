import * as dtss from "dtss";
import * as lodash from "lodash";
import { getBanksList } from "./helpers/banks";
import { IStore } from "./interfaces/store";

const DEADLINE_DATE = dtss.d(5);
const DEFAULT_STORE: IStore = {
    book: { },
    notes: { }
};

// tslint:disable-next-line:new-parens
export = new class {

    private store: { [name: string]: IStore } = { };

    public clearOldNotes(name: string) {
        if (!this.store[name]) {
            return this;
        }
        const currentDate = Date.now();
        const dateKeys = Object.keys(this.store[name].book)
            .map((date) => parseInt(date, 10))
            .filter((date) => currentDate >= date);
        const notes: string[] = [ ];
        for (const dateKey of dateKeys) {
            const ns = this.store[name].book[`${dateKey}`];
            ns.forEach((n) => delete this.store[name].notes[n]);
            delete this.store[name].book[`${dateKey}`];
        }
        return this;
    }

    public addNotes(name: string, notes: string[]) {
        if (!this.store[name]) {
            this.store[name] = lodash.merge({ }, DEFAULT_STORE);
        }
        if (notes.length === 0) {
            return this;
        }
        const currentDate = Date.now();
        const deadline = Date.now() + DEADLINE_DATE;
        for (const note of notes) {
            if (this.store[name].notes[note]) {
                continue;
            }
            this.store[name].notes[note] = currentDate + DEADLINE_DATE;
            if (!this.store[name].book[`${deadline}`]) {
                this.store[name].book[`${deadline}`] = [ ];
            }
            this.store[name].book[`${deadline}`].push(note);
        }
        return this;
    }

    public getNotes(name?: string) {
        const list: string[] = [ ];
        if (name) {
            if (!this.store[name]) {
                return list;
            }
            for (const dateKey of Object.keys(this.store[name].book)) {
                list.push(...this.store[name].book[dateKey]);
            }
        } else {
            for (const bankName of getBanksList()) {
                list.push(...this.getNotes(bankName));
            }
        }
        return [...new Set(list)];
    }
};
