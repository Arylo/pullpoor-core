import { IHttpCatch } from "../../interfaces/script";

export abstract class CatchCacheScript implements IHttpCatch {
    public abstract catchNotes(address: string, elePromise: PromiseLike<Cheerio>): PromiseLike<string[]>;
}
