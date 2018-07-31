export interface IBaseGetAddressScript {
    getAddress?: () => PromiseLike<string[]>;
}

export interface IBaseCatchNotesScript {
    catchNotes?: (address: string) => PromiseLike<string[]>;
}

export interface IBaseScript extends IBaseGetAddressScript, IBaseCatchNotesScript { }

export interface IHttpCatch {
    catchNotes: (address: string, elePromise: PromiseLike<Cheerio>) => PromiseLike<string[]>;
}
